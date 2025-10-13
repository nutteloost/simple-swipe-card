/**
 * Auto Height management for Simple Swipe Card
 */

import { logDebug } from "../utils/Debug.js";

export class AutoHeight {
  constructor(cardInstance) {
    this.card = cardInstance;
    this.slideObservers = new Map(); // Map of slideIndex -> ResizeObserver
    this.cardHeights = {}; // Store calculated heights
    this.enabled = false;
  }

  /**
   * Initialize auto height feature
   */
  initialize() {
    const enabled = this.card._config.auto_height === true;
    const isCompatible =
      this.card._config.view_mode === "single" &&
      this.card._config.swipe_direction === "horizontal" &&
      this.card._config.loop_mode !== "infinite";

    this.enabled = enabled && isCompatible;

    if (this.enabled) {
      this.card.setAttribute("data-auto-height", "");
      logDebug("AUTO_HEIGHT", "Auto height enabled");
    } else {
      this.card.removeAttribute("data-auto-height");
      this.cleanup();
    }
  }

  /**
   * Observe a slide for height changes
   * @param {HTMLElement} slideElement - The slide element
   * @param {number} slideIndex - The slide index
   */
  observeSlide(slideElement, slideIndex) {
    if (!this.enabled || !slideElement) return;

    // Don't observe if already observing
    if (this.slideObservers.has(slideIndex)) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newHeight = entry.contentRect.height;

        // Ignore invalid heights (too small during loading)
        if (newHeight < 10) {
          logDebug(
            "AUTO_HEIGHT",
            `Card ${slideIndex} height too small (${newHeight}px), waiting for content to load`,
          );
          return;
        }

        if (this.cardHeights[slideIndex] !== newHeight) {
          logDebug(
            "AUTO_HEIGHT",
            `Card ${slideIndex} height changed to ${newHeight}px`,
          );
          this.cardHeights[slideIndex] = newHeight;

          // If this is the current visible card, update container
          if (slideIndex === this.card.currentIndex) {
            this.updateContainerHeight(newHeight);
          }
        }
      }
    });

    observer.observe(slideElement);
    this.slideObservers.set(slideIndex, observer);

    logDebug("AUTO_HEIGHT", `Now observing slide ${slideIndex}`);
  }

  /**
   * Update container height to match current card
   * @param {number} height - New height in pixels
   */
  updateContainerHeight(height) {
    if (!this.enabled || !this.card.cardContainer) return;

    // Fallback if height is invalid
    if (!height || height === 0) {
      if (this.card.cardContainer.offsetHeight > 0) {
        logDebug("AUTO_HEIGHT", "Invalid height, keeping current height");
        return;
      }
      height = 250; // Fallback default
      logDebug("AUTO_HEIGHT", "Using fallback height: 250px");
    }

    this.card.cardContainer.style.height = `${height}px`;
    logDebug("AUTO_HEIGHT", `Container height set to ${height}px`);
  }

  /**
   * Update container for current card (called during navigation)
   */
  updateForCurrentCard() {
    if (!this.enabled) return;

    const currentHeight = this.cardHeights[this.card.currentIndex];
    if (currentHeight && currentHeight > 0) {
      this.updateContainerHeight(currentHeight);
    } else {
      logDebug(
        "AUTO_HEIGHT",
        `No height cached for card ${this.card.currentIndex}, waiting for ResizeObserver`,
      );
    }
  }

  /**
   * Cleanup all observers
   */
  cleanup() {
    this.slideObservers.forEach((observer, index) => {
      observer.disconnect();
      logDebug("AUTO_HEIGHT", `Stopped observing slide ${index}`);
    });
    this.slideObservers.clear();
    this.cardHeights = {};

    // Reset container height
    if (this.card.cardContainer) {
      this.card.cardContainer.style.height = "";
    }
  }
}
