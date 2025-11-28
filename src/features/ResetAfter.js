/**
 * Reset-after timeout functionality for Simple Swipe Card
 */

import { logDebug } from "../utils/Debug.js";

/**
 * Reset-after manager class
 */
export class ResetAfter {
  constructor(cardInstance) {
    this.card = cardInstance;

    // Reset-after state management with preservation
    this._resetAfterTimer = null;
    this._lastUserInteraction = 0;
    this._isResettingAfterTimeout = false; // Flag to distinguish auto-reset from user action
    this._resetAfterPreservedState = null; // Preserve timer state during rebuilds

    // Bind event handlers for proper cleanup
    this._boundPerformResetAfter = this._performResetAfter.bind(this);
  }

  /**
   * Manages the reset-after functionality based on configuration
   */
  manage() {
    if (!this.card.initialized || !this.card.isConnected) return;

    // Stop any existing reset-after timer
    this.stopTimer();

    // Only enable reset-after if it's configured AND auto-swipe is disabled
    if (
      this.card._config.enable_reset_after &&
      !this.card._config.enable_auto_swipe &&
      this.card.visibleCardIndices.length > 1
    ) {
      logDebug(
        "RESET",
        "Reset-after feature enabled with timeout:",
        this.card._config.reset_after_timeout,
      );
      // Timer will be started after next user interaction
    } else {
      logDebug("RESET", "Reset-after feature disabled", {
        enabled: this.card._config.enable_reset_after,
        autoSwipeDisabled: !this.card._config.enable_auto_swipe,
        multipleCards: this.card.visibleCardIndices.length > 1,
      });
    }
  }

  /**
   * Starts the reset-after timer
   */
  startTimer() {
    // Only start if enabled, auto-swipe is off, and we have multiple visible cards
    if (
      !this.card._config.enable_reset_after ||
      this.card._config.enable_auto_swipe ||
      this.card.visibleCardIndices.length <= 1 ||
      !this.card.initialized ||
      !this.card.isConnected
    ) {
      return;
    }

    this.stopTimer();
    this._lastUserInteraction = Date.now();

    logDebug(
      "RESET",
      `Starting reset-after timer: ${this.card._config.reset_after_timeout}ms`,
    );

    this._resetAfterTimer = setTimeout(
      this._boundPerformResetAfter,
      this.card._config.reset_after_timeout,
    );
  }

  /**
   * Stops the reset-after timer
   */
  stopTimer() {
    if (this._resetAfterTimer) {
      clearTimeout(this._resetAfterTimer);
      this._resetAfterTimer = null;
      logDebug("RESET", "Reset-after timer stopped");
    }
  }

  /**
   * Preserves reset-after timer state before rebuild
   */
  preserveState() {
    if (
      !this.card._config.enable_reset_after ||
      this.card._config.enable_auto_swipe
    ) {
      this._resetAfterPreservedState = null;
      return;
    }

    // Only preserve if timer was actually running
    if (this._resetAfterTimer) {
      const remainingTime =
        this.card._config.reset_after_timeout -
        (Date.now() - this._lastUserInteraction);

      if (remainingTime > 1000) {
        // Only preserve if more than 1 second left
        this._resetAfterPreservedState = {
          remainingTime: Math.max(1000, remainingTime), // Minimum 1 second
          targetCard: this.card._config.reset_target_card,
          wasActive: true,
        };
        logDebug(
          "RESET",
          "Preserved reset-after state:",
          this._resetAfterPreservedState,
        );
      } else {
        this._resetAfterPreservedState = null;
      }
    } else {
      this._resetAfterPreservedState = null;
    }
  }

  /**
   * Restores reset-after timer state after rebuild
   */
  restoreState() {
    if (
      !this._resetAfterPreservedState ||
      !this.card._config.enable_reset_after ||
      this.card._config.enable_auto_swipe
    ) {
      this._resetAfterPreservedState = null;
      return;
    }

    // Restore timer with remaining time
    if (
      this._resetAfterPreservedState.wasActive &&
      this.card.visibleCardIndices.length > 1
    ) {
      logDebug(
        "RESET",
        "Restoring reset-after timer with remaining time:",
        this._resetAfterPreservedState.remainingTime,
      );

      this._lastUserInteraction =
        Date.now() -
        (this.card._config.reset_after_timeout -
          this._resetAfterPreservedState.remainingTime);

      this._resetAfterTimer = setTimeout(
        this._boundPerformResetAfter,
        this._resetAfterPreservedState.remainingTime,
      );
    }

    this._resetAfterPreservedState = null;
  }

  /**
   * Performs the reset after timeout (improved version)
   * @private
   */
  _performResetAfter() {
    const totalVisibleCards = this.card.visibleCardIndices.length;

    if (
      !this.card.isConnected ||
      !this.card.initialized ||
      totalVisibleCards <= 1
    ) {
      logDebug("RESET", "Reset-after skipped: conditions not met");
      return;
    }

    // Get evaluated target card (supports templates)
    const evaluatedTargetCard = this.card.getEvaluatedConfigValue(
      "reset_target_card",
      1,
    );

    // Determine target card index (convert from 1-based YAML to 0-based internal)
    let targetIndex = (parseInt(evaluatedTargetCard) || 1) - 1;

    logDebug(
      "RESET",
      `Reset target card: configured=${this.card._config.reset_target_card}, evaluated=${evaluatedTargetCard}, index=${targetIndex}`,
    );

    // Convert from original card index to visible card index
    const targetOriginalIndex = targetIndex;
    const targetVisibleIndex =
      this.card.visibleCardIndices.indexOf(targetOriginalIndex);

    if (targetVisibleIndex !== -1) {
      targetIndex = targetVisibleIndex;
      logDebug(
        "RESET",
        `Target card ${evaluatedTargetCard} is visible at position ${targetIndex}`,
      );
    } else {
      // Target card is not visible, find the closest visible card
      // Look for the next visible card after the target
      let closestVisibleIndex = 0;
      for (let i = 0; i < this.card.visibleCardIndices.length; i++) {
        if (this.card.visibleCardIndices[i] >= targetOriginalIndex) {
          closestVisibleIndex = i;
          break;
        }
      }
      targetIndex = closestVisibleIndex;
      logDebug(
        "RESET",
        `Target card ${evaluatedTargetCard} not visible, using closest visible card at position ${targetIndex}`,
      );
    }

    // Ensure target is within visible cards range
    if (targetIndex >= totalVisibleCards) {
      targetIndex = 0; // Default to first visible card
      logDebug("RESET", `Target index out of range, using first visible card`);
    }

    // Only reset if we're not already at the target
    if (this.card.currentIndex !== targetIndex) {
      logDebug(
        "RESET",
        `Performing reset: current=${this.card.currentIndex}, target=${targetIndex}, timeout=${this.card._config.reset_after_timeout}ms`,
      );

      this._isResettingAfterTimeout = true;
      this.card.goToSlide(targetIndex);
      this._isResettingAfterTimeout = false;
    } else {
      logDebug("RESET", "Reset-after skipped: already at target card");
    }
  }

  /**
   * Gets whether reset-after is currently executing
   * @returns {boolean} True if reset-after is currently executing
   */
  get isInProgress() {
    return this._isResettingAfterTimeout;
  }
}
