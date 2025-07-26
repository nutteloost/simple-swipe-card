/**
 * Loop mode functionality for Simple Swipe Card
 * Handles infinite loop, loopback, and none modes
 */

import { logDebug } from "../utils/Debug.js";

/**
 * Loop mode manager class
 */
export class LoopMode {
  constructor(cardInstance) {
    this.card = cardInstance;

    // Infinite mode state
    this.isInfiniteMode = false;
    this.virtualIndex = 0; // User-perceived position (0-based)
    this.realIndex = 0; // Actual DOM position (0-based)
    this.totalRealCards = 0; // Total cards in DOM (including duplicates)
  }

  /**
   * Gets the current loop mode from configuration
   * @returns {string} Loop mode: 'none', 'loopback', or 'infinite'
   */
  getMode() {
    return this.card._config.loop_mode || "none";
  }

  /**
   * Checks if infinite mode is active
   * @returns {boolean} True if infinite mode is enabled and conditions are met
   */
  isInfinite() {
    const mode = this.getMode();
    return mode === "infinite" && this.card.visibleCardIndices.length > 1;
  }

  /**
   * Initializes loop mode state based on current configuration
   */
  initialize() {
    this.isInfiniteMode = this.isInfinite();

    if (this.isInfiniteMode) {
      logDebug("LOOP", "Infinite loop mode initialized");
    } else {
      // Reset infinite mode state for other modes
      this.virtualIndex = 0;
      this.realIndex = 0;
      this.totalRealCards = 0;
    }
  }

  /**
   * Gets the number of cards to duplicate for infinite loop
   * @returns {number} Number of cards to duplicate at each end
   */
  getDuplicateCount() {
    const viewMode = this.card._config.view_mode || "single";

    if (viewMode === "single") {
      // For single mode, we only need 1 card at each end
      return 1;
    } else {
      // For carousel mode, duplicate enough to fill the visible area
      const cardsVisible =
        this.card._config.cards_visible ||
        this.card._calculateCardsVisibleFromMinWidth();
      return Math.ceil(cardsVisible) + 1; // Extra buffer for smooth transitions
    }
  }

  /**
   * Prepares the list of cards to load, including duplicates for infinite loop
   * @param {Array} visibleCardIndices - Array of visible card indices
   * @param {Array} configCards - Array of card configurations
   * @returns {Array} Array of card info objects to load
   */
  prepareCardsForLoading(visibleCardIndices, configCards) {
    const cardsToLoad = [];

    if (!this.isInfiniteMode) {
      // Normal mode - load only visible cards
      visibleCardIndices.forEach((originalIndex, visibleIndex) => {
        cardsToLoad.push({
          config: configCards[originalIndex],
          visibleIndex: visibleIndex,
          originalIndex: originalIndex,
          isDuplicate: false,
        });
      });
      return cardsToLoad;
    }

    // Infinite loop mode - add duplicates
    const duplicateCount = this.getDuplicateCount();
    const totalVisibleCards = visibleCardIndices.length;

    // Add leading duplicates (copies of last cards)
    for (let i = 0; i < duplicateCount; i++) {
      const sourceIndex = totalVisibleCards - duplicateCount + i;
      const originalIndex = visibleCardIndices[sourceIndex];
      cardsToLoad.push({
        config: configCards[originalIndex],
        visibleIndex: i - duplicateCount, // Negative index for leading duplicates
        originalIndex: originalIndex,
        isDuplicate: true,
      });
    }

    // Add real cards
    visibleCardIndices.forEach((originalIndex, visibleIndex) => {
      cardsToLoad.push({
        config: configCards[originalIndex],
        visibleIndex: visibleIndex,
        originalIndex: originalIndex,
        isDuplicate: false,
      });
    });

    // Add trailing duplicates (copies of first cards)
    for (let i = 0; i < duplicateCount; i++) {
      const originalIndex = visibleCardIndices[i];
      cardsToLoad.push({
        config: configCards[originalIndex],
        visibleIndex: totalVisibleCards + i, // Index after real cards
        originalIndex: originalIndex,
        isDuplicate: true,
      });
    }

    // Store total real cards count for reference
    this.totalRealCards = cardsToLoad.length;

    return cardsToLoad;
  }

  /**
   * Converts virtual index to real DOM index
   * @param {number} virtualIndex - User-perceived index
   * @returns {number} Real DOM index
   */
  virtualToRealIndex(virtualIndex) {
    if (!this.isInfiniteMode) return virtualIndex;

    const totalVisibleCards = this.card.visibleCardIndices.length;
    if (totalVisibleCards === 0) return 0;

    const duplicateCount = this.getDuplicateCount();

    // Normalize virtual index to 0-based within visible cards
    const normalizedVirtual =
      ((virtualIndex % totalVisibleCards) + totalVisibleCards) %
      totalVisibleCards;

    // Real index starts after the leading duplicates
    return duplicateCount + normalizedVirtual;
  }

