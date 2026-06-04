/**
 * Card creation and DOM building for Simple Swipe Card
 */

import { logDebug } from "../utils/Debug.js";
import { getHelpers } from "./Dependencies.js";
import {
  createSlide,
  createPreviewContainer,
  applyBorderRadiusToSlides,
} from "../ui/DomHelpers.js";
import { getStyles } from "../ui/Styles.js";
import { handleEditClick } from "../utils/EventHelpers.js";
import { applyUix } from "./UixIntegration.js";

/**
 * Card builder class for managing card creation and layout
 */
export class CardBuilder {
  constructor(cardInstance) {
    this.card = cardInstance;
  }

  /**
   * Checks if the card is currently in the Lovelace editor
   * @returns {boolean} True if in editor mode
   */
  _isInEditorMode() {
    // Tags whose presence as an ancestor (or shadow host) means we're being
    // rendered for editing/preview rather than on a live dashboard.
    // `hui-card-picker` covers the "Add card" gallery, which renders the card
    // outside hui-card-preview/editor (so it must be matched explicitly).
    const editorTags = [
      "hui-card-preview",
      "hui-card-editor",
      "hui-dialog-edit-card",
      "hui-card-picker",
    ];

    let parent = this.card.parentElement;
    while (parent) {
      const tagName = parent.tagName?.toLowerCase();
      if (editorTags.includes(tagName)) {
        return true;
      }
      // Also check shadow DOM hosts
      if (parent.getRootNode()?.host) {
        const hostTag = parent.getRootNode().host.tagName?.toLowerCase();
        if (editorTags.includes(hostTag)) {
          return true;
        }
      }
      parent = parent.parentElement;
    }
    return false;
  }

  /**
   * Builds or rebuilds the entire card
   * @returns {Promise<boolean>} True if build succeeded, false if skipped
   */
  async build() {
    if (this.card.building) {
      logDebug("INIT", "Build already in progress, skipping.");
      return false;
    }
    if (
      !this.card._config ||
      !this.card._config.cards ||
      !this.card.isConnected
    ) {
      logDebug("INIT", "Build skipped (no config/cards or not connected).");
      return false;
    }

    this.card.building = true;
    logDebug("INIT", "Starting build...");

    // CRITICAL: Set build timestamp immediately to prevent stale builds from completing
    // This prevents race conditions when disconnect/reconnect happens during build
    const buildTimestamp = Date.now();
    this.card._currentBuildTimestamp = buildTimestamp;
    logDebug("INIT", `Build timestamp set: ${buildTimestamp}`);

    // CLEAR CACHED CAROUSEL DIMENSIONS TO PREVENT STALE DATA
    this.card._carouselCardWidth = null;
    this.card._carouselCardsVisible = null;
    logDebug("INIT", "Cleared cached carousel dimensions");

    // Preserve reset-after state before rebuild
    this.card.resetAfter?.preserveState();

    // Stop observing child card visibility during rebuild
    this.card._cleanupChildVisibilityObserver();

    // Reset state - but preserve currentIndex for state sync during rebuilds
    this.card.cards = [];

    // Store current index to check if this is first build vs rebuild
    const wasAtDefaultPosition = this.card.currentIndex === 0;

    // Only reset currentIndex if state sync is not configured
    if (!this.card._config.state_entity || !this.card._hass) {
      // Get evaluated value for reset_target_card (supports templates)
      const targetCard = this.card.getEvaluatedConfigValue(
        "reset_target_card",
        1,
      );
      // Convert from 1-based to 0-based index
      this.card.currentIndex = Math.max(0, parseInt(targetCard) - 1 || 0);
      if (this.card.currentIndex !== 0) {
        logDebug(
          "INIT",
          `Setting initial index to ${this.card.currentIndex} (target card ${targetCard})`,
        );
      }
    }
    // If state sync is configured, preserve currentIndex during rebuilds

    this.card.virtualIndex = 0;
    this.card.realIndex = 0;

    this.card.resizeObserver?.cleanup();
    this.card.swipeGestures?.removeGestures();
    this.card.autoSwipe?.stop();
    this.card.resetAfter?.stopTimer();
    this.card.swipeEffects?.resetEffects();

    // Wait for LitElement to create shadowRoot if not yet available
    if (!this.card.shadowRoot) {
      logDebug("INIT", "Waiting for LitElement to create shadowRoot...");
      setTimeout(() => {
        if (this.card.isConnected) {
          this.build();
        }
      }, 10);
      this.card.building = false;
      return false;
    }

    if (this.card.shadowRoot) this.card.shadowRoot.innerHTML = "";

    const root = this.card.shadowRoot;

    logDebug("INIT", "Building with shadowRoot:", !!root);

    const helpers = await getHelpers();

    // CRITICAL: Check if card was disconnected while waiting for helpers
    // This prevents building in a disconnected state which causes the card to never display
    if (!this.card.isConnected) {
      logDebug(
        "INIT",
        "Card disconnected while waiting for helpers, aborting build",
      );
      this.card.building = false;
      this.card.initialized = false;
      return false;
    }

    if (!helpers) {
      console.error("SimpleSwipeCard: Card helpers not loaded.");
      root.innerHTML = `<ha-alert alert-type="error">Card Helpers are required for this card to function. Please ensure they are loaded.</ha-alert>`;
      this.card.building = false;
      this.card.initialized = false;
      return false;
    }

    // Add styles
    const style = document.createElement("style");
    style.textContent = getStyles();
    root.appendChild(style);

    // Create container structure
    this.card.cardContainer = document.createElement("div");
    this.card.cardContainer.className = "card-container";

    this.card.sliderElement = document.createElement("div");
    this.card.sliderElement.className = "slider";
    // Add swipe direction as a data attribute
    this.card.sliderElement.setAttribute(
      "data-swipe-direction",
      this.card._swipeDirection,
    );

    // Native CSS scroll-snap strategy: tag the slider so the scroll-snap CSS
    // rules apply, and set the per-slide snap alignment (centered carousel peeks
    // both neighbours, everything else snaps to the start edge).
    const scrollStrategy = this.card._config.scroll_strategy || "js";
    this.card.sliderElement.setAttribute(
      "data-scroll-strategy",
      scrollStrategy,
    );
    if (scrollStrategy === "css") {
      const centered =
        this.card._config.view_mode === "carousel" &&
        this.card._config.carousel_alignment === "center";
      this.card.sliderElement.style.setProperty(
        "--ssc-scroll-snap-align",
        centered ? "center" : "start",
      );
    }

    // CRITICAL: Hide slider immediately to prevent flash of unstyled content
    this.card.sliderElement.style.opacity = "0";
    logDebug("INIT", "Slider hidden during build to prevent layout flash");

    this.card.cardContainer.appendChild(this.card.sliderElement);
    root.appendChild(this.card.cardContainer);

    // Update visible card indices
    this.card._updateVisibleCardIndices();

    // Handle empty state - show preview only in editor/picker contexts
    if (this.card._config.cards.length === 0) {
      // HA's card picker sets `preview = true` on the instance it renders in the
      // "Add card" gallery; the edit dialog is caught by _isInEditorMode(). Show
      // the placeholder in both, but still render nothing on a live dashboard
      // (e.g. auto-entities loading) to avoid a flash of the empty-state preview.
      const showPreview = this._isInEditorMode() || this.card.preview === true;
      logDebug("INIT", `No cards configured, show preview: ${showPreview}`);

      if (showPreview) {
        // In editor mode: show the preview with "Edit Card" button
        logDebug("INIT", "Building preview state for editor.");
        const previewContainer = createPreviewContainer(
          this.card._swipeDirection,
          (e) => handleEditClick(e, this.card),
        );

        // Append the preview directly to the shadow root, not inside the slider
        root.innerHTML = ""; // Clear previous content (including styles)
        root.appendChild(style); // Re-add styles
        root.appendChild(previewContainer);
      } else {
        // Not in editor mode: show nothing (empty card)
        // This prevents the "flash of preview" when auto-entities is loading
        logDebug("INIT", "No cards and not in editor - showing empty state.");
        root.innerHTML = ""; // Clear any previous content
        root.appendChild(style); // Keep styles for when cards arrive
        // Don't show preview - just wait for cards to be populated
      }

      this.card.initialized = true;
      this.card.building = false;
      // No layout finish needed for empty/preview state
      return true; // Successfully handled empty state
    }

    // Handle case where no cards are visible - COMPLETELY HIDE THE CARD
    if (this.card.visibleCardIndices.length === 0) {
      logDebug("INIT", "No visible cards, hiding entire card.");

      // Make the entire card invisible
      this.card.style.display = "none";

      // Clear the shadow root content
      root.innerHTML = "";

      this.card.initialized = true;
      this.card.building = false;
      return true; // Successfully handled no visible cards state
    }

    // If we reach here, we have visible cards - ensure card is visible
    this.card.style.display = "block";

    // Initialize loop mode
    this.card.loopMode.initialize();

    // Build cards with duplication for infinite loop
    const cardsToLoad = this.card.loopMode.prepareCardsForLoading(
      this.card.visibleCardIndices,
      this.card._config.cards,
    );

    logDebug("INIT", `Building cards:`, {
      totalVisible: this.card.visibleCardIndices.length,
      totalToLoad: cardsToLoad.length,
      infiniteMode: this.card.loopMode.isInfiniteMode,
    });

    // === STAGGER LOADING IMPLEMENTATION ===
    const viewMode = this.card._config.view_mode || "single";

    // LAYOUT-CARD COMPATIBILITY: Detect if inside layout-card
    const isInsideLayoutCard = this._detectLayoutCard();

    if (isInsideLayoutCard) {
      const layoutType =
        this.card.getAttribute("data-in-layout-container") || "unknown";
      logDebug(
        "INIT",
        `${layoutType} detected - using synchronous loading for compatibility`,
      );

      // Make detection clearly visible in console
      console.log(
        `SimpleSwipeCard: SYNCHRONOUS LOADING ACTIVE`,
        "background: #ff9800; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
        `Detected ${layoutType} container - preventing duplicate cards bug`,
      );

      // Use the build timestamp set at the start of build()
      const buildTimestamp = this.card._currentBuildTimestamp;

      // Load all cards synchronously to prevent layout-card calculation issues
      const allCardsPromises = cardsToLoad.map((cardInfo) =>
        this.createCard(
          cardInfo.config,
          cardInfo.visibleIndex,
          cardInfo.originalIndex,
          helpers,
          cardInfo.isDuplicate,
          buildTimestamp,
        ).catch((error) => {
          console.warn(`Card ${cardInfo.visibleIndex} failed to load:`, error);
          return null;
        }),
      );

      await Promise.allSettled(allCardsPromises);

      // Check if this build is still the current one
      // Another build might have started during the await
      if (this.card._currentBuildTimestamp !== buildTimestamp) {
        logDebug("INIT", "Build superseded by newer build, aborting this one", {
          thisBuild: buildTimestamp,
          currentBuild: this.card._currentBuildTimestamp,
        });

        // Clear any cards created by this superseded build
        this.card.cards = [];

        return false;
      }

      // Check if card is still connected after async operation
      if (!this.card.isConnected || !this.card.sliderElement) {
        logDebug(
          "INIT",
          "Card disconnected during build, aborting and cleaning up",
          {
            connected: this.card.isConnected,
            hasSlider: !!this.card.sliderElement,
          },
        );

        // Clear the cards array to prevent stale references
        this.card.cards = [];

        // Mark as not building so reconnection can trigger new build
        this.card.building = false;

        // Mark as not initialized to force proper rebuild on reconnection
        this.card.initialized = false;

        return false;
      }

      this._insertLoadedCardsIntoDom();

      logDebug("INIT", "All cards loaded synchronously for layout-card");

      // Initialize if needed
      if (!this.card.initialized) {
        this.card.initialized = true;
        if (wasAtDefaultPosition) {
          requestAnimationFrame(() => {
            if (this.card.isConnected && this.card.cardContainer) {
              this.finishBuildLayout(buildTimestamp);
            }
          });
        } else {
          requestAnimationFrame(() => {
            if (this.card.isConnected && this.card.cardContainer) {
              this.finishBuildLayout(buildTimestamp);
            }
          });
        }
      } else {
        requestAnimationFrame(() => {
          if (this.card.isConnected && this.card.cardContainer) {
            this.finishBuildLayout(buildTimestamp);
          }
        });
      }

      this.card.building = false;
      logDebug("INIT", "Build completed successfully (layout-card mode)");
      return true;
    }

    if (viewMode === "carousel") {
      // CAROUSEL MODE: Create DOM structure immediately, load content progressively
      logDebug(
        "INIT",
        "Carousel mode detected - creating DOM structure for layout, loading content progressively",
      );

      // Step 1: Create all slide containers immediately for proper carousel layout
      cardsToLoad.forEach((cardInfo) => {
        const slideDiv = createSlide();

        // Add debug attributes
        slideDiv.setAttribute("data-index", cardInfo.originalIndex);
        slideDiv.setAttribute("data-visible-index", cardInfo.visibleIndex);
        if (cardInfo.isDuplicate) {
          slideDiv.setAttribute("data-duplicate", "true");
        }
        if (cardInfo.config?.type) {
          slideDiv.setAttribute("data-card-type", cardInfo.config.type);
        }

        // Add to cards array with empty content initially
        this.card.cards.push({
          visibleIndex: cardInfo.visibleIndex,
          originalIndex: cardInfo.originalIndex,
          slide: slideDiv,
          config: JSON.parse(JSON.stringify(cardInfo.config)),
          error: false,
          isDuplicate: cardInfo.isDuplicate,
          element: null, // Will be populated later
          contentLoaded: false,
        });

        // Add slide to DOM immediately
        this.card.sliderElement.appendChild(slideDiv);

        // Start observing slide for auto height (even if empty)
        if (this.card.autoHeight?.enabled) {
          this.card.autoHeight.observeSlide(slideDiv, cardInfo.visibleIndex);
        }
      });

      // Sort cards by visibleIndex to maintain order
      this.card.cards.sort((a, b) => a.visibleIndex - b.visibleIndex);

      logDebug(
        "INIT",
        "Carousel DOM structure created, now loading content progressively",
      );

      // Step 2: Load card content progressively to prevent websocket overload
      const batches = this._createPrioritizedBatches(cardsToLoad);

      // Load first batch (visible cards) immediately
      const firstBatch = batches[0] || [];
      if (firstBatch.length > 0) {
        await this._loadCarouselBatch(
          firstBatch,
          helpers,
          "priority",
          buildTimestamp,
        );
      }

      // Load remaining batches with staggered delay
      for (let i = 1; i < batches.length; i++) {
        const batch = batches[i];
        const delay = i * 150; // 150ms delay between batches

        setTimeout(async () => {
          if (!this.card.isConnected) return;
          await this._loadCarouselBatch(
            batch,
            helpers,
            `batch-${i + 1}`,
            buildTimestamp,
          );
        }, delay);
      }
    } else {
      // SINGLE MODE: Use original stagger loading
      const batches = this._createPrioritizedBatches(cardsToLoad);

      logDebug("INIT", "Single mode stagger loading strategy:", {
        totalBatches: batches.length,
        batchSizes: batches.map((batch) => batch.length),
        firstBatchCards:
          batches[0]?.map((c) => `${c.visibleIndex}(${c.originalIndex})`) || [],
      });

      // Load first batch (visible cards) immediately
      const firstBatch = batches[0] || [];
      if (firstBatch.length > 0) {
        logDebug(
          "INIT",
          "Loading priority batch immediately:",
          firstBatch.length,
        );

        const firstBatchPromises = firstBatch.map((cardInfo) =>
          this.createCard(
            cardInfo.config,
            cardInfo.visibleIndex,
            cardInfo.originalIndex,
            helpers,
            cardInfo.isDuplicate,
            buildTimestamp,
          ).catch((error) => {
            console.warn(
              `Priority card ${cardInfo.visibleIndex} failed to load:`,
              error,
            );
            return null;
          }),
        );

        await Promise.allSettled(firstBatchPromises);
        this._insertLoadedCardsIntoDom();
        logDebug("INIT", "Priority batch loaded and displayed");
      }

      // Load remaining batches with staggered delay
      for (let i = 1; i < batches.length; i++) {
        const batch = batches[i];
        const delay = i * 200; // 200ms delay between batches

        setTimeout(async () => {
          if (!this.card.isConnected) return;

          logDebug(
            "INIT",
            `Loading batch ${i + 1}/${batches.length} after ${delay}ms`,
          );

          const batchPromises = batch.map((cardInfo) =>
            this.createCard(
              cardInfo.config,
              cardInfo.visibleIndex,
              cardInfo.originalIndex,
              helpers,
              cardInfo.isDuplicate,
              buildTimestamp,
            ).catch((error) => {
              console.warn(
                `Background card ${cardInfo.visibleIndex} failed to load:`,
                error,
              );
              return null;
            }),
          );

          await Promise.allSettled(batchPromises);
          this._insertLoadedCardsIntoDom();
          logDebug("INIT", `Batch ${i + 1} completed`);
        }, delay);
      }

      // Ensure priority cards are in the DOM immediately
      // Check if card is still connected before inserting
      if (!this.card.isConnected || !this.card.sliderElement) {
        logDebug("INIT", "Card disconnected before inserting priority cards");

        // CRITICAL: Clear the cards array to prevent stale references
        this.card.cards = [];
        this.card.building = false;
        this.card.initialized = false;

        return false;
      }

      this._insertLoadedCardsIntoDom();
    }

    // Set initial state based on configuration
    if (this.card._config.state_entity && this.card._hass) {
      const targetIndex = this._getStateSyncInitialIndex();
      if (targetIndex !== this.card.currentIndex) {
        logDebug(
          "STATE",
          "Setting initial index from state sync:",
          targetIndex,
        );
        this.card.currentIndex = targetIndex;
      }
    }

    // Create pagination
    this.card.pagination.create();

    logDebug("INIT", "All cards initialized.");

    // Initialize if this is the first build
    if (!this.card.initialized) {
      this.card.initialized = true;

      // Schedule layout finalization - but check connection first
      requestAnimationFrame(() => {
        if (this.card.isConnected && this.card.cardContainer) {
          this.finishBuildLayout(buildTimestamp);
        } else {
          logDebug("INIT", "Card disconnected before finishBuildLayout");
        }
      });
    } else {
      // This is a rebuild - finalize immediately
      requestAnimationFrame(() => {
        if (this.card.isConnected && this.card.cardContainer) {
          this.finishBuildLayout(buildTimestamp);
        } else {
          logDebug(
            "INIT",
            "Card disconnected before finishBuildLayout (rebuild)",
          );
        }
      });
    }

    this.card.building = false;
    logDebug("INIT", "Build completed successfully");

    // Setup input listeners for auto-swipe pause on text input
    this.card._setupInputListeners();

    return true;
  }

