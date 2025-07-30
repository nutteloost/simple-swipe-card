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
    
    // Seamless jump state management
    this._pendingSeamlessJump = null; // Track pending jumps to prevent duplicates
    this._activeTransitionHandler = null; // Store reference to active transition handler
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
    const swipeBehavior = this.card._config.swipe_behavior || "single";

    if (viewMode === "single") {
      // For single mode with free swipe, need more duplicates for hard swipes
      return swipeBehavior === "free" ? 6 : 1;
    } else {
      // For carousel mode, we need significantly more duplicates
      const cardsVisible =
        this.card._config.cards_visible ||
        this.card._calculateCardsVisibleFromMinWidth();
      
      // Base count: at least 2x the visible cards to handle wide screens
      const baseCount = Math.max(6, Math.ceil(cardsVisible * 2));
      
      if (swipeBehavior === "free") {
        // For free swipe in carousel: base count + extra buffer for multi-card swipes
        // Add up to 8 extra duplicates to handle fast swipes on wide screens
        const extraBuffer = Math.min(8, Math.ceil(cardsVisible));
        return baseCount + extraBuffer;
      } else {
        // For single swipe in carousel: base count is usually sufficient
        return baseCount;
      }
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

    // FIXED: Add leading duplicates (copies of last cards) with proper wrapping
    for (let i = 0; i < duplicateCount; i++) {
      // FIXED: Wrap around properly when duplicateCount > totalVisibleCards
      const sourceVisibleIndex = (totalVisibleCards - duplicateCount + i + totalVisibleCards) % totalVisibleCards;
      const originalIndex = visibleCardIndices[sourceVisibleIndex];
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

    // FIXED: Add trailing duplicates (copies of first cards) with proper wrapping  
    for (let i = 0; i < duplicateCount; i++) {
      // FIXED: Wrap around properly when duplicateCount > totalVisibleCards
      const sourceVisibleIndex = i % totalVisibleCards;
      const originalIndex = visibleCardIndices[sourceVisibleIndex];
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
   * @param {number} targetIndex - The target index that the animation is moving to
   * @param {number} [customDuration] - Custom animation duration to wait for
   */
  scheduleSeamlessJump(targetIndex, customDuration = null) {
    // Cancel any existing pending jump first
    this._cancelPendingSeamlessJump();
    
    if (!this.shouldPerformSeamlessJump(targetIndex)) {
      logDebug("LOOP", `Seamless jump not needed for target index ${targetIndex}`);
      return;
    }

    // Use custom duration if provided, otherwise use default
    let transitionDuration = customDuration || 400;
    
    logDebug("LOOP", `Scheduling seamless jump for target index ${targetIndex} after ${transitionDuration}ms animation`);

    // Use transitionend event for more precise timing, with timeout as fallback
    let jumpExecuted = false;
    
    const executeJump = () => {
      if (jumpExecuted) return; // Prevent double execution
      jumpExecuted = true;
      
      // Clear any pending timeout
      if (this._pendingSeamlessJump) {
        clearTimeout(this._pendingSeamlessJump);
        this._pendingSeamlessJump = null;
      }
      
      if (!this.card.isConnected || this.card.building) {
        logDebug("LOOP", "Seamless jump cancelled - card disconnected or building");
        // Ensure flag is cleared even if jump is cancelled
        this.card._performingSeamlessJump = false;
        return;
      }

      // Wait for next animation frame to ensure rendering is complete
      requestAnimationFrame(() => {
        try {
          // Use the actual current index at the time of execution
          const actualCurrentIndex = this.card.currentIndex;
          
          logDebug("LOOP", `Seamless jump executing: target was ${targetIndex}, actual current is ${actualCurrentIndex}`);
          
          // Double-check we still need to jump using the actual current index
          if (!this.shouldPerformSeamlessJump(actualCurrentIndex)) {
            logDebug("LOOP", `Seamless jump cancelled - conditions changed (target: ${targetIndex}, actual: ${actualCurrentIndex})`);
            this.card._performingSeamlessJump = false;
            return;
          }

          const totalVisibleCards = this.card.visibleCardIndices.length;
          let newIndex;

          if (actualCurrentIndex < 0) {
            // We're showing last card from virtual position
            newIndex = totalVisibleCards + (actualCurrentIndex % totalVisibleCards);
            if (newIndex >= totalVisibleCards) newIndex = totalVisibleCards - 1;
          } else if (actualCurrentIndex >= totalVisibleCards) {
            // We're showing a duplicate card, jump to equivalent real position
            newIndex = actualCurrentIndex % totalVisibleCards;
          } else {
            // We're not in a virtual position, no jump needed
            logDebug("LOOP", `Seamless jump not needed - already in valid position (${actualCurrentIndex})`);
            this.card._performingSeamlessJump = false;
            return;
          }

          logDebug(
            "LOOP",
            `Performing seamless jump: virtual ${actualCurrentIndex} → real ${newIndex}`,
          );

          // Set flag to prevent interference
          this.card._performingSeamlessJump = true;

          // Disable transitions temporarily with extra safety
          if (this.card.sliderElement) {
            this.card.sliderElement.style.transition = "none";
            
            // Force a reflow to ensure the transition: none is applied
            this.card.sliderElement.offsetHeight;
          }

          // Jump to real position
          this.card.currentIndex = newIndex;
          this.card.updateSlider(false);

          // Re-enable transitions after ensuring the jump has been processed
          requestAnimationFrame(() => {
            try {
              if (this.card.sliderElement) {
                this.card.sliderElement.style.transition =
                  this.card._getTransitionStyle(true);
              }
              
              logDebug(
                "LOOP",
                `Seamless jump completed - now at real position ${newIndex}, ready for continued scrolling`,
              );
            } catch (error) {
              logDebug("ERROR", "Error in seamless jump transition restoration:", error);
            } finally {
              // CRITICAL: Always clear the flag, even if there's an error
              this.card._performingSeamlessJump = false;
            }
          });
        } catch (error) {
          // CRITICAL: Always clear the flag if an error occurs
          logDebug("ERROR", "Error during seamless jump execution:", error);
          this.card._performingSeamlessJump = false;
        }
      });
    };

    // Listen for transitionend event for precise timing
    const transitionEndHandler = (event) => {
      // Only handle transform transitions on the slider element
      if (event.target === this.card.sliderElement && 
          event.propertyName === 'transform' && 
          !jumpExecuted) {
        
        logDebug("LOOP", "Transform transition ended, executing seamless jump");
        this.card.sliderElement.removeEventListener('transitionend', transitionEndHandler);
        this._activeTransitionHandler = null;
        
        // Add a small delay to ensure all rendering is complete
        setTimeout(executeJump, 50);
      }
    };

    if (this.card.sliderElement && transitionDuration > 0) {
      this._activeTransitionHandler = transitionEndHandler;
      this.card.sliderElement.addEventListener('transitionend', transitionEndHandler);
    }

    // Fallback timeout in case transitionend doesn't fire
    const bufferTime = Math.max(150, Math.min(transitionDuration * 0.2, 300));
    const totalWaitTime = transitionDuration + bufferTime;
    
    this._pendingSeamlessJump = setTimeout(() => {
      if (this._activeTransitionHandler && this.card.sliderElement) {
        this.card.sliderElement.removeEventListener('transitionend', this._activeTransitionHandler);
        this._activeTransitionHandler = null;
      }
      
      if (!jumpExecuted) {
        logDebug("LOOP", "Executing seamless jump via timeout fallback");
        executeJump();
      }
    }, totalWaitTime);
  }

  /**
   * Cancels any pending seamless jump
   * @private
   */
  _cancelPendingSeamlessJump() {
    if (this._pendingSeamlessJump) {
      clearTimeout(this._pendingSeamlessJump);
      this._pendingSeamlessJump = null;
      
      // Clear the flag if we're cancelling a pending jump
      if (this.card._performingSeamlessJump) {
        logDebug("LOOP", "Clearing seamless jump flag during cancellation");
        this.card._performingSeamlessJump = false;
      }
      
      // Clean up any active transition handler
      if (this._activeTransitionHandler && this.card.sliderElement) {
        this.card.sliderElement.removeEventListener('transitionend', this._activeTransitionHandler);
        this._activeTransitionHandler = null;
      }
      
      logDebug("LOOP", "Cancelled pending seamless jump and cleaned up event listeners");
    }
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
  handleSwipeNavigation(currentIndex, skipCount) {
    const mode = this.getMode();
    const totalVisibleCards = this.card.visibleCardIndices.length;
    let nextIndex = currentIndex;

    if (skipCount > 0) {
      // Swiping right/down - go to previous visible cards
      nextIndex = currentIndex - Math.abs(skipCount);
      
      if (nextIndex < 0) {
        if (mode !== "none" && totalVisibleCards > 1) {
          if (mode === "infinite") {
            // For infinite mode, allow negative indices (handled by seamless jump)
            // nextIndex stays negative
          } else {
            // Loopback mode - wrap around
            nextIndex = totalVisibleCards + nextIndex; // nextIndex is negative, so this subtracts
            if (nextIndex < 0) nextIndex = totalVisibleCards - 1; // Safety fallback
          }
        } else {
          // No looping - clamp to first card
          nextIndex = 0;
        }
      }
    } else if (skipCount < 0) {
      // Swiping left/up - go to next visible cards
      nextIndex = currentIndex + Math.abs(skipCount);
      
      if (nextIndex >= totalVisibleCards) {
        if (mode !== "none" && totalVisibleCards > 1) {
          if (mode === "infinite") {
            // For infinite mode, allow going beyond bounds
            // nextIndex stays >= totalVisibleCards
          } else {
            // Loopback mode - wrap around
            nextIndex = nextIndex - totalVisibleCards; // Wrap to beginning
            if (nextIndex >= totalVisibleCards) nextIndex = 0; // Safety fallback
          }
        } else {
          // No looping - clamp to last card
          nextIndex = totalVisibleCards - 1;
        }
      }
    }

    logDebug("LOOP", "Swipe navigation:", {
      currentIndex,
      skipCount,
      mode,
      totalVisibleCards,
      nextIndex,
    });

    return nextIndex;
  }
}
