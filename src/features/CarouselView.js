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

  calculateTransform(targetIndex) {
    if (!this.card.cards || this.card.cards.length === 0) return 0;

    // NEW: Support both responsive and legacy approaches
    let cardsVisible;
    const containerWidth = this.card.cardContainer.offsetWidth;
    const cardSpacing =
      Math.max(0, parseInt(this.card._config.card_spacing)) || 0;

    if (this.card._config.cards_visible !== undefined) {
      // Legacy approach - use fixed cards_visible (backwards compatibility)
      cardsVisible = this.card._config.cards_visible;
      logDebug("SWIPE", "Using legacy cards_visible approach:", cardsVisible);
    } else {
      // NEW: Responsive approach - calculate fractional cards_visible from card_min_width
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

    // Edge case: If we have fewer cards than cards_visible, don't transform at all
    if (totalCards <= Math.floor(cardsVisible)) {
      logDebug(
        "SWIPE",
        "Insufficient cards for carousel transform, staying at position 0",
      );
      return 0;
    }

    // Edge case: Don't scroll past the point where we'd show empty space
    const maxScrollableIndex = Math.max(0, totalCards - 1);
    const clampedIndex = Math.min(targetIndex, maxScrollableIndex);

    // Calculate individual card width (same logic as in CardBuilder)
    const totalSpacing = (cardsVisible - 1) * cardSpacing;
    const cardWidth = (containerWidth - totalSpacing) / cardsVisible;

    // In carousel mode, we move by single card width + spacing
    const moveDistance = cardWidth + cardSpacing;
    const transform = clampedIndex * moveDistance;

    logDebug("SWIPE", "Carousel transform calculation:", {
      targetIndex,
      clampedIndex,
      totalCards,
      maxScrollableIndex,
      cardsVisible: cardsVisible.toFixed(2),
      cardWidth: cardWidth.toFixed(2),
      cardSpacing,
      moveDistance: moveDistance.toFixed(2),
      transform: transform.toFixed(2),
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
    const totalVisibleCards = this.card.visibleCardIndices.length;
    const loopbackEnabled = this.card._config.enable_loopback === true;

    if (loopbackEnabled && totalVisibleCards > 1) {
      if (proposedIndex < 0) {
        return totalVisibleCards - 1;
      } else if (proposedIndex >= totalVisibleCards) {
        return 0;
      }
    } else {
      // Clamp to valid range
      return Math.max(0, Math.min(proposedIndex, totalVisibleCards - 1));
    }

    return proposedIndex;
  }
}
