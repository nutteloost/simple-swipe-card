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

/**
 * Card builder class for managing card creation and layout
 */
export class CardBuilder {
  constructor(cardInstance) {
    this.card = cardInstance;
  }

  /**
   * Builds or rebuilds the entire card
   */
  async build() {
    if (this.card.building) {
      logDebug("INIT", "Build already in progress, skipping.");
      return;
    }
    if (
      !this.card._config ||
      !this.card._config.cards ||
      !this.card.isConnected
    ) {
      logDebug("INIT", "Build skipped (no config/cards or not connected).");
      return;
    }

    this.card.building = true;
    logDebug("INIT", "Starting build...");

    // Preserve reset-after state before rebuild
    this.card.resetAfter?.preserveState();

    // Reset state
    this.card.cards = [];
    this.card.currentIndex = 0;
    this.card.virtualIndex = 0;
    this.card.realIndex = 0;
    this.card.resizeObserver?.cleanup();
    this.card.swipeGestures?.removeGestures();
    this.card.autoSwipe?.stop();
    this.card.resetAfter?.stopTimer();
    if (this.card.shadowRoot) this.card.shadowRoot.innerHTML = "";

    const root = this.card.shadowRoot;

    const helpers = await getHelpers();
    if (!helpers) {
      console.error("SimpleSwipeCard: Card helpers not loaded.");
      root.innerHTML = `<ha-alert alert-type="error">Card Helpers are required for this card to function. Please ensure they are loaded.</ha-alert>`;
      this.card.building = false;
      this.card.initialized = false;
      return;
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
    this.card.cardContainer.appendChild(this.card.sliderElement);
    root.appendChild(this.card.cardContainer);

    // Update visible card indices
    this.card._updateVisibleCardIndices();

    // Handle empty state (PREVIEW) - only for completely empty config
    if (this.card._config.cards.length === 0) {
      logDebug("INIT", "Building preview state.");
      const previewContainer = createPreviewContainer(
        this.card._swipeDirection,
        (e) => handleEditClick(e, this.card),
      );

      // Append the preview directly to the shadow root, not inside the slider
      root.innerHTML = ""; // Clear previous content (including styles)
      root.appendChild(style); // Re-add styles
      root.appendChild(previewContainer);

      this.card.initialized = true;
      this.card.building = false;
      // No layout finish needed for preview
      return;
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
      return;
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
      infiniteMode: this.card.isInfiniteMode,
    });

    const cardPromises = cardsToLoad.map((cardInfo) => {
      return this.createCard(
        cardInfo.config,
        cardInfo.visibleIndex,
        cardInfo.originalIndex,
        helpers,
        cardInfo.isDuplicate,
      );
    });

    await Promise.allSettled(cardPromises);

    // Sort and append cards
    this.card.cards
      .filter(Boolean)
      .sort((a, b) => a.visibleIndex - b.visibleIndex)
      .forEach((cardData) => {
        if (cardData.slide) {
          // Add data attributes for debugging
          cardData.slide.setAttribute("data-index", cardData.originalIndex);
          cardData.slide.setAttribute(
            "data-visible-index",
            cardData.visibleIndex,
          );
          if (cardData.isDuplicate) {
            cardData.slide.setAttribute("data-duplicate", "true");
          }
          if (cardData.config && cardData.config.type) {
            cardData.slide.setAttribute("data-card-type", cardData.config.type);
          }
          this.card.sliderElement.appendChild(cardData.slide);
        }
      });

    this.card.pagination?.create();
    this.card._applyCardModStyles();

    // Defer layout and gestures until next frame
    requestAnimationFrame(() => this.finishBuildLayout());

    this.card.initialized = true;
    this.card.building = false;
    logDebug("INIT", "Build finished - all cards loaded.");

    // Restore reset-after state after rebuild
    this.card.resetAfter?.restoreState();
  }

  /**
   * Preloads adjacent cards when needed (now a no-op since all cards are loaded upfront)
   * @param {number} currentVisibleIndex - The current visible card index
   */
  preloadAdjacentCards() {
    // No-op: All cards are now loaded upfront, so no additional preloading needed
    logDebug(
      "INIT",
      "preloadAdjacentCards called but all cards already loaded",
    );
    return;
  }

