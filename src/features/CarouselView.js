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
   * Calculates the transform amount for carousel mode
   * @param {number} targetIndex - The target card index
   * @returns {number} Transform amount in pixels
   */
  calculateTransform(targetIndex) {
    if (!this.card.cards || this.card.cards.length === 0) return 0;

    const cardsVisible = this.card._config.cards_visible || 2.5;
    const cardSpacing =
      Math.max(0, parseInt(this.card._config.card_spacing)) || 0;
    const containerWidth = this.card.cardContainer.offsetWidth;
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
