/**
 * Auto-swipe functionality for Simple Swipe Card
 */

import { logDebug } from "../utils/Debug.js";

/**
 * Auto-swipe manager class
 */
export class AutoSwipe {
  constructor(cardInstance) {
    this.card = cardInstance;

    // Auto-swipe state management
    this._autoSwipeTimer = null;
    this._autoSwipePaused = false;
    this._autoSwipePauseTimer = null;
    this._autoSwipeInProgress = false; // Flag to track if auto-swipe is in progress
    this._autoSwipeDirection = 1; // 1 for forward, -1 for backward
    this._lastLogTime = 0; // For throttling debug logs

    // Bind event handlers for proper cleanup
    this._boundAutoSwipe = this._performAutoSwipe.bind(this);
  }

  /**
   * Manages the auto-swipe functionality based on configuration
   */
  manage() {
    if (!this.card.initialized || !this.card.isConnected) return;

    // Stop any existing auto-swipe
    this.stop();

    // If auto-swipe is enabled and we have multiple visible cards, start it
    if (
      this.card._config.enable_auto_swipe &&
      this.card.visibleCardIndices.length > 1
    ) {
      logDebug(
        "AUTO",
        "Starting auto-swipe with interval:",
        this.card._config.auto_swipe_interval,
      );
      this.start();
    }
  }

  /**
   * Starts the auto-swipe timer
   */
  start() {
    if (this._autoSwipeTimer) this.stop();

    this._autoSwipeDirection = 1; // Reset direction to forward when starting/restarting
    this._autoSwipePaused = false; // Ensure we're not paused

    this._autoSwipeTimer = setInterval(
      this._boundAutoSwipe,
      this.card._config.auto_swipe_interval,
    );

    // Only log start message, not repeated interval logs
    logDebug(
      "AUTO",
      "Auto-swipe timer started with interval:",
      this.card._config.auto_swipe_interval,
    );
  }

  /**
   * Stops the auto-swipe timer
   */
  stop() {
    if (this._autoSwipeTimer) {
      clearInterval(this._autoSwipeTimer);
      this._autoSwipeTimer = null;
      logDebug("AUTO", "Auto-swipe timer stopped");
    }

    // Clear any pause timer as well
    if (this._autoSwipePauseTimer) {
      clearTimeout(this._autoSwipePauseTimer);
      this._autoSwipePauseTimer = null;
    }
  }

  /**
   * Pauses the auto-swipe for a specified duration
   * @param {number} duration - Duration to pause in milliseconds
   */
  pause(duration = 5000) {
    if (!this.card._config.enable_auto_swipe) return;

    logDebug("AUTO", `Auto-swipe paused for ${duration}ms`);

    // Set the pause flag
    this._autoSwipePaused = true;

    // Clear any existing pause timer
    if (this._autoSwipePauseTimer) {
      clearTimeout(this._autoSwipePauseTimer);
    }

    // Set a timer to unpause
    this._autoSwipePauseTimer = setTimeout(() => {
      this._autoSwipePaused = false;
      logDebug("AUTO", "Auto-swipe pause ended");

      // Restart auto-swipe if still connected and enabled
      if (this.card.isConnected && this.card._config.enable_auto_swipe) {
        this.start();
      }
    }, duration);
  }

  /**
   * Performs a single auto-swipe operation
   * @private
   */
  _performAutoSwipe() {
    const totalVisibleCards = this.card.visibleCardIndices.length;

    if (
      !this.card.isConnected ||
      !this.card.initialized ||
      totalVisibleCards <= 1
    ) {
      if (this._autoSwipeTimer) {
        logDebug(
          "AUTO",
          "Stopping auto-swipe, conditions not met or insufficient visible cards.",
        );
        this.stop();
      }
      return;
    }

    // Skip if currently dragging
    if (this.card.swipeGestures?._isDragging) {
      // Only log occasionally to avoid spam
      const now = Date.now();
      if (now - this._lastLogTime > 5000) {
        // Log at most every 5 seconds
        logDebug("AUTO", "Skipping auto-swipe: currently dragging");
        this._lastLogTime = now;
      }
      return;
    }

    // Throttle logging - only log every 10 seconds or on direction change
    const now = Date.now();
    let shouldLog = now - this._lastLogTime > 10000; // 10 seconds

    let nextIndex;

    if (this.card._config.enable_loopback) {
      nextIndex = this.card.currentIndex + 1;
      if (nextIndex >= totalVisibleCards) {
        nextIndex = 0;
        shouldLog = true; // Always log when looping back
      }
    } else {
      // Ping-pong logic for non-loopback
      if (this._autoSwipeDirection === 1) {
        // Moving forward
        if (this.card.currentIndex >= totalVisibleCards - 1) {
          // At the last visible card
          this._autoSwipeDirection = -1; // Change direction to backward
          nextIndex = this.card.currentIndex - 1;
          shouldLog = true; // Always log direction changes
        } else {
          nextIndex = this.card.currentIndex + 1;
        }
      } else {
        // Moving backward (this._autoSwipeDirection === -1)
        if (this.card.currentIndex <= 0) {
          // At the first visible card
          this._autoSwipeDirection = 1; // Change direction to forward
          nextIndex = this.card.currentIndex + 1;
          shouldLog = true; // Always log direction changes
        } else {
          nextIndex = this.card.currentIndex - 1;
        }
      }
      nextIndex = Math.max(0, Math.min(nextIndex, totalVisibleCards - 1));
    }

    // Only log occasionally or on important events
    if (shouldLog) {
      logDebug(
        "AUTO",
        `Auto-swipe: ${this.card.currentIndex} → ${nextIndex} (${this._autoSwipeDirection > 0 ? "forward" : "backward"})`,
      );
      this._lastLogTime = now;
    }

    this._autoSwipeInProgress = true;
    this.card.goToSlide(nextIndex);
    this._autoSwipeInProgress = false;
  }

  /**
   * Gets whether auto-swipe is currently in progress
   * @returns {boolean} True if auto-swipe is currently executing
   */
  get isInProgress() {
    return this._autoSwipeInProgress;
  }
}