  /**
   * Creates a card element and adds it to the slider
   * @param {Object} cardConfig - Configuration for the card
   * @param {number} visibleIndex - Index in the visible cards array (can be negative for infinite mode leading duplicates)
   * @param {number} originalIndex - Original index in the full cards array
   * @param {Object} helpers - Home Assistant card helpers
   * @param {boolean} isDuplicate - Whether this is a duplicate card for infinite scrolling
   */
  async createCard(
    cardConfig,
    visibleIndex,
    originalIndex,
    helpers,
    isDuplicate = false,
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
      cardElement = await helpers.createCardElement(cardConfig);
      if (this.card._hass) cardElement.hass = this.card._hass;
      cardData.element = cardElement;

      // Add special attribute for picture-elements cards to enhance tracking
      if (cardConfig.type === "picture-elements") {
        cardElement.setAttribute("data-swipe-card-picture-elements", "true");
        slideDiv.setAttribute("data-has-picture-elements", "true");
      }

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
      slideDiv.appendChild(cardElement);
    } catch (e) {
      logDebug(
        "ERROR",
        `Error creating card ${visibleIndex} (original ${originalIndex}):`,
        cardConfig,
        e,
      );
      cardData.error = true;
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
   * Finishes the build process by setting up layout and observers
   */
  finishBuildLayout() {
    if (
      !this.card.cardContainer ||
      !this.card.isConnected ||
      this.card.building
    ) {
      logDebug("INIT", "_finishBuildLayout skipped", {
        container: !!this.card.cardContainer,
        connected: this.card.isConnected,
        building: this.card.building,
      });
      return;
    }
    logDebug("INIT", "Finishing build layout...");

    const containerWidth = this.card.cardContainer.offsetWidth;
    const containerHeight = this.card.cardContainer.offsetHeight;

    if (containerWidth <= 0 || containerHeight <= 0) {
      if (this.card.offsetParent === null) {
        logDebug("INIT", "Layout calculation skipped, element is hidden.");
        return;
      }
      logDebug("INIT", "Container dimensions are 0, retrying layout...");
      this.card._layoutRetryCount = (this.card._layoutRetryCount || 0) + 1;
      if (this.card._layoutRetryCount < 5) {
        setTimeout(
          () => requestAnimationFrame(() => this.finishBuildLayout()),
          100,
        );
      } else {
        console.error("SimpleSwipeCard: Failed to get container dimensions.");
        this.card._layoutRetryCount = 0;
      }
      return;
    }
    this.card._layoutRetryCount = 0;

    // Set basic dimensions
    this.card.slideWidth = containerWidth;
    this.card.slideHeight = containerHeight;

    // Handle carousel mode layout
    const viewMode = this.card._config.view_mode || "single";
    if (viewMode === "carousel") {
      this._setupCarouselLayout(containerWidth, containerHeight);
    }

    const totalVisibleCards = this.card.visibleCardIndices.length;

    // Adjust index if out of bounds
    this.card.currentIndex = Math.max(
      0,
      Math.min(this.card.currentIndex, totalVisibleCards - 1),
    );

    // Apply matching border radius to all loaded slides
    applyBorderRadiusToSlides(this.card.cards, this.card.cardContainer);

    this.card.updateSlider(false);

    this.card._setupResizeObserver();

    // Add swipe gestures if needed (based on visible cards)
    if (totalVisibleCards > 1) {
      this.card.swipeGestures?.addGestures();
    } else {
      this.card.swipeGestures?.removeGestures();
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

    // All cards are already loaded - no preloading needed

    // Setup auto-swipe and reset-after if enabled
    this.card.autoSwipe?.manage();
    this.card.resetAfter?.manage();
    this.card.stateSynchronization?.manage();
  }

  /**
   * Sets up carousel mode layout and sizing
   * @param {number} containerWidth - Container width
   * @private
   */
  _setupCarouselLayout(containerWidth) {
    // Support both responsive and legacy approaches
    let cardsVisible;
    const cardSpacing =
      Math.max(0, parseInt(this.card._config.card_spacing)) || 0;

    if (this.card._config.cards_visible !== undefined) {
      // Legacy approach - use fixed cards_visible (backwards compatibility)
      cardsVisible = this.card._config.cards_visible;
      logDebug(
        "INIT",
        "Carousel layout using legacy cards_visible approach:",
        cardsVisible,
      );
    } else {
      // Responsive approach - calculate fractional cards_visible from card_min_width
      const minWidth = this.card._config.card_min_width || 200;
      const rawCardsVisible =
        (containerWidth + cardSpacing) / (minWidth + cardSpacing);
      cardsVisible = Math.max(1.1, Math.round(rawCardsVisible * 10) / 10); // Round to 1 decimal
      logDebug("INIT", "Carousel layout using responsive approach:", {
        minWidth,
        containerWidth,
        cardSpacing,
        rawCardsVisible: rawCardsVisible.toFixed(2),
        finalCardsVisible: cardsVisible,
      });
    }

    // Calculate individual card width
    // Total spacing = (cards_visible - 1) * cardSpacing (spacing between visible cards)
    const totalSpacing = (cardsVisible - 1) * cardSpacing;
    const cardWidth = (containerWidth - totalSpacing) / cardsVisible;

    logDebug("INIT", "Carousel layout setup:", {
      containerWidth,
      cardsVisible: cardsVisible.toFixed(2),
      cardSpacing,
      totalSpacing,
      cardWidth: cardWidth.toFixed(2),
    });

    // Set CSS custom property for card width
    this.card.style.setProperty("--carousel-card-width", `${cardWidth}px`);

    // Add carousel data attribute to slider and container
    this.card.sliderElement.setAttribute("data-view-mode", "carousel");
    this.card.cardContainer.setAttribute("data-view-mode", "carousel");

    // Apply carousel class to all card slides
    this.card.cards.forEach((cardData) => {
      if (cardData && cardData.slide) {
        cardData.slide.classList.add("carousel-mode");
      }
    });
  }
}