  /**
   * Converts real DOM index to virtual index
   * @param {number} realIndex - Real DOM index
   * @returns {number} Virtual index
   */
  realToVirtualIndex(realIndex) {
    if (!this.isInfiniteMode) return realIndex;

    const totalVisibleCards = this.card.visibleCardIndices.length;
    if (totalVisibleCards === 0) return 0;

    const duplicateCount = this.getDuplicateCount();

    // Convert real index back to virtual index
    return realIndex - duplicateCount;
  }

  /**
   * Checks if current real index is on a duplicate card
   * @param {number} realIndex - Real DOM index to check
   * @returns {boolean} True if on a duplicate card
   */
  isOnDuplicateCard(realIndex = this.card.currentIndex) {
    if (!this.isInfiniteMode) return false;

    const totalVisibleCards = this.card.visibleCardIndices.length;
    const duplicateCount = this.getDuplicateCount();

    // Check if we're in the leading or trailing duplicate zones
    return (
      realIndex < duplicateCount ||
      realIndex >= duplicateCount + totalVisibleCards
    );
  }

  /**
   * Gets the corresponding real card index for a duplicate
   * @param {number} realIndex - Real DOM index
   * @returns {number} Corresponding real card index
   */
  getCorrespondingRealIndex(realIndex = this.card.currentIndex) {
    if (!this.isInfiniteMode || !this.isOnDuplicateCard(realIndex)) {
      return realIndex;
    }

    const totalVisibleCards = this.card.visibleCardIndices.length;
    const duplicateCount = this.getDuplicateCount();

    if (realIndex < duplicateCount) {
      // We're in leading duplicates, jump to trailing real cards
      const offset = duplicateCount - realIndex;
      return duplicateCount + totalVisibleCards - offset;
    } else {
      // We're in trailing duplicates, jump to leading real cards
      const offset = realIndex - (duplicateCount + totalVisibleCards);
      return duplicateCount + offset;
    }
  }

  /**
   * Determines if we should perform a seamless jump
   * @param {number} currentIndex - Current card index
   * @returns {boolean} True if we should jump
   */
  shouldPerformSeamlessJump(currentIndex = this.card.currentIndex) {
    if (!this.isInfiniteMode) return false;

    const totalVisibleCards = this.card.visibleCardIndices.length;
    // Only trigger jump when we've moved to virtual positions
    // This allows the transition to complete first
    return currentIndex < 0 || currentIndex >= totalVisibleCards;
  }

  /**
   * Schedules a seamless jump to reset position for continued infinite scrolling
   * @param {number} currentIndex - Current card index
   */
  scheduleSeamlessJump(currentIndex = this.card.currentIndex) {
    if (!this.shouldPerformSeamlessJump(currentIndex)) return;

    // Wait longer for the transition to be visible to the user
    const transitionDuration = 400; // Slightly longer to ensure user sees the transition

    setTimeout(() => {
      if (!this.card.isConnected || this.card.building) return;

      const totalVisibleCards = this.card.visibleCardIndices.length;
      let newIndex;

      if (currentIndex < 0) {
        // We're showing last card from virtual position, reset to actual last card position
        newIndex = totalVisibleCards - 1;
      } else if (currentIndex >= totalVisibleCards) {
        // We're showing first card from virtual position, reset to actual first card position
        newIndex = 0;
      } else {
        // We're not in a virtual position, no jump needed
        return;
      }

      logDebug(
        "LOOP",
        `Seamless jump: virtual ${currentIndex} → real ${newIndex}`,
      );

      // Disable transitions temporarily
      if (this.card.sliderElement) {
        this.card.sliderElement.style.transition = "none";
      }

      // Jump to real position
      this.card.currentIndex = newIndex;
      this.card.updateSlider(false);

      // Re-enable transitions after a delay
      setTimeout(() => {
        if (this.card.sliderElement) {
          this.card.sliderElement.style.transition =
            this.card._getTransitionStyle(true);
        }
        logDebug(
          "LOOP",
          `Jump completed - now at real position ${newIndex}, ready for continued scrolling`,
        );
      }, 50); // Small delay to ensure the jump has completed
    }, transitionDuration);
  }

