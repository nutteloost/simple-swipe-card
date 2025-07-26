/**
 * Carousel view logic for Simple Swipe Card
 */

import { logDebug } from "../utils/Debug.js";

/**
 * Carousel view manager class
 */
export class CarouselView {
  constructor(cardInstance) {
    this.card = cardInstance;
  }

  /**
   * Calculates the transform value for carousel positioning
   * @param {number} targetIndex - The target card index
   * @returns {number} Transform value in pixels
   */
  calculateTransform(targetIndex) {
    if (!this.card.cards || this.card.cards.length === 0) return 0;

    // Support both responsive and legacy approaches
    let cardsVisible;
    const containerWidth = this.card.cardContainer.offsetWidth;
    const cardSpacing =
      Math.max(0, parseInt(this.card._config.card_spacing)) || 0;

    if (this.card._config.cards_visible !== undefined) {
      // Legacy approach - use fixed cards_visible for backwards compatibility
      cardsVisible = this.card._config.cards_visible;
      logDebug("SWIPE", "Using legacy cards_visible approach:", cardsVisible);
    } else {
      // Responsive approach - calculate fractional cards_visible from card_min_width
      const minWidth = this.card._config.card_min_width || 200;
      const rawCardsVisible =
        (containerWidth + cardSpacing) / (minWidth + cardSpacing);
      cardsVisible = Math.max(1.1, Math.round(rawCardsVisible * 10) / 10); // Round to 1 decimal
      logDebug("SWIPE", "Using responsive approach:", {
        minWidth,
        containerWidth,
        cardSpacing,
        rawCardsVisible: rawCardsVisible.toFixed(2),
        finalCardsVisible: cardsVisible,
      });
    }

    const totalCards = this.card.visibleCardIndices.length;
    const loopMode = this.card._config.loop_mode || "none";

    // Edge case: If we have fewer cards than cards_visible, don't transform at all
    if (totalCards <= Math.floor(cardsVisible)) {
      logDebug(
        "SWIPE",
        "Insufficient cards for carousel transform, staying at position 0",
      );
      return 0;
    }

    // Handle infinite mode - map logical index to DOM position
    let domPosition;
    let maxScrollableIndex;

    if (loopMode === "infinite") {
      // Map logical index to DOM position (same as single mode fix)
      const duplicateCount = this.card.loopMode.getDuplicateCount();
      domPosition = targetIndex + duplicateCount;
      maxScrollableIndex = "infinite";
      logDebug(
        "SWIPE",
        "Carousel infinite mode: logical index",
        targetIndex,
        "-> DOM position",
        domPosition,
      );
    } else {
      // Original logic for non-infinite modes
      maxScrollableIndex = Math.max(0, totalCards - 1);
      domPosition = Math.min(targetIndex, maxScrollableIndex);
    }

    // Calculate individual card width (same logic as in CardBuilder)
    const totalSpacing = (cardsVisible - 1) * cardSpacing;
    const cardWidth = (containerWidth - totalSpacing) / cardsVisible;

    // In carousel mode, we move by single card width + spacing
    const moveDistance = cardWidth + cardSpacing;
    const transform = domPosition * moveDistance;

    logDebug("SWIPE", "Carousel transform calculation:", {
      targetIndex,
      domPosition,
      totalCards,
      maxScrollableIndex,
      cardsVisible: cardsVisible.toFixed(2),
      cardWidth: cardWidth.toFixed(2),
      cardSpacing,
      moveDistance: moveDistance.toFixed(2),
      transform: transform.toFixed(2),
      loopMode,
    });

    return transform;
  }

  /**
   * Updates the slider position for carousel mode
   * @param {number} targetIndex - The target visible card index
   * @param {boolean} animate - Whether to animate the transition
   */
  updateSliderPosition(targetIndex, animate = true) {
    if (!this.card.sliderElement) return;

    const transform = this.calculateTransform(targetIndex);

    // Set transition
    this.card.sliderElement.style.transition =
      this.card._getTransitionStyle(animate);

    // Apply transform (carousel only supports horizontal)
    this.card.sliderElement.style.transform = `translateX(-${transform}px)`;

    logDebug(
      "SWIPE",
      `Carousel slider updated to index ${targetIndex}, transform: -${transform.toFixed(2)}px`,
    );
  }

  /**
   * Handles loopback logic for carousel mode
   * @param {number} proposedIndex - The proposed new index
   * @returns {number} The actual index after loopback logic
   */
  handleLoopback(proposedIndex) {
    return this.card.loopMode.handleNavigation(proposedIndex, true);
  }

  /**
   * Helper method for infinite loop virtual index calculation
   * @param {number} index - Proposed index that may be out of bounds
   * @returns {number} Virtual index for infinite loop
   * @private
   */
  _getVirtualIndex(index) {
    const totalCards = this.card.visibleCardIndices.length;
    // For now, return wrapped index - will enhance for true infinite loop
    if (index < 0) return totalCards - 1;
    if (index >= totalCards) return 0;
    return index;
  }
}
