/**
 * Card creation and DOM building for Simple Swipe Card
 */

import { logDebug } from "../utils/Debug.js";
import { getHelpers } from "./Dependencies.js";
import {
  createSlide,
  createPreviewContainer,
  createEmptyContainer,
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

    // Handle empty state (PREVIEW)
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

    // Handle case where no cards are visible
    if (this.card.visibleCardIndices.length === 0) {
      logDebug("INIT", "No visible cards, showing empty state.");
      const emptyContainer = createEmptyContainer();

      root.innerHTML = "";
      root.appendChild(style);
      root.appendChild(emptyContainer);

      this.card.initialized = true;
      this.card.building = false;
      return;
    }

    // Build cards - load ALL visible cards upfront (no lazy loading)
    logDebug(
      "INIT",
      "Building ALL visible cards:",
      this.card.visibleCardIndices.length,
      "out of",
      this.card._config.cards.length,
    );

    // Load all visible cards to ensure smooth animations
    const cardsToLoad = Array.from(
      { length: this.card.visibleCardIndices.length },
      (_, i) => i,
    );

    const cardPromises = cardsToLoad.map((visibleIndex) => {
      const originalIndex = this.card.visibleCardIndices[visibleIndex];
      return this.createCard(
        this.card._config.cards[originalIndex],
        visibleIndex,
        originalIndex,
        helpers,
      );
    });

    await Promise.allSettled(cardPromises);

    // Sort and append cards
    this.card.cards
      .filter(Boolean)
      .sort((a, b) => a.visibleIndex - b.visibleIndex)
      .forEach((cardData) => {
        if (cardData.slide) {
          // Add data-index attribute for event targeting (use original index)
          cardData.slide.setAttribute("data-index", cardData.originalIndex);
          cardData.slide.setAttribute(
            "data-visible-index",
            cardData.visibleIndex,
          );
          // Add card type attribute for debugging and event filtering
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
    logDebug("INIT", "Build finished - all cards loaded upfront.");

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
   * @param {number} visibleIndex - Index in the visible cards array
   * @param {number} originalIndex - Original index in the full cards array
   * @param {Object} helpers - Home Assistant card helpers
   */
  async createCard(cardConfig, visibleIndex, originalIndex, helpers) {
    const slideDiv = createSlide();
    let cardElement;
    const cardData = {
      visibleIndex,
      originalIndex,
      slide: slideDiv,
      config: JSON.parse(JSON.stringify(cardConfig)),
      error: false,
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
    this.card.cards[visibleIndex] = cardData;
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

    this.card.slideWidth = containerWidth;
    this.card.slideHeight = containerHeight;

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
    );

    // All cards are already loaded - no preloading needed

    // Setup auto-swipe and reset-after if enabled
    this.card.autoSwipe?.manage();
    this.card.resetAfter?.manage();
    this.card.stateSynchronization?.manage();
  }
}