  /**
   * Handles index navigation with loop mode logic
   * @param {number} proposedIndex - The proposed new index
   * @param {boolean} isCarouselMode - Whether we're in carousel mode
   * @returns {number} The actual index after loop mode processing
   */
  handleNavigation(proposedIndex, isCarouselMode = false) {
    const mode = this.getMode();
    const totalVisibleCards = this.card.visibleCardIndices.length;

    if (mode === "infinite") {
      // For infinite mode, allow any index - seamless jump will handle bounds
      return proposedIndex;
    } else if (mode === "loopback" && totalVisibleCards > 1) {
      if (isCarouselMode) {
        // Carousel mode loopback
        if (proposedIndex < 0) {
          return totalVisibleCards - 1;
        } else if (proposedIndex >= totalVisibleCards) {
          return 0;
        }
      } else {
        // Single mode loopback
        if (proposedIndex < 0) {
          return totalVisibleCards - 1;
        } else if (proposedIndex >= totalVisibleCards) {
          return 0;
        }
      }
    } else {
      // No looping - clamp to valid range
      return Math.max(0, Math.min(proposedIndex, totalVisibleCards - 1));
    }

    return proposedIndex;
  }

  /**
   * Gets the wrapped index for pagination display in infinite mode
   * @param {number} currentIndex - Current card index
   * @returns {number} Wrapped index for pagination
   */
  getWrappedIndexForPagination(currentIndex = this.card.currentIndex) {
    if (!this.isInfiniteMode) return currentIndex;

    const totalVisibleCards = this.card.visibleCardIndices.length;
    return (
      ((currentIndex % totalVisibleCards) + totalVisibleCards) %
      totalVisibleCards
    );
  }

  /**
   * Handles auto-swipe navigation with loop mode logic
   * @param {number} currentIndex - Current card index
   * @param {number} direction - Direction of auto-swipe (1 for forward, -1 for backward)
   * @returns {Object} Object with nextIndex and shouldChangeDirection
   */
  handleAutoSwipeNavigation(currentIndex, direction) {
    const mode = this.getMode();
    const totalVisibleCards = this.card.visibleCardIndices.length;

    if (mode === "infinite") {
      // For infinite mode, always move forward, allowing beyond bounds
      return {
        nextIndex: currentIndex + 1,
        shouldChangeDirection: false,
      };
    } else if (mode === "loopback") {
      // For loopback mode, jump back to 0 when reaching the end
      let nextIndex = currentIndex + 1;
      if (nextIndex >= totalVisibleCards) {
        nextIndex = 0;
      }
      return {
        nextIndex: nextIndex,
        shouldChangeDirection: false,
      };
    } else {
      // Ping-pong logic for no looping
      let nextIndex = currentIndex;
      let shouldChangeDirection = false;

      if (direction === 1) {
        // Moving forward
        if (currentIndex >= totalVisibleCards - 1) {
          // At the last visible card
          shouldChangeDirection = true;
          nextIndex = currentIndex - 1;
        } else {
          nextIndex = currentIndex + 1;
        }
      } else {
        // Moving backward
        if (currentIndex <= 0) {
          // At the first visible card
          shouldChangeDirection = true;
          nextIndex = currentIndex + 1;
        } else {
          nextIndex = currentIndex - 1;
        }
      }

      nextIndex = Math.max(0, Math.min(nextIndex, totalVisibleCards - 1));

      return {
        nextIndex: nextIndex,
        shouldChangeDirection: shouldChangeDirection,
      };
    }
  }

  /**
   * Handles swipe gesture navigation with loop mode logic
   * @param {number} currentIndex - Current card index (0-based)
   * @param {number} direction - Direction of swipe (positive for right/down, negative for left/up)
   * @returns {number} The new index after applying loop mode logic
   * @throws {Error} When currentIndex is out of bounds
   * @example
   * // Navigate from first card with left swipe in loopback mode
   * const newIndex = handleSwipeNavigation(0, -1); // Returns last card index
   */
  handleSwipeNavigation(currentIndex, direction) {
    const mode = this.getMode();
    const totalVisibleCards = this.card.visibleCardIndices.length;
    let nextIndex = currentIndex;

    if (direction > 0) {
      // Swiping right/down - go to previous visible card
      if (currentIndex > 0) {
        nextIndex--;
      } else if (mode !== "none" && totalVisibleCards > 1) {
        if (mode === "infinite") {
          // For infinite mode, allow going to -1 (will be handled by seamless jump)
          nextIndex = -1;
        } else {
          // Loopback mode - jump directly
          nextIndex = totalVisibleCards - 1;
        }
      }
    } else if (direction < 0) {
      // Swiping left/up - go to next visible card
      if (currentIndex < totalVisibleCards - 1) {
        nextIndex++;
      } else if (mode !== "none" && totalVisibleCards > 1) {
        if (mode === "infinite") {
          // For infinite mode, allow going beyond bounds
          nextIndex = totalVisibleCards;
        } else {
          // Loopback mode - jump directly
          nextIndex = 0;
        }
      }
    }

    return nextIndex;
  }
}