  /**
   * Creates a card element and adds it to the slider
   * @param {number} buildTimestamp - Timestamp of the build that initiated this card creation
   */
  async createCard(
    cardConfig,
    visibleIndex,
    originalIndex,
    helpers,
    isDuplicate = false,
    buildTimestamp = null,
  ) {
    const slideDiv = createSlide();
    let cardElement;
    const cardData = {
      visibleIndex,
      originalIndex,
      slide: slideDiv,
      config: JSON.parse(JSON.stringify(cardConfig)),
      error: false,
      isDuplicate: isDuplicate,
    };

    try {
      // Create the card element
      cardElement = await helpers.createCardElement(cardConfig);

      // CRITICAL: Check if this build is still current after async operation
      // This prevents duplicate cards when multiple builds overlap (e.g., in Masonry layouts)
      if (
        buildTimestamp &&
        this.card._currentBuildTimestamp !== buildTimestamp
      ) {
        logDebug("INIT", `Discarding card ${visibleIndex} from stale build`, {
          cardBuild: buildTimestamp,
          currentBuild: this.card._currentBuildTimestamp,
        });
        return; // Don't push this card - it's from an old build
      }

      // Set hass IMMEDIATELY after creation, before any async operations
      // This prevents race conditions with cards that need hass during initialization
      if (this.card._hass) {
        cardElement.hass = this.card._hass;
        logDebug(
          "INIT",
          `Set hass immediately after creation for card ${visibleIndex} (type: ${cardConfig.type})`,
        );
      }

      cardData.element = cardElement;

      // Add special attribute for picture-elements cards to enhance tracking
      if (cardConfig.type === "picture-elements") {
        cardElement.setAttribute("data-swipe-card-picture-elements", "true");
        slideDiv.setAttribute("data-has-picture-elements", "true");
      }

      // Append card to slide
      slideDiv.appendChild(cardElement);

      // CARD-MOD COMPATIBILITY:
      // card-mod applies styles via a global MutationObserver on inserted cards.
      // Only when card-mod is actually installed do we yield an extra 30ms after
      // paint so its observer can process this card; otherwise a single frame is
      // enough and we avoid N×30ms of startup latency for everyone else.
      const cardModPresent = !!customElements.get("card-mod");
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          if (cardModPresent) {
            // After paint cycle, give card-mod's MutationObserver time to process
            setTimeout(resolve, 30);
          } else {
            resolve();
          }
        });
      });

      // Check again after async operation
      if (
        buildTimestamp &&
        this.card._currentBuildTimestamp !== buildTimestamp
      ) {
        logDebug(
          "INIT",
          `Discarding card ${visibleIndex} from stale build (after card-mod wait)`,
          {
            cardBuild: buildTimestamp,
            currentBuild: this.card._currentBuildTimestamp,
          },
        );
        return; // Don't push this card - it's from an old build
      }

      // Apply UIX styling to the child card if configured (no-op without UIX/uix config)
      applyUix(cardElement, cardConfig?.uix, cardConfig, "card");

      // Special handling for specific card types
      requestAnimationFrame(() => {
        try {
          if (cardConfig.type === "todo-list") {
            const textField =
              cardElement.shadowRoot?.querySelector("ha-textfield");
            const inputElement = textField?.shadowRoot?.querySelector("input");
            if (inputElement) inputElement.enterKeyHint = "done";
          }
        } catch (e) {
          console.warn("Error applying post-creation logic:", e);
        }
      });
    } catch (e) {
      logDebug(
        "ERROR",
        `Error creating card ${visibleIndex} (original ${originalIndex}):`,
        cardConfig,
        e,
      );
      cardData.error = true;

      // Check if build is still current before creating error card
      if (
        buildTimestamp &&
        this.card._currentBuildTimestamp !== buildTimestamp
      ) {
        logDebug(
          "INIT",
          `Discarding error card ${visibleIndex} from stale build`,
        );
        return;
      }

      // Create error card with user-friendly message
      const errorCard = await helpers.createErrorCardElement(
        {
          type: "error",
          error: `Failed to create card: ${e.message}`,
          origConfig: cardConfig,
        },
        this.card._hass,
      );
      cardData.element = errorCard;
      slideDiv.appendChild(errorCard);
    }

    // Final check before pushing to array
    if (buildTimestamp && this.card._currentBuildTimestamp !== buildTimestamp) {
      logDebug(
        "INIT",
        `Discarding card ${visibleIndex} from stale build (final check)`,
      );
      return;
    }

    // Use push instead of array index assignment to handle negative visibleIndex values
    this.card.cards.push(cardData);
  }

  /**
   * Handles visibility changes from conditional cards
   * @param {number} originalIndex - Original index of the conditional card
   * @param {boolean} visible - Whether the card is now visible
   * @private
   */
  _handleConditionalCardVisibilityChange(originalIndex, visible) {
    logDebug(
      "VISIBILITY",
      `Conditional card ${originalIndex} visibility changed to: ${visible}`,
    );

    // Find the card data
    const cardData = this.card.cards.find(
      (card) => card.originalIndex === originalIndex,
    );
    if (cardData) {
      cardData.conditionallyVisible = visible;
    }

    // Update the card's visibility and rebuild if necessary
    this.card._handleConditionalVisibilityChange();
  }

  /**
   * Fixes mushroom-select dropdown positioning by intercepting menu opens
   * and adjusting position to account for CSS transforms on parent slides
   * @private
   */
  _fixMushroomSelectPositioning() {
    if (!this.card.sliderElement) return;

    logDebug("MUSHROOM", "Checking for mushroom-select elements...");

    // Find all mushroom-select elements in all slides
    // Note: mushroom-select can be standalone or inside mushroom-select-card
    const mushroomSelectCards = this.card.sliderElement.querySelectorAll(
      "mushroom-select-card",
    );
    const standaloneSelects =
      this.card.sliderElement.querySelectorAll("mushroom-select");

    logDebug(
      "MUSHROOM",
      `Found ${mushroomSelectCards.length} mushroom-select-card(s) and ${standaloneSelects.length} standalone mushroom-select element(s)`,
    );

    // Collect all mushroom-select elements (from cards and standalone)
    // Store both the select element and its root element (for finding parent slide)
    const allSelects = [];

    // Extract mushroom-select from mushroom-select-card shadow roots
    // Structure: mushroom-select-card -> shadowRoot -> mushroom-card (in shadow)
    //            mushroom-card has light DOM children including mushroom-select-option-control
    //            mushroom-select-option-control -> shadowRoot -> mushroom-select
    mushroomSelectCards.forEach((card) => {
      // First shadow root level: get mushroom-card
      const mushroomCard = card.shadowRoot?.querySelector("mushroom-card");
      if (mushroomCard) {
        logDebug("MUSHROOM", "Found mushroom-card inside mushroom-select-card");

        // mushroom-select-option-control is in mushroom-card's LIGHT DOM (not shadow root)
        // It's a direct child element that gets slotted into the shadow root's <slot>
        const optionControl = mushroomCard.querySelector(
          "mushroom-select-option-control",
        );
        if (optionControl) {
          logDebug(
            "MUSHROOM",
            "Found mushroom-select-option-control in mushroom-card's light DOM",
          );

          // Now look inside mushroom-select-option-control's shadow root for mushroom-select
          const select =
            optionControl.shadowRoot?.querySelector("mushroom-select");
          if (select) {
            // Store both the select and the card (card is in light DOM and can use closest)
            allSelects.push({ select, rootElement: card });
            logDebug(
              "MUSHROOM",
              "Found mushroom-select inside mushroom-select-option-control's shadow root",
            );
          } else {
            logDebug(
              "MUSHROOM",
              "mushroom-select-option-control found but no mushroom-select in its shadow root",
            );
          }
        } else {
          logDebug(
            "MUSHROOM",
            "mushroom-card found but no mushroom-select-option-control in its light DOM",
          );
        }
      } else {
        logDebug(
          "MUSHROOM",
          "mushroom-select-card found but no mushroom-card inside shadow root",
        );
      }
    });

    // Add standalone mushroom-select elements
    standaloneSelects.forEach((select) => {
      allSelects.push({ select, rootElement: select });
    });

    if (allSelects.length > 0) {
      logDebug(
        "MUSHROOM",
        `Total ${allSelects.length} mushroom-select element(s) found, setting up dropdown positioning fix...`,
      );

      allSelects.forEach((item, index) => {
        const { select, rootElement } = item;

        try {
          // Disable fixed menu positioning - we'll handle positioning manually
          if (select.fixedMenuPosition !== false) {
            select.fixedMenuPosition = false;
            logDebug(
              "MUSHROOM",
              `mushroom-select #${index + 1} - disabled fixedMenuPosition`,
            );
          }

          // Enable naturalMenuWidth for better dropdown sizing
          if (select.naturalMenuWidth !== true) {
            select.naturalMenuWidth = true;
            logDebug(
              "MUSHROOM",
              `mushroom-select #${index + 1} - enabled naturalMenuWidth`,
            );
          }

          // Find the parent slide using the root element (which is in light DOM)
          const parentSlide = rootElement.closest(".slide");
          if (!parentSlide) {
            logDebug(
              "MUSHROOM",
              `mushroom-select #${index + 1} - no parent slide found`,
            );
            return;
          }

          logDebug(
            "MUSHROOM",
            `mushroom-select #${index + 1} - found parent slide`,
          );

          // Track whether we've set up the menu listener
          let menuListenerAttached = false;

          // Function to attach the position fix listener to the menu
          const attachMenuListener = (menu) => {
            if (menuListenerAttached) return;
            menuListenerAttached = true;

            // Listen for menu opening
            menu.addEventListener("opened", () => {
              logDebug(
                "MUSHROOM",
                `mushroom-select #${index + 1} - menu opened, adjusting position...`,
              );

              // Get the menu surface element
              const menuSurface =
                menu.shadowRoot?.querySelector(".mdc-menu-surface");
              if (!menuSurface) {
                logDebug(
                  "MUSHROOM",
                  `mushroom-select #${index + 1} - menu surface not found`,
                );
                return;
              }

              // Get the slide's current transform
              const slideTransform = window.getComputedStyle(
                this.card.sliderElement,
              ).transform;
              logDebug("MUSHROOM", `Slider transform: ${slideTransform}`);

              // Parse the transform matrix to get x/y translation
              let translateX = 0;
              let translateY = 0;

              if (slideTransform && slideTransform !== "none") {
                const matrixMatch = slideTransform.match(/matrix\(([^)]+)\)/);
                if (matrixMatch) {
                  const matrixValues = matrixMatch[1]
                    .split(",")
                    .map((v) => parseFloat(v.trim()));
                  if (matrixValues.length >= 6) {
                    translateX = matrixValues[4] || 0;
                    translateY = matrixValues[5] || 0;
                  }
                }
              }

              logDebug(
                "MUSHROOM",
                `Detected transform offset: translateX=${translateX}, translateY=${translateY}`,
              );

              // Get current menu position
              const currentLeft = parseFloat(menuSurface.style.left) || 0;
              const currentTop = parseFloat(menuSurface.style.top) || 0;

              // Adjust position to compensate for parent transform
              const newLeft = currentLeft - translateX;
              const newTop = currentTop - translateY;

              logDebug(
                "MUSHROOM",
                `Adjusting menu position: (${currentLeft}, ${currentTop}) -> (${newLeft}, ${newTop})`,
              );

              menuSurface.style.left = `${newLeft}px`;
              menuSurface.style.top = `${newTop}px`;

              logDebug(
                "MUSHROOM",
                `mushroom-select #${index + 1} - position adjusted successfully`,
              );
            });

            logDebug(
              "MUSHROOM",
              `mushroom-select #${index + 1} - menu fix listener attached`,
            );
          };

          // Wait for the menu element to be created (it's created dynamically)
          let retryCount = 0;
          const maxRetries = 10; // Try for 1 second max
          const setupMenuFix = () => {
            const menu = select.shadowRoot?.querySelector("mwc-menu");
            if (menu) {
              attachMenuListener(menu);
              return;
            }

            retryCount++;
            if (retryCount < maxRetries) {
              logDebug(
                "MUSHROOM",
                `mushroom-select #${index + 1} - menu not found yet, will retry (${retryCount}/${maxRetries})`,
              );
              setTimeout(setupMenuFix, 100);
            } else {
              // Menu not found after retries - set up MutationObserver to watch for menu creation
              logDebug(
                "MUSHROOM",
                `mushroom-select #${index + 1} - menu not found after ${maxRetries} retries, setting up MutationObserver`,
              );

              if (!select.shadowRoot) {
                logDebug(
                  "MUSHROOM",
                  `mushroom-select #${index + 1} - no shadow root, cannot observe`,
                );
                return;
              }

              // Watch for when the mwc-menu element is added to the shadow DOM
              const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                  if (mutation.type === "childList") {
                    for (const node of mutation.addedNodes) {
                      if (node.nodeName === "MWC-MENU") {
                        logDebug(
                          "MUSHROOM",
                          `mushroom-select #${index + 1} - menu detected via MutationObserver!`,
                        );
                        attachMenuListener(node);
                        observer.disconnect(); // Stop observing once we found it
                        return;
                      }
                    }
                  }
                }
              });

              // Observe the shadow root for added children
              observer.observe(select.shadowRoot, {
                childList: true,
                subtree: true,
              });

              logDebug(
                "MUSHROOM",
                `mushroom-select #${index + 1} - MutationObserver setup complete`,
              );
            }
          };

          // Start the setup process
          setupMenuFix();
        } catch (error) {
          console.warn(`Error fixing mushroom-select #${index + 1}:`, error);
        }
      });

      logDebug("MUSHROOM", "Mushroom-select positioning fix setup completed");
    } else {
      logDebug("MUSHROOM", "No mushroom-select elements found");
    }

    // Set up persistent observer to watch for new mushroom-select-card elements
    // This handles cards that are added to the DOM after initial build (e.g., cards 3+)
    this._setupMushroomSelectObserver();
  }

  /**
   * Sets up a persistent MutationObserver to detect new mushroom-select-card elements
   * being added to the DOM after the initial build
   * @private
   */
  _setupMushroomSelectObserver() {
    // Clean up any existing observer
    if (this.card._mushroomSelectObserver) {
      this.card._mushroomSelectObserver.disconnect();
      this.card._mushroomSelectObserver = null;
    }

    if (!this.card.sliderElement) return;

    logDebug(
      "MUSHROOM",
      "Setting up persistent observer for new mushroom-select elements...",
    );

    // Create observer to watch for new mushroom-select-card elements
    this.card._mushroomSelectObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const node of mutation.addedNodes) {
            // Check if the added node is a mushroom-select-card
            if (node.nodeName === "MUSHROOM-SELECT-CARD") {
              logDebug(
                "MUSHROOM",
                "Detected new mushroom-select-card being added to DOM",
              );
              // Give the card a moment to fully render
              setTimeout(() => {
                this._fixSingleMushroomSelectCard(node);
              }, 100);
            }
            // Also check if added node contains mushroom-select-card children
            if (node.querySelectorAll) {
              const nestedCards = node.querySelectorAll("mushroom-select-card");
              if (nestedCards.length > 0) {
                logDebug(
                  "MUSHROOM",
                  `Detected ${nestedCards.length} nested mushroom-select-card(s) in added node`,
                );
                setTimeout(() => {
                  nestedCards.forEach((card) =>
                    this._fixSingleMushroomSelectCard(card),
                  );
                }, 100);
              }
            }
          }
        }
      }
    });

    // Observe the slider for added children
    this.card._mushroomSelectObserver.observe(this.card.sliderElement, {
      childList: true,
      subtree: true,
    });

    logDebug("MUSHROOM", "Persistent mushroom-select observer active");
  }

  /**
   * Fixes positioning for a single mushroom-select-card element
   * @param {Element} card - The mushroom-select-card element
   * @private
   */
  _fixSingleMushroomSelectCard(card) {
    try {
      // Extract mushroom-select from shadow roots (same logic as main function)
      const mushroomCard = card.shadowRoot?.querySelector("mushroom-card");
      if (!mushroomCard) {
        logDebug("MUSHROOM", "New card: no mushroom-card found in shadow root");
        return;
      }

      const optionControl = mushroomCard.querySelector(
        "mushroom-select-option-control",
      );
      if (!optionControl) {
        logDebug(
          "MUSHROOM",
          "New card: no mushroom-select-option-control found",
        );
        return;
      }

      const select = optionControl.shadowRoot?.querySelector("mushroom-select");
      if (!select) {
        logDebug("MUSHROOM", "New card: no mushroom-select found");
        return;
      }

      logDebug(
        "MUSHROOM",
        "New card: found mushroom-select, setting up positioning fix",
      );

      // Disable fixed menu positioning
      select.fixedMenuPosition = false;
      select.naturalMenuWidth = true;

      // Find parent slide
      const parentSlide = card.closest(".slide");
      if (!parentSlide) {
        logDebug("MUSHROOM", "New card: no parent slide found");
        return;
      }

      // Track whether we've set up the menu listener
      let menuListenerAttached = false;

      // Function to attach the position fix listener to the menu
      const attachMenuListener = (menu) => {
        if (menuListenerAttached) return;
        menuListenerAttached = true;

        menu.addEventListener("opened", () => {
          logDebug("MUSHROOM", "New card menu opened, adjusting position...");

          const menuSurface =
            menu.shadowRoot?.querySelector(".mdc-menu-surface");
          if (!menuSurface) return;

          const slideTransform = window.getComputedStyle(
            this.card.sliderElement,
          ).transform;
          let translateX = 0;
          let translateY = 0;

          if (slideTransform && slideTransform !== "none") {
            const matrixMatch = slideTransform.match(/matrix\(([^)]+)\)/);
            if (matrixMatch) {
              const matrixValues = matrixMatch[1]
                .split(",")
                .map((v) => parseFloat(v.trim()));
              if (matrixValues.length >= 6) {
                translateX = matrixValues[4] || 0;
                translateY = matrixValues[5] || 0;
              }
            }
          }

          const currentLeft = parseFloat(menuSurface.style.left) || 0;
          const currentTop = parseFloat(menuSurface.style.top) || 0;
          const newLeft = currentLeft - translateX;
          const newTop = currentTop - translateY;

          menuSurface.style.left = `${newLeft}px`;
          menuSurface.style.top = `${newTop}px`;

          logDebug("MUSHROOM", "New card menu position adjusted");
        });
      };

      // Try to find menu immediately
      const menu = select.shadowRoot?.querySelector("mwc-menu");
      if (menu) {
        attachMenuListener(menu);
        logDebug("MUSHROOM", "New card: menu found immediately");
      } else {
        // Set up observer for menu creation
        logDebug("MUSHROOM", "New card: menu not found, setting up observer");
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === "childList") {
              for (const node of mutation.addedNodes) {
                if (node.nodeName === "MWC-MENU") {
                  logDebug("MUSHROOM", "New card: menu detected via observer");
                  attachMenuListener(node);
                  observer.disconnect();
                  return;
                }
              }
            }
          }
        });

        observer.observe(select.shadowRoot, {
          childList: true,
          subtree: true,
        });
      }
    } catch (error) {
      console.warn("Error fixing new mushroom-select-card:", error);
    }
  }

  /**
   * Sets up detection for mini-media-player shortcut dropdowns.
   *
   * Recent mini-media-player versions render their shortcuts menu as a plain
   * `<div class="mmp-dropdown__menu">` (toggled purely by an `open` attribute) whenever
   * the legacy `mwc-menu`/`mwc-list-item` elements are not registered - which is the case
   * on current Home Assistant. That fallback fires no open/close events and is never
   * added to or removed from the DOM, so the generic detection in `_setupDropdownDetection()`
   * never sees it and the menu gets clipped by the card's `overflow: hidden`. Here we watch
   * the `open` attribute directly and reuse the same `_handleDropdownOpen()` /
   * `_handleDropdownClose()` counter that toggles the `dropdown-open` class on the host.
   * @private
   */
  _setupMiniMediaPlayerDropdownDetection() {
    if (!this.card.sliderElement) return;

    // Reset any observers/state left over from a previous build.
    if (Array.isArray(this.card._mmpDropdownObservers)) {
      this.card._mmpDropdownObservers.forEach((observer) =>
        observer.disconnect(),
      );
    }
    this.card._mmpDropdownObservers = [];
    this.card._mmpObservedDropdowns = new WeakSet();

    logDebug("DROPDOWN", "Checking for mini-media-player elements...");

    const players =
      this.card.sliderElement.querySelectorAll("mini-media-player");
    logDebug(
      "DROPDOWN",
      `Found ${players.length} mini-media-player element(s)`,
    );

    players.forEach((player) => this._observeMiniMediaPlayer(player));

    // Watch for mini-media-player cards added after the initial build (e.g. cards 3+).
    this._setupMiniMediaPlayerObserver();
  }

  /**
   * Locates the `mmp-dropdown` element(s) inside a mini-media-player (nested several
   * shadow roots deep) and attaches an attribute observer to each. The dropdown renders
   * slightly after the card mounts, so retry a few times and fall back to a
   * MutationObserver on the player's shadow root.
   * @param {Element} player - The mini-media-player element
   * @private
   */
  _observeMiniMediaPlayer(player) {
    if (!player) return;

    let retryCount = 0;
    const maxRetries = 10; // ~1s

    const tryFind = () => {
      const dropdowns = this._findDeep(player, "MMP-DROPDOWN");
      if (dropdowns.length > 0) {
        dropdowns.forEach((dropdown) => this._observeMmpDropdown(dropdown));
        return;
      }

      retryCount++;
      if (retryCount < maxRetries) {
        setTimeout(tryFind, 100);
      } else if (player.shadowRoot) {
        // Not rendered yet - observe the player's shadow root for the shortcuts/dropdown
        // being created, then re-scan.
        logDebug(
          "DROPDOWN",
          "mini-media-player dropdown not found, observing for creation",
        );
        const observer = new MutationObserver(() => {
          const found = this._findDeep(player, "MMP-DROPDOWN");
          if (found.length > 0) {
            found.forEach((dropdown) => this._observeMmpDropdown(dropdown));
            observer.disconnect();
          }
        });
        observer.observe(player.shadowRoot, {
          childList: true,
          subtree: true,
        });
        this.card._mmpDropdownObservers.push(observer);
      }
    };

    tryFind();
  }

  /**
   * Attaches an attribute observer to a single `mmp-dropdown` so the swipe card can react
   * when its fallback `.mmp-dropdown__menu` opens/closes, reusing the host-level
   * `dropdown-open` toggle via the shared open/close counter.
   * @param {Element} dropdown - The mmp-dropdown element
   * @private
   */
  _observeMmpDropdown(dropdown) {
    if (!dropdown || !dropdown.shadowRoot) return;
    if (this.card._mmpObservedDropdowns.has(dropdown)) return;
    this.card._mmpObservedDropdowns.add(dropdown);

    let wasOpen = false;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const target = mutation.target;
        // Only react to the fallback menu container's `open` attribute. This element
        // exists only in the non-legacy (event-less) branch, so the legacy mwc-menu path
        // - already handled by _setupDropdownDetection - is left untouched.
        if (
          !target.classList ||
          !target.classList.contains("mmp-dropdown__menu")
        ) {
          continue;
        }

        const isOpen = target.hasAttribute("open");
        if (isOpen === wasOpen) continue;
        wasOpen = isOpen;

        if (isOpen) {
          logDebug("DROPDOWN", "mini-media-player dropdown opened");
          this.card._handleDropdownOpen();
        } else {
          logDebug("DROPDOWN", "mini-media-player dropdown closed");
          this.card._handleDropdownClose();
        }
      }
    });

    observer.observe(dropdown.shadowRoot, {
      attributes: true,
      attributeFilter: ["open"],
      subtree: true,
    });

    this.card._mmpDropdownObservers.push(observer);
    logDebug("DROPDOWN", "mini-media-player dropdown observer attached");
  }

  /**
   * Sets up a persistent MutationObserver to detect new mini-media-player elements being
   * added to the DOM after the initial build.
   * @private
   */
  _setupMiniMediaPlayerObserver() {
    if (this.card._miniMediaPlayerObserver) {
      this.card._miniMediaPlayerObserver.disconnect();
      this.card._miniMediaPlayerObserver = null;
    }

    if (!this.card.sliderElement) return;

    this.card._miniMediaPlayerObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== "childList") continue;
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          if (node.nodeName === "MINI-MEDIA-PLAYER") {
            setTimeout(() => this._observeMiniMediaPlayer(node), 100);
          } else if (node.querySelectorAll) {
            const nested = node.querySelectorAll("mini-media-player");
            if (nested.length > 0) {
              setTimeout(() => {
                nested.forEach((player) =>
                  this._observeMiniMediaPlayer(player),
                );
              }, 100);
            }
          }
        }
      }
    });

    this.card._miniMediaPlayerObserver.observe(this.card.sliderElement, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Recursively collects every element with the given upper-case tag name within an
   * element's subtree, descending through nested shadow roots (MutationObservers and
   * querySelectorAll do not cross shadow boundaries).
   * @param {Element|ShadowRoot} root - Element or shadow root to search within
   * @param {string} tagName - Upper-case tag name to match (e.g. "MMP-DROPDOWN")
   * @returns {Element[]} Matching elements
   * @private
   */
  _findDeep(root, tagName) {
    const matches = [];
    const start = root.shadowRoot || root;

    const walk = (node) => {
      const children = node.children ? Array.from(node.children) : [];
      for (const el of children) {
        if (el.tagName === tagName) matches.push(el);
        if (el.shadowRoot) walk(el.shadowRoot);
        walk(el);
      }
    };

    walk(start);
    return matches;
  }

  /**
   * Finishes the build process by setting up layout and observers
   * @param {number} buildTimestamp - Optional timestamp to validate this is not a stale build
   */
  async finishBuildLayout(buildTimestamp = null) {
    // CRITICAL: Check if this is a stale build
    if (
      buildTimestamp &&
      this.card._currentBuildTimestamp &&
      buildTimestamp !== this.card._currentBuildTimestamp
    ) {
      logDebug("INIT", "finishBuildLayout skipped - stale build detected", {
        thisBuild: buildTimestamp,
        currentBuild: this.card._currentBuildTimestamp,
      });
      return;
    }

    if (
      !this.card.cardContainer ||
      !this.card.isConnected ||
      this.card.building
    ) {
      logDebug("INIT", "finishBuildLayout skipped", {
        container: !!this.card.cardContainer,
        connected: this.card.isConnected,
        building: this.card.building,
      });
      return;
    }
    logDebug("INIT", "Finishing build layout...");

    // Read the container width as soon as it's known (parent-determined, available
    // on the first layout frame) instead of polling for height to "stabilise" —
    // height keeps changing as child content loads (especially with auto_height)
    // and would needlessly delay reveal. Height settling after reveal is handled
    // by the ResizeObserver / the auto_height height transition.
    const dimensions = await this._waitForInitialWidth();

    if (!dimensions) {
      // Width not available yet (hidden / inactive tab / detached). Use fallback
      // dimensions and continue; the ResizeObserver set up below recalculates and
      // lays the card out correctly once it becomes visible.
      logDebug(
        "INIT",
        "Initial width unavailable - using fallback dimensions (will recalc on resize)",
      );
      this.card.slideWidth = 300;
      this.card.slideHeight = 100;
    } else {
      this.card.slideWidth = dimensions.width;
      this.card.slideHeight = dimensions.height;
      logDebug("INIT", "Initial dimensions:", dimensions);
    }

    // Handle carousel mode layout with dimension validation
    const viewMode = this.card._config.view_mode || "single";
    if (viewMode === "carousel") {
      const validDimensions = this._setupCarouselLayoutWithValidation(
        this.card.slideWidth,
      );
      if (!validDimensions) {
        console.warn(
          "SimpleSwipeCard: Carousel layout calculation produced invalid dimensions",
        );
      }
    } else if (this.card._resolutionIndependentLayout) {
      // Resolution-independent single mode: slides stay at 100% of the container
      // (the CSS default for --single-slide-width), so no pixel width is needed and
      // the layout reflows for free on resize.
      this.card.style.setProperty("--single-slide-width", "100%");
    } else {
      // For single mode, set the slide width CSS variable for proper slide sizing
      this.card.style.setProperty(
        "--single-slide-width",
        `${this.card.slideWidth}px`,
      );
    }

    const totalVisibleCards = this.card.visibleCardIndices.length;

    // If reset_target_card is set, ensure the currentIndex points to the correct visible card position
    const targetCard = this.card.getEvaluatedConfigValue(
      "reset_target_card",
      1,
    );
    const targetOriginalIndex = Math.max(0, parseInt(targetCard) - 1 || 0);

    if (targetOriginalIndex !== 0) {
      const targetVisibleIndex =
        this.card.visibleCardIndices.indexOf(targetOriginalIndex);

      if (targetVisibleIndex !== -1) {
        // Target card is visible, use its position in visible cards
        this.card.currentIndex = targetVisibleIndex;
        logDebug(
          "INIT",
          `Target card ${targetCard} is visible at position ${targetVisibleIndex}`,
        );
      } else {
        // Target card is not visible, find the closest visible card
        let closestVisibleIndex = 0;
        for (let i = 0; i < this.card.visibleCardIndices.length; i++) {
          if (this.card.visibleCardIndices[i] >= targetOriginalIndex) {
            closestVisibleIndex = i;
            break;
          }
        }
        this.card.currentIndex = closestVisibleIndex;
        logDebug(
          "INIT",
          `Target card ${targetCard} not visible, using closest at position ${closestVisibleIndex}`,
        );
      }
    }

    // Adjust index if out of bounds
    this.card.currentIndex = Math.max(
      0,
      Math.min(this.card.currentIndex, totalVisibleCards - 1),
    );

    // Apply matching border radius to all loaded slides
    // Re-check container validity after async operations
    if (this.card.cardContainer && this.card.cardContainer.isConnected) {
      applyBorderRadiusToSlides(this.card.cards, this.card.cardContainer);
    } else {
      logDebug(
        "INIT",
        "Skipping border radius application - container no longer valid",
      );
    }

    // For single mode (pixel layout only), set inline widths on slides to ensure
    // proper sizing — CSS variables alone may not work reliably across all browsers.
    // Skipped under resolution-independent layout, where slides stay at 100%.
    if (
      viewMode !== "carousel" &&
      !this.card._resolutionIndependentLayout &&
      this.card.sliderElement
    ) {
      const slideWidth = this.card.slideWidth;
      const slides = this.card.sliderElement.querySelectorAll(
        ".slide:not(.carousel-mode)",
      );
      slides.forEach((slide) => {
        slide.style.width = `${slideWidth}px`;
        slide.style.minWidth = `${slideWidth}px`;
        slide.style.flexBasis = `${slideWidth}px`;
      });
      logDebug("INIT", "Set single mode slide widths:", slideWidth);
    }

    this.card.updateSlider(false);
    this.card._setupResizeObserver();

    // Add swipe gestures if needed (based on visible cards). In css scroll mode
    // addGestures is a no-op for the drag handlers; ScrollStrategy.attach wires
    // the passive scroll listener that keeps index/pagination in sync instead.
    if (totalVisibleCards > 1) {
      this.card.swipeGestures?.addGestures();
      this.card.scrollStrategy?.attach();
    } else {
      this.card.swipeGestures?.removeGestures();
      this.card.scrollStrategy?.detach();
    }

    logDebug(
      "INIT",
      "Layout finished, slideWidth:",
      this.card.slideWidth,
      "slideHeight:",
      this.card.slideHeight,
      "currentIndex:",
      this.card.currentIndex,
      "visible cards:",
      totalVisibleCards,
      "view mode:",
      viewMode,
    );

    // Setup auto-swipe and reset-after if enabled
    this.card.autoSwipe?.manage();
    this.card.resetAfter?.manage();
    this.card.stateSynchronization?.manage();

    // Setup observer for child card visibility changes (e.g., bubble-card)
    this.card._setupChildVisibilityObserver();

    // Fix mushroom-select dropdown positioning
    this._fixMushroomSelectPositioning();

    // Detect mini-media-player shortcut dropdowns (event-less fallback menu)
    this._setupMiniMediaPlayerDropdownDetection();

    // Update pagination after state sync to ensure active dot is set
    // This ensures the correct dot is active after state synchronization runs
    logDebug("PAGINATION", "Updating pagination after layout finalization");
    requestAnimationFrame(() => {
      if (this.card.isConnected && this.card.pagination) {
        this.card.pagination.update(false); // Update without animation on initial load
        logDebug("PAGINATION", "Pagination active state updated");
      }
    });

    // Apply card-mod styles after layout is complete
    if (this.card._cardModConfig) {
      logDebug("CARD_MOD", "Applying card-mod styles in finishBuildLayout");
      this.card._applyCardModStyles();
      this.card._setupCardModObserver();

      // Wait for CSS variable to actually change instead of fixed timeout
      if (viewMode === "carousel") {
        this._waitForCarouselStyleApplication().then(() => {
          if (this.card.isConnected) {
            this.recalculateCarouselLayout();
          }
        });
      }
    }

    // Create/update pagination BEFORE fade-in
    // This ensures pagination exists and is visible when card fades in
    logDebug("INIT", "Creating/updating pagination before fade-in");
    this.card.pagination.updateLayout();

    // Give pagination one frame to render
    await new Promise((resolve) => requestAnimationFrame(resolve));

    // Setup dropdown detection for z-index elevation
    this.card._setupDropdownDetection();

    // Apply UIX styling to the swipe card host if configured. The shadow DOM was wiped
    // and rebuilt during build(), so re-applying here keeps UIX styling alive across
    // rebuilds (no-op without UIX installed or without a top-level uix config).
    applyUix(this.card, this.card._config?.uix, this.card._config, "card");

    await this._revealSlider();
  }

  /**
   * Waits for card-mod to apply carousel width styles
   * Uses CSS variable watching with fallback timeout
   * @returns {Promise<void>}
   * @private
   */
  async _waitForCarouselStyleApplication() {
    const MAX_WAIT_TIME = 500; // 500ms maximum wait (generous for slow systems)
    const CHECK_INTERVAL = 20; // Check every 20ms (frequent but not excessive)

    // Get the initial CSS variable value
    const initialWidth = getComputedStyle(this.card)
      .getPropertyValue("--carousel-card-width")
      .trim();

    logDebug("CARD_MOD", "Waiting for carousel CSS variable application:", {
      initialWidth,
      maxWaitTime: MAX_WAIT_TIME,
    });

    // If CSS variable is already set (non-empty and not auto), consider it applied
    if (initialWidth && initialWidth !== "" && initialWidth !== "auto") {
      logDebug("CARD_MOD", "CSS variable already applied:", initialWidth);
      return Promise.resolve();
    }

    const startTime = Date.now();

    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const currentWidth = getComputedStyle(this.card)
          .getPropertyValue("--carousel-card-width")
          .trim();

        const elapsedTime = Date.now() - startTime;

        // Check if CSS variable has been set
        if (currentWidth && currentWidth !== "" && currentWidth !== "auto") {
          clearInterval(checkInterval);
          logDebug(
            "CARD_MOD",
            "CSS variable detected after",
            elapsedTime,
            "ms:",
            currentWidth,
          );
          resolve();
          return;
        }

        // Safety timeout reached
        if (elapsedTime >= MAX_WAIT_TIME) {
          clearInterval(checkInterval);
          logDebug(
            "CARD_MOD",
            "CSS variable watch timed out after",
            MAX_WAIT_TIME,
            "ms - using fallback",
          );
          resolve();
        }
      }, CHECK_INTERVAL);
    });
  }

  /**
   * Reads the container width as soon as the browser has laid it out.
   *
   * Width is determined by the parent container and is available on the first
   * layout frame(s); height, by contrast, keeps changing as child content loads
   * (especially with auto_height), so we deliberately do NOT wait for it. We grab
   * width within a few frames and let the card reveal; the ResizeObserver and the
   * auto_height height transition handle any settling after reveal.
   * @returns {Promise<{width: number, height: number}|null>} Dimensions, or null
   *   if the card is hidden/detached (caller falls back to default dimensions).
   * @private
   */
  async _waitForInitialWidth() {
    const MAX_FRAMES = 5; // ~80ms worst case, vs. up to 1500ms polling before

    for (let attempt = 0; attempt < MAX_FRAMES; attempt++) {
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // Bail if the card went away during the wait
      if (!this.card.isConnected || !this.card.cardContainer) {
        logDebug("INIT", "Card disconnected during initial width read");
        return null;
      }

      const width = this.card.cardContainer.offsetWidth;
      if (width > 0) {
        const height = this.card.cardContainer.offsetHeight;
        logDebug("INIT", "Initial width acquired:", {
          width,
          height,
          frames: attempt + 1,
        });
        return { width, height };
      }

      // Hidden / inactive tab: no layout happens until it is shown again, so do
      // not burn frames waiting - the ResizeObserver reveals/recalcs on show.
      if (this.card.offsetParent === null) {
        logDebug(
          "INIT",
          "Element hidden during build - deferring to ResizeObserver",
        );
        return null;
      }
    }

    logDebug("INIT", "Initial width still 0 after MAX_FRAMES - using fallback");
    return null;
  }

  /**
   * Reveals the slider once layout is ready. Performs a final dimension check, then
   * initializes swipe effects and snaps the slider visible instantly (no fade).
   * @returns {Promise<void>}
   * @private
   */
  async _revealSlider() {
    if (
      !this.card.isConnected ||
      !this.card.cardContainer ||
      !this.card.sliderElement
    ) {
      logDebug("INIT", "Card disconnected before fade-in");
      return;
    }

    // Final dimension check
    const finalWidth = this.card.cardContainer.offsetWidth;
    const finalHeight = this.card.cardContainer.offsetHeight;

    logDebug("INIT", "Final pre-fade dimension check:", {
      currentStored: {
        width: this.card.slideWidth,
        height: this.card.slideHeight,
      },
      actualMeasured: { width: finalWidth, height: finalHeight },
    });

    // If dimensions changed significantly, update them one last time
    if (
      Math.abs(finalWidth - this.card.slideWidth) > 2 ||
      Math.abs(finalHeight - this.card.slideHeight) > 2
    ) {
      logDebug(
        "INIT",
        "Final dimensions differ from stored - updating before fade-in",
      );
      this.card.slideWidth = finalWidth;
      this.card.slideHeight = finalHeight;
      this.card.updateSlider(false);

      // Re-calculate carousel/single mode layout if needed
      const viewMode = this.card._config.view_mode || "single";
      if (viewMode === "carousel") {
        this._setupCarouselLayoutWithValidation(finalWidth);
      } else if (!this.card._resolutionIndependentLayout) {
        // Update single slide width CSS variable and inline styles (pixel layout).
        // Under resolution-independent layout slides stay at 100%, nothing to do.
        this.card.style.setProperty("--single-slide-width", `${finalWidth}px`);
        if (this.card.sliderElement) {
          const slides = this.card.sliderElement.querySelectorAll(
            ".slide:not(.carousel-mode)",
          );
          slides.forEach((slide) => {
            slide.style.width = `${finalWidth}px`;
            slide.style.minWidth = `${finalWidth}px`;
            slide.style.flexBasis = `${finalWidth}px`;
          });
        }
      }
    }

    const slider = this.card.sliderElement;

    // Initialize swipe effects BEFORE revealing. For stacked/fade effects this sets
    // each slide's opacity/transform (via _setupStackedLayout + immediate transforms)
    // so non-active slides don't flash into view at reveal; for the default slide
    // effect it is a no-op. The slider was hidden during build, so this is the right
    // moment to establish the initial per-slide state.
    this.card.swipeEffects?.initialize();

    // Instant reveal - no fade animation (user-chosen). The slider was hidden during
    // build to avoid showing mid-layout/partly-loaded content; now that layout is
    // ready we snap it visible. Any later height settle (auto_height / late child
    // content) is handled smoothly by the ResizeObserver + height transition.
    slider.style.transition = "";
    slider.style.opacity = "1";
    logDebug("INIT", "Slider revealed (instant), card fully initialized");
  }

  /**
   * Reads state synchronization entity and returns the target card index
   * @returns {number} The target card index (0-based), or current index if no state sync
   * @private
   */
  _getStateSyncInitialIndex() {
    // Check if state synchronization is configured
    if (!this.card._config.state_entity || !this.card._hass) {
      return this.card.currentIndex;
    }

    const stateEntity = this.card._config.state_entity;
    const entity = this.card._hass.states[stateEntity];
    if (!entity) {
      logDebug("STATE", "State entity not found during build:", stateEntity);
      return this.card.currentIndex;
    }

    // Use the same mapping logic as StateSynchronization
    const entityValue = entity.state;
    let targetIndex = null;

    if (stateEntity.startsWith("input_select.")) {
      if (
        !entity.attributes.options ||
        !Array.isArray(entity.attributes.options)
      ) {
        return this.card.currentIndex;
      }

      const options = entity.attributes.options;
      const optionIndex = options.indexOf(entityValue);

      if (
        optionIndex !== -1 &&
        optionIndex < this.card.visibleCardIndices.length
      ) {
        targetIndex = optionIndex;
      }
    } else if (stateEntity.startsWith("input_number.")) {
      const numValue = parseInt(entityValue);
      if (!isNaN(numValue)) {
        const cardIndex = numValue - 1; // Convert from 1-based to 0-based
        if (cardIndex >= 0 && cardIndex < this.card.visibleCardIndices.length) {
          targetIndex = cardIndex;
        }
      }
    }

    if (targetIndex !== null) {
      logDebug(
        "STATE",
        `State sync initial index determined during build: ${targetIndex} from entity state: ${entityValue}`,
      );
      return targetIndex;
    }

    return this.card.currentIndex;
  }

  /**
   * Gets the actual carousel card width from CSS or calculates it
   * @param {number} containerWidth - Container width
   * @param {number} cardSpacing - Spacing between cards
   * @returns {Object} Object with cardWidth and cardsVisible
   * @private
   */
  _getCarouselDimensions(containerWidth, cardSpacing) {
    // First, check if CSS variable is already set (e.g., by card-mod)
    const computedWidth = getComputedStyle(this.card)
      .getPropertyValue("--carousel-card-width")
      .trim();

    // DEBUG: Log what we found
    logDebug("INIT", "Checking for CSS override:", {
      computedWidth,
      hasValue: !!computedWidth,
      isEmpty: computedWidth === "",
      isAuto: computedWidth === "auto",
    });

    if (computedWidth && computedWidth !== "" && computedWidth !== "auto") {
      // CSS override exists - use it and calculate cardsVisible from it
      const cardWidth = parseFloat(computedWidth);
      const cardsVisible =
        (containerWidth + cardSpacing) / (cardWidth + cardSpacing);

      logDebug("INIT", "Using CSS-overridden card width:", {
        cardWidth: cardWidth.toFixed(2),
        cardsVisible: cardsVisible.toFixed(2),
        source: "card-mod or CSS",
      });

      return { cardWidth, cardsVisible: Math.max(1.1, cardsVisible) };
    }

    // No CSS override - calculate from config
    logDebug("INIT", "No CSS override found, calculating from config");

    let cardsVisible;

    if (this.card._config.cards_visible !== undefined) {
      // Legacy approach
      cardsVisible = this.card._config.cards_visible;
      logDebug("INIT", "Using legacy cards_visible approach:", cardsVisible);
    } else {
      // Responsive approach
      const minWidth = this.card._config.card_min_width || 200;
      const rawCardsVisible =
        (containerWidth + cardSpacing) / (minWidth + cardSpacing);
      cardsVisible = Math.max(1.1, Math.round(rawCardsVisible * 10) / 10);
      logDebug("INIT", "Using responsive approach:", {
        minWidth,
        containerWidth,
        cardSpacing,
        rawCardsVisible: rawCardsVisible.toFixed(2),
        finalCardsVisible: cardsVisible,
      });
    }

    // Calculate card width from cardsVisible
    const totalSpacing = (cardsVisible - 1) * cardSpacing;
    const cardWidth = (containerWidth - totalSpacing) / cardsVisible;

    return { cardWidth, cardsVisible };
  }

  /**
   * Recalculates carousel layout (called on resize or after card-mod applies styles)
   */
  recalculateCarouselLayout() {
    const viewMode = this.card._config.view_mode || "single";
    if (viewMode !== "carousel") return;

    const containerWidth = this.card.cardContainer?.offsetWidth;
    if (!containerWidth) return;

    logDebug("INIT", "Recalculating carousel layout (resize or card-mod)");
    this._setupCarouselLayoutWithValidation(containerWidth);

    // Update the slider position with new dimensions
    this.card.updateSlider(false);
  }

  /**
   * Sets up carousel mode layout and sizing WITH VALIDATION
   * @param {number} containerWidth - Container width
   * @returns {boolean} True if dimensions are valid, false otherwise
   * @private
   */
  _setupCarouselLayoutWithValidation(containerWidth) {
    const cardSpacing =
      Math.max(0, parseInt(this.card._config.card_spacing)) || 0;

    // Get dimensions (respecting CSS overrides)
    const { cardWidth, cardsVisible } = this._getCarouselDimensions(
      containerWidth,
      cardSpacing,
    );

    // VALIDATION: Check if calculated dimensions are sane
    const isValid = this._validateCarouselDimensions(
      cardWidth,
      cardsVisible,
      containerWidth,
    );

    if (!isValid) {
      logDebug("INIT", "Carousel dimensions failed validation:", {
        cardWidth,
        cardsVisible,
        containerWidth,
      });
      return false;
    }

    logDebug("INIT", "Carousel layout setup (validated):", {
      containerWidth,
      cardsVisible: cardsVisible.toFixed(2),
      cardSpacing,
      cardWidth: cardWidth.toFixed(2),
    });

    // Only set CSS custom property if not overridden by card-mod (external CSS)
    // Check inline style vs computed style to distinguish our value from card-mod
    const inlineWidth = this.card.style
      .getPropertyValue("--carousel-card-width")
      .trim();
    const computedWidth = getComputedStyle(this.card)
      .getPropertyValue("--carousel-card-width")
      .trim();

    // If computed has value but inline is empty, card-mod set it via CSS - don't override
    const isCardModOverride =
      !inlineWidth &&
      computedWidth &&
      computedWidth !== "" &&
      computedWidth !== "auto";

    if (isCardModOverride) {
      logDebug(
        "INIT",
        "Skipping CSS variable set - overridden by card-mod:",
        computedWidth,
      );
    } else {
      this.card.style.setProperty("--carousel-card-width", `${cardWidth}px`);
      logDebug(
        "INIT",
        "Set --carousel-card-width to calculated value:",
        `${cardWidth}px`,
      );
    }

    // Store for use by other components
    this.card._carouselCardWidth = cardWidth;
    this.card._carouselCardsVisible = cardsVisible;

    // Add carousel data attribute to slider and container
    this.card.sliderElement.setAttribute("data-view-mode", "carousel");
    this.card.cardContainer.setAttribute("data-view-mode", "carousel");

    // Apply carousel class to all card slides
    this.card.cards.forEach((cardData) => {
      if (cardData.slide) {
        cardData.slide.classList.add("carousel-mode");
      }
    });

    return true;
  }

  /**
   * Validates carousel dimension calculations
   * @param {number} cardWidth - Calculated card width
   * @param {number} cardsVisible - Calculated visible cards
   * @param {number} containerWidth - Container width
   * @returns {boolean} True if dimensions are valid
   * @private
   */
  _validateCarouselDimensions(cardWidth, cardsVisible, containerWidth) {
    // Check for NaN or invalid numbers
    if (
      !isFinite(cardWidth) ||
      !isFinite(cardsVisible) ||
      !isFinite(containerWidth)
    ) {
      logDebug("INIT", "Validation failed: Non-finite numbers detected");
      return false;
    }

    // Check for zero or negative values
    if (cardWidth <= 0 || cardsVisible <= 0 || containerWidth <= 0) {
      logDebug("INIT", "Validation failed: Zero or negative values");
      return false;
    }

    // Check if cardWidth is unreasonably large (shouldn't be more than container)
    if (cardWidth > containerWidth * 1.5) {
      logDebug(
        "INIT",
        "Validation failed: Card width exceeds container significantly",
      );
      return false;
    }

    // Check if cardWidth is unreasonably small
    if (cardWidth < 50) {
      logDebug("INIT", "Validation failed: Card width too small (< 50px)");
      return false;
    }

    // Check if cardsVisible makes sense
    if (cardsVisible > 20) {
      logDebug("INIT", "Validation failed: Too many visible cards (> 20)");
      return false;
    }

    return true;
  }

  /**
   * Helper method to create prioritized batches for stagger loading
   * @param {Array} cardsToLoad - Cards to load
   * @returns {Array} Array of batches, with priority cards in first batch
   * @private
   */
  _createPrioritizedBatches(cardsToLoad) {
    const batchSize = 3; // Maximum cards per batch (for non-priority cards)
    const currentIndex = this.card.currentIndex || 0;
    const viewMode = this.card._config.view_mode || "single";
    const isInfiniteMode = this.card.loopMode.isInfiniteMode;

    logDebug("INIT", "Determining visible cards for stagger loading:", {
      currentIndex,
      viewMode,
      isInfiniteMode,
      totalCardsToLoad: cardsToLoad.length,
    });

    // Step 1: Determine which cards are actually visible right now
    let visibleIndices = [];

    if (isInfiniteMode) {
      // INFINITE MODE: Need to map current position to actual DOM structure
      visibleIndices = this._getInfiniteVisibleIndices(
        currentIndex,
        cardsToLoad,
        viewMode,
      );
    } else {
      // REGULAR MODE: Use standard visible range calculation
      const totalVisibleCards = this.card.visibleCardIndices.length;

      if (viewMode === "single") {
        // Single mode: current card + 1 adjacent on each side
        visibleIndices = [
          currentIndex - 1,
          currentIndex,
          currentIndex + 1,
        ].filter((idx) => idx >= 0 && idx < totalVisibleCards);
      } else if (viewMode === "carousel") {
        // Carousel mode: calculate exact visible range
        const visibleRange = this._getCarouselVisibleRange(
          currentIndex,
          totalVisibleCards,
        );
        visibleIndices = [];
        for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
          visibleIndices.push(i);
        }
      } else {
        visibleIndices = [currentIndex];
      }
    }

    // Step 2: Separate cards into priority and regular based on visible indices
    const priorityCards = [];
    const regularCards = [];

    cardsToLoad.forEach((card) => {
      if (visibleIndices.includes(card.visibleIndex)) {
        priorityCards.push(card);
        logDebug(
          "INIT",
          `Priority card: visibleIndex ${card.visibleIndex}, originalIndex ${card.originalIndex}, isDuplicate: ${card.isDuplicate}`,
        );
      } else {
        regularCards.push(card);
      }
    });

    // Step 3: Sort priority cards by distance from current index
    priorityCards.sort((a, b) => {
      const aDistance = Math.abs(a.visibleIndex - currentIndex);
      const bDistance = Math.abs(b.visibleIndex - currentIndex);
      return aDistance - bDistance;
    });

    // Step 4: Create batches with priority cards first
    const batches = [];

    // CAROUSEL MODE: ALL priority cards in first batch (override batch size limit)
    // SINGLE MODE: Use normal batch size limit
    if (viewMode === "carousel" && priorityCards.length > 0) {
      // Put ALL priority cards in first batch for carousel mode
      batches.push(priorityCards);
      logDebug(
        "INIT",
        `Carousel mode: All ${priorityCards.length} priority cards in first batch`,
      );
    } else {
      // Single mode: Use batch size limit for priority cards too
      for (let i = 0; i < priorityCards.length; i += batchSize) {
        batches.push(priorityCards.slice(i, i + batchSize));
      }
    }

    // Remaining batches: regular cards (always use batch size limit)
    for (let i = 0; i < regularCards.length; i += batchSize) {
      batches.push(regularCards.slice(i, i + batchSize));
    }

    logDebug("INIT", "Batch creation completed:", {
      visibleIndices,
      priorityCards: priorityCards.map(
        (c) =>
          `${c.visibleIndex}(${c.originalIndex}${c.isDuplicate ? "D" : ""})`,
      ),
      regularCards: regularCards.map(
        (c) =>
          `${c.visibleIndex}(${c.originalIndex}${c.isDuplicate ? "D" : ""})`,
      ),
      totalBatches: batches.length,
      firstBatchSize: batches[0]?.length || 0,
    });

    return batches;
  }

  /**
   * Helper method to determine visible indices in infinite mode
   * @param {number} currentIndex - Current card index (virtual)
   * @param {Array} cardsToLoad - All cards including duplicates
   * @param {string} viewMode - View mode (single/carousel)
   * @returns {Array} Array of visibleIndex values that are currently visible
   * @private
   */
  _getInfiniteVisibleIndices(currentIndex, cardsToLoad, viewMode) {
    const totalRealCards = this.card.visibleCardIndices.length;
    const duplicateCount = this.card.loopMode.getDuplicateCount();

    // Convert virtual current index to actual DOM position
    const realDOMPosition = duplicateCount + currentIndex;

    logDebug("INIT", "Infinite mode position mapping:", {
      virtualCurrentIndex: currentIndex,
      realDOMPosition,
      duplicateCount,
      totalRealCards,
      totalCardsInDOM: cardsToLoad.length,
    });

    let visibleDOMPositions = [];

    if (viewMode === "single") {
      // Single mode: show current position + adjacent for preloading
      visibleDOMPositions = [
        realDOMPosition - 1,
        realDOMPosition,
        realDOMPosition + 1,
      ].filter((pos) => pos >= 0 && pos < cardsToLoad.length);
    } else if (viewMode === "carousel") {
      // Carousel mode: calculate visible range around DOM position
      const cardsVisible = this._getCarouselVisibleCount();

      // CAROUSEL POSITIONING: Start from current position, don't center around it
      let startDOM = realDOMPosition;
      let endDOM = Math.min(
        cardsToLoad.length - 1,
        startDOM + Math.ceil(cardsVisible) - 1,
      );

      // Adjust if we hit the end (shouldn't happen often in infinite mode)
      if (endDOM >= cardsToLoad.length) {
        endDOM = cardsToLoad.length - 1;
        startDOM = Math.max(0, endDOM - Math.ceil(cardsVisible) + 1);
      }

      for (let pos = startDOM; pos <= endDOM; pos++) {
        visibleDOMPositions.push(pos);
      }

      logDebug("INIT", "Infinite carousel visible range calculation:", {
        cardsVisible,
        realDOMPosition,
        startDOM,
        endDOM,
        visibleDOMPositions,
        calculation: `Start from DOM ${realDOMPosition}, show ${Math.ceil(cardsVisible)} cards: ${startDOM} to ${endDOM}`,
      });
    } else {
      visibleDOMPositions = [realDOMPosition];
    }

    // Map DOM positions back to visibleIndex values
    const visibleIndices = [];
    visibleDOMPositions.forEach((domPos) => {
      if (domPos >= 0 && domPos < cardsToLoad.length) {
        const cardAtPosition = cardsToLoad[domPos];
        if (cardAtPosition) {
          visibleIndices.push(cardAtPosition.visibleIndex);
        }
      }
    });

    return visibleIndices;
  }

  /**
   * Helper method to get carousel visible card count
   * @returns {number} Number of visible cards in carousel mode
   * @private
   */
  _getCarouselVisibleCount() {
    if (this.card._config.cards_visible !== undefined) {
      return this.card._config.cards_visible;
    }

    const containerWidth = this.card.cardContainer?.offsetWidth || 300;
    const minWidth = this.card._config.card_min_width || 200;
    const cardSpacing =
      Math.max(0, parseInt(this.card._config.card_spacing)) || 0;

    const calculatedVisible = Math.max(
      1,
      (containerWidth + cardSpacing) / (minWidth + cardSpacing),
    );
    return Math.max(1.1, Math.round(calculatedVisible * 10) / 10);
  }

  /**
   * Helper method to calculate the exact visible range in carousel mode
   * @param {number} currentIndex - Current card index
   * @param {number} totalCards - Total number of cards
   * @returns {Object} Visible range information
   * @private
   */
  _getCarouselVisibleRange(currentIndex, totalCards) {
    const cardsVisible = this._getCarouselVisibleCount();

    if (totalCards <= Math.floor(cardsVisible)) {
      return {
        startIndex: 0,
        endIndex: totalCards - 1,
        cardsVisible,
      };
    }

    const halfVisible = cardsVisible / 2;
    let idealStart = currentIndex - Math.floor(halfVisible);

    if (idealStart < 0) {
      idealStart = 0;
    }

    let endIndex = idealStart + Math.ceil(cardsVisible) - 1;

    if (endIndex >= totalCards) {
      endIndex = totalCards - 1;
      idealStart = Math.max(0, endIndex - Math.ceil(cardsVisible) + 1);
    }

    const startIndex = Math.max(0, Math.floor(idealStart));

    return {
      startIndex,
      endIndex: Math.min(endIndex, totalCards - 1),
      cardsVisible,
    };
  }

  /**
   * Helper method to load carousel batch content into existing slide containers
   * @param {Array} batch - Array of card info objects to load
   * @param {Object} helpers - Home Assistant card helpers
   * @param {string} batchType - Type of batch for logging
   * @param {number} buildTimestamp - Timestamp of the build that initiated this batch loading
   * @private
   */
  async _loadCarouselBatch(batch, helpers, batchType, buildTimestamp = null) {
    logDebug("INIT", `Loading carousel ${batchType} content:`, batch.length);

    const contentPromises = batch.map(async (cardInfo) => {
      try {
        const cardData = this.card.cards.find(
          (card) =>
            card.visibleIndex === cardInfo.visibleIndex &&
            card.originalIndex === cardInfo.originalIndex,
        );

        if (!cardData || cardData.contentLoaded) {
          return null;
        }

        const cardElement = await helpers.createCardElement(cardInfo.config);

        // CRITICAL: Check if this build is still current after async operation
        if (
          buildTimestamp &&
          this.card._currentBuildTimestamp !== buildTimestamp
        ) {
          logDebug(
            "INIT",
            `Discarding carousel card ${cardInfo.visibleIndex} from stale build`,
          );
          return null;
        }

        if (this.card._hass) {
          cardElement.hass = this.card._hass;
        }

        if (cardInfo.config.type === "picture-elements") {
          cardElement.setAttribute("data-swipe-card-picture-elements", "true");
          cardData.slide.setAttribute("data-has-picture-elements", "true");
        }

        requestAnimationFrame(() => {
          try {
            if (cardInfo.config.type === "todo-list") {
              const textField =
                cardElement.shadowRoot?.querySelector("ha-textfield");
              const inputElement =
                textField?.shadowRoot?.querySelector("input");
              if (inputElement) inputElement.enterKeyHint = "done";
            }
          } catch (e) {
            console.warn("Error applying post-creation logic:", e);
          }
        });

        cardData.slide.appendChild(cardElement);
        cardData.element = cardElement;
        cardData.contentLoaded = true;

        // Apply UIX styling to the child card if configured (no-op without UIX/uix config)
        applyUix(cardElement, cardInfo.config?.uix, cardInfo.config, "card");

        return cardElement;
      } catch (error) {
        logDebug(
          "ERROR",
          `Error loading carousel card ${cardInfo.visibleIndex}:`,
          error,
        );

        const cardData = this.card.cards.find(
          (card) =>
            card.visibleIndex === cardInfo.visibleIndex &&
            card.originalIndex === cardInfo.originalIndex,
        );

        if (cardData) {
          cardData.error = true;
          cardData.contentLoaded = true;

          try {
            const errorCard = await helpers.createErrorCardElement(
              {
                type: "error",
                error: `Failed to create card: ${error.message}`,
                origConfig: cardInfo.config,
              },
              this.card._hass,
            );
            cardData.slide.appendChild(errorCard);
            cardData.element = errorCard;
          } catch (errorCardError) {
            console.error("Failed to create error card:", errorCardError);
          }
        }

        return null;
      }
    });

    await Promise.allSettled(contentPromises);
    logDebug("INIT", `Carousel ${batchType} content loading completed`);
  }

  /**
   * Helper method to insert loaded cards into DOM (for single mode)
   * @private
   */
  _insertLoadedCardsIntoDom() {
    // Check if card is still connected and DOM is valid
    if (!this.card.isConnected || !this.card.sliderElement) {
      logDebug(
        "ERROR",
        "_insertLoadedCardsIntoDom: Card disconnected or sliderElement is null, skipping",
        {
          connected: this.card.isConnected,
          hasSlider: !!this.card.sliderElement,
        },
      );
      return;
    }

    const cardsToInsert = this.card.cards
      .filter(
        (cardData) =>
          cardData && cardData.slide && !cardData.slide.parentElement,
      )
      .sort((a, b) => a.visibleIndex - b.visibleIndex);

    cardsToInsert.forEach((cardData) => {
      // Double-check slider still exists before each insertion
      if (!this.card.sliderElement) {
        logDebug("ERROR", "Slider element disappeared during insertion loop");
        return;
      }

      cardData.slide.setAttribute("data-index", cardData.originalIndex);
      cardData.slide.setAttribute("data-visible-index", cardData.visibleIndex);
      if (cardData.isDuplicate) {
        cardData.slide.setAttribute("data-duplicate", "true");
      }
      if (cardData.config?.type) {
        cardData.slide.setAttribute("data-card-type", cardData.config.type);
      }

      // For stacked mode: hide slide BEFORE inserting into DOM to prevent flicker
      // The slide will be made visible with proper transforms after insertion.
      // Stack into a single grid cell (see SwipeEffects._setupStackedLayout) so
      // the slide still contributes to the slider's intrinsic height.
      if (this.card.swipeEffects?.usesStackedMode()) {
        cardData.slide.style.gridColumn = "1";
        cardData.slide.style.gridRow = "1";
        cardData.slide.style.opacity = "0";
        cardData.slide.style.zIndex = "0";
      }

      const existingSlides = Array.from(this.card.sliderElement.children);
      let insertPosition = existingSlides.length;

      for (let i = 0; i < existingSlides.length; i++) {
        const existingVisibleIndex = parseInt(
          existingSlides[i].getAttribute("data-visible-index") || "0",
        );
        if (existingVisibleIndex > cardData.visibleIndex) {
          insertPosition = i;
          break;
        }
      }

      if (insertPosition === existingSlides.length) {
        this.card.sliderElement.appendChild(cardData.slide);
      } else {
        this.card.sliderElement.insertBefore(
          cardData.slide,
          existingSlides[insertPosition],
        );
      }

      // Apply stacked transforms to newly inserted slides if effects are initialized
      // This ensures cards loaded in later batches get proper positioning
      if (this.card.swipeEffects?.usesStackedMode()) {
        const domIndex = Array.from(this.card.sliderElement.children).indexOf(
          cardData.slide,
        );
        this.card.swipeEffects.applyStackedTransformToNewSlide(
          cardData.slide,
          domIndex,
        );
      }

      // Start observing slide for auto height after inserting into DOM
      if (this.card.autoHeight?.enabled) {
        this.card.autoHeight.observeSlide(
          cardData.slide,
          cardData.visibleIndex,
        );
      }
    });
  }

  /**
   * Detects if the card is inside a layout-card or similar layout container
   * @returns {boolean} True if inside layout-card
   * @private
   */
  _detectLayoutCard() {
    let element = this.card;
    let maxDepth = 10; // Prevent infinite loops

    while (element && maxDepth > 0) {
      element = element.parentElement || element.parentNode?.host;

      if (!element) break;

      // Check if this is a layout-card element or Home Assistant's native Masonry view
      const tagName = element.tagName?.toLowerCase();
      if (
        tagName === "layout-card" ||
        tagName === "masonry-layout" ||
        tagName === "horizontal-layout" ||
        tagName === "vertical-layout" ||
        tagName === "grid-layout" ||
        tagName === "hui-masonry-view"
      ) {
        logDebug(
          "INIT",
          `Ã¢Å“â€¦ DETECTED PARENT LAYOUT CONTAINER: ${tagName}`,
        );
        console.log(
          `SimpleSwipeCard: âœ… MASONRY/LAYOUT DETECTED`,
          "background: #4caf50; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
          `Parent container: ${tagName}`,
        );

        // Add data attribute to card for easy verification
        this.card.setAttribute("data-in-layout-container", tagName);

        return true;
      }

      maxDepth--;
    }

    // No layout container detected
    this.card.removeAttribute("data-in-layout-container");
    return false;
  }
}
