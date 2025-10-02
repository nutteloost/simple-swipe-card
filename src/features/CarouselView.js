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

    const containerWidth = this.card.cardContainer.offsetWidth;
    const cardSpacing =
      Math.max(0, parseInt(this.card._config.card_spacing)) || 0;

    // Use stored dimensions if available (set during layout), otherwise recalculate
    let cardWidth, cardsVisible;

    if (this.card._carouselCardWidth && this.card._carouselCardsVisible) {
      cardWidth = this.card._carouselCardWidth;
      cardsVisible = this.card._carouselCardsVisible;
      logDebug("SWIPE", "Using stored carousel dimensions:", {
        cardWidth: cardWidth.toFixed(2),
        cardsVisible: cardsVisible.toFixed(2),
      });
    } else {
      // Fallback: read from CSS or recalculate
      const computedWidth = getComputedStyle(this.card)
        .getPropertyValue("--carousel-card-width")
        .trim();

      if (computedWidth && computedWidth !== "" && computedWidth !== "auto") {
        cardWidth = parseFloat(computedWidth);
        cardsVisible =
          (containerWidth + cardSpacing) / (cardWidth + cardSpacing);
      } else {
        // Calculate from config
        if (this.card._config.cards_visible !== undefined) {
          cardsVisible = this.card._config.cards_visible;
        } else {
          const minWidth = this.card._config.card_min_width || 200;
          const rawCardsVisible =
            (containerWidth + cardSpacing) / (minWidth + cardSpacing);
          cardsVisible = Math.max(1.1, Math.round(rawCardsVisible * 10) / 10);
        }

        const totalSpacing = (cardsVisible - 1) * cardSpacing;
        cardWidth = (containerWidth - totalSpacing) / cardsVisible;
      }

      logDebug("SWIPE", "Recalculated carousel dimensions:", {
        cardWidth: cardWidth.toFixed(2),
        cardsVisible: cardsVisible.toFixed(2),
      });
    }

    const totalCards = this.card.visibleCardIndices.length;
    const loopMode = this.card._config.loop_mode || "none";

    // Edge case: If we have fewer cards than cards_visible, don't transform at all
    if (
      totalCards <= Math.floor(cardsVisible) &&
      this.card._config.loop_mode !== "infinite"
    ) {
      logDebug(
        "SWIPE",
        "Insufficient cards for carousel transform, staying at position 0",
      );
      return 0;
    }

    // Handle infinite mode properly for carousel - use real DOM positioning
    let domPosition;

    if (loopMode === "infinite" && totalCards > 1) {
      const duplicateCount = this.card.loopMode.getDuplicateCount();
      domPosition = targetIndex + duplicateCount;
      logDebug(
        "SWIPE",
        "Carousel infinite mode: logical index",
        targetIndex,
        "-> DOM position",
        domPosition,
        "duplicateCount:",
        duplicateCount,
      );
    } else {
      domPosition = Math.min(targetIndex, Math.max(0, totalCards - 1));
    }

    // In carousel mode, we move by single card width + spacing
    const moveDistance = cardWidth + cardSpacing;
    const transform = domPosition * moveDistance;

    logDebug("SWIPE", "Carousel transform calculation:", {
      targetIndex,
      domPosition,
      totalCards,
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

    // Handle custom animation duration for multi-card swipes (like single mode)
    if (
      animate &&
      this.card._config.swipe_behavior === "free" &&
      this.card._lastSkipCount > 1
    ) {
      const animationDuration =
        this.card.swipeBehavior.calculateAnimationDuration(
          this.card._lastSkipCount,
        );
      const easingFunction = this.card.swipeBehavior.getEasingFunction(
        this.card._lastSkipCount,
      );
      this.card.sliderElement.style.transition = `transform ${animationDuration}ms ${easingFunction}`;
      logDebug(
        "SWIPE",
        `Carousel multi-card animation: ${this.card._lastSkipCount} cards, ${animationDuration}ms duration, easing: ${easingFunction}`,
      );
    } else {
      // Use default transition
      this.card.sliderElement.style.transition =
        this.card._getTransitionStyle(animate);
    }

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
