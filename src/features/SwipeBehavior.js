/**
 * Swipe behavior functionality for Simple Swipe Card
 * Handles single vs free swipe modes
 */

import { logDebug } from "../utils/Debug.js";

/**
 * Swipe behavior manager class
 */
export class SwipeBehavior {
  constructor(cardInstance) {
    this.card = cardInstance;
  }

  /**
   * Gets the current swipe behavior from configuration
   * @returns {string} Swipe behavior: 'single' or 'free'
   */
  getBehavior() {
    return this.card._config.swipe_behavior || "single";
  }

  /**
   * Calculates how many cards to skip based on swipe velocity and distance
   * @param {number} velocity - Swipe velocity (pixels per millisecond)
   * @param {number} distance - Total swipe distance (pixels)
   * @param {number} totalCards - Total number of visible cards
   * @param {string} behavior - 'single' or 'free'
   * @returns {number} Number of cards to skip (1 for single mode)
   */
  calculateSkipCount(velocity, distance, totalCards, behavior) {
    if (behavior === "single") return 1;

    // Calculate the correct unit size based on view mode
    const viewMode = this.card._config.view_mode || "single";
    let unitSize;

    if (viewMode === "carousel") {
      // In carousel mode, use individual card width
      const cardsVisible = this.card._config.cards_visible || 
                          this.card._calculateCardsVisibleFromMinWidth();
      const cardSpacing = Math.max(0, parseInt(this.card._config.card_spacing)) || 0;
      const totalSpacing = (cardsVisible - 1) * cardSpacing;
      unitSize = (this.card.slideWidth - totalSpacing) / cardsVisible;
    } else {
      // In single mode, use full slide size
      unitSize = this.card._swipeDirection === "horizontal"
        ? this.card.slideWidth
        : this.card.slideHeight;
    }

    // Distance-based skip count (50% threshold)
    const distanceBasedSkip = Math.max(1, Math.round(distance / unitSize));

    // Two different approaches based on swipe characteristics
    if (velocity > 0.8) {
      // QUICK SWIPE: Use velocity-dominant calculation with lower thresholds
      let velocityBasedSkip = 1;
      if (velocity > 0.8) velocityBasedSkip = 2;   // Much lower threshold - easy to trigger
      if (velocity > 1.5) velocityBasedSkip = 3;   // Medium speed gets 3 cards
      if (velocity > 2.5) velocityBasedSkip = 4;   // High speed gets 4 cards
      
      // For quick swipes, take the higher of velocity-based or distance-based
      const quickSwipeResult = Math.max(velocityBasedSkip, distanceBasedSkip);
      
      logDebug("SWIPE", "Quick swipe detected:", {
        velocity: velocity.toFixed(3),
        distance: distance.toFixed(0),
        unitSize: unitSize.toFixed(0),
        velocityBasedSkip,
        distanceBasedSkip,
        result: quickSwipeResult,
      });
      
      return Math.min(quickSwipeResult, Math.min(4, totalCards - 1));
      
    } else {
      // CONTROLLED DRAG: Use pure distance-based calculation
      logDebug("SWIPE", "Controlled drag detected:", {
        velocity: velocity.toFixed(3),
        distance: distance.toFixed(0),
        unitSize: unitSize.toFixed(0),
        distanceBasedSkip,
      });
      
      return Math.min(distanceBasedSkip, totalCards - 1);
    }
  }

  /**
   * Calculates appropriate animation speed with dynamic timing based on card count
   * @param {number} skipCount - Number of cards being skipped
   * @returns {number} Animation duration in milliseconds
   */
  calculateAnimationDuration(skipCount) {
    const totalCards = this.card.visibleCardIndices.length;
    
    // For few cards (1-3), use the current longer, more deliberate timing
    if (totalCards <= 3) {
      const baseDuration = 800;
      const extraDuration = (skipCount - 1) * 500;
      const duration = Math.min(baseDuration + extraDuration, 2400);
      
      logDebug("SWIPE", "Animation duration (few cards):", skipCount, "cards,", duration + "ms");
      return duration;
    }
    
    // For many cards (4+), use faster, more momentum-preserving timing
    const baseDuration = 600; // Shorter base for momentum feel
    const extraDuration = (skipCount - 1) * 200; // Much less per additional card
    const maxDuration = Math.min(1200 + (totalCards * 50), 2000); // Dynamic max based on total cards
    const duration = Math.min(baseDuration + extraDuration, maxDuration);
    
    logDebug("SWIPE", "Animation duration (many cards):", {
      skipCount,
      totalCards,
      baseDuration,
      extraDuration,
      maxDuration,
      finalDuration: duration + "ms"
    });

    return duration;
  }

  /**
   * Gets the appropriate easing function for multi-card animations
   * @param {number} skipCount - Number of cards being skipped
   * @returns {string} CSS easing function
   */
  getEasingFunction(skipCount) {
    if (skipCount === 1) {
      return "ease-out"; // Standard easing for single card
    }

    // For multi-card swipes, use a much slower deceleration
    // This cubic-bezier creates a fast start but very slow, gradual end
    return "cubic-bezier(0.25, 0.46, 0.45, 0.94)"; // Much slower deceleration than ease-out
  }
}