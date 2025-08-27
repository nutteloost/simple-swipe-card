/**
 * Pagination dots management for Simple Swipe Card
 */

import { logDebug } from "../utils/Debug.js";

/**
 * Pagination manager class
 */
export class Pagination {
  constructor(cardInstance) {
    this.card = cardInstance;
    this.paginationElement = null;
    this._autoHideTimer = null;
    this._isAutoHideEnabled = false;
    this._isPaginationVisible = true;
  }

  /**
   * Creates the pagination dots
   */
  create() {
    this.remove();
    const showPagination = this.card._config.show_pagination !== false;

    if (showPagination && this.card.visibleCardIndices.length > 1) {
      logDebug(
        "INIT",
        "Creating pagination for",
        this.card.visibleCardIndices.length,
        "visible cards",
      );

      // Check shadowRoot exists before creating pagination
      if (!this.card.shadowRoot) {
        logDebug("ERROR", "Cannot create pagination without shadowRoot");
        return;
      }

      this.paginationElement = document.createElement("div");
      this.paginationElement.className = `pagination ${this.card._swipeDirection}`;

      // Calculate and set fixed container dimensions based on configured dot sizes
      this._setFixedPaginationDimensions();

      const hasStateSync = this.card._config.state_entity && this.card._hass;

      // Use visible cards count for pagination
      for (let i = 0; i < this.card.visibleCardIndices.length; i++) {
        const dot = document.createElement("div");
        dot.className = "pagination-dot";

        // If state sync is enabled, don't set any initial active state
        // This prevents the jump from wrong position to correct position
        if (!hasStateSync && i === this._getCurrentDotIndex()) {
          dot.classList.add("active");
        }

        dot.addEventListener("click", (e) => {
          e.stopPropagation();
          this.card.goToSlide(i);

          this.showPagination(); // Show immediately
          this.startAutoHideTimer(); // Start timer for auto-hide
        });
        this.paginationElement.appendChild(dot);
      }

      // CRITICAL FIX: Double-check shadowRoot before appendChild
      if (this.card.shadowRoot) {
        this.card.shadowRoot.appendChild(this.paginationElement);
      } else {
        logDebug("ERROR", "shadowRoot became null while creating pagination");
        return;
      }

      if (this.card._cardModConfig) {
        this.card._applyCardModStyles();
      }

      // If state sync is enabled, the pagination will be updated when state sync runs in finishBuildLayout
      // This happens automatically through the normal flow without setTimeout
    }

    this._initializeAutoHide();
  }

  /**
   * Sets fixed pagination container dimensions to prevent layout shifts during animations
   * @private
   */
  _setFixedPaginationDimensions() {
    if (!this.paginationElement) return;

    // Wait for next frame to ensure styles are applied
    requestAnimationFrame(() => {
      // Read CSS custom properties from multiple potential sources
      const hostElement = this.card.shadowRoot?.host || this.card;
      const paginationStyle = getComputedStyle(this.paginationElement);
      const hostStyle = getComputedStyle(hostElement);

      // Helper function to parse CSS values
      const parseCSSValue = (value) => {
        if (!value || value === "") return null;
        const trimmed = value.trim();
        const parsed = parseInt(trimmed.replace(/px|rem|em/, ""));
        return isNaN(parsed) ? null : parsed;
      };

      // Try to read from pagination element first, then host
      const getCustomProperty = (property) => {
        return (
          parseCSSValue(paginationStyle.getPropertyValue(property)) ||
          parseCSSValue(hostStyle.getPropertyValue(property))
        );
      };

      // Read dot sizes with proper fallbacks
      const activeDotSize =
        getCustomProperty("--simple-swipe-card-pagination-dot-active-size") ||
        getCustomProperty("--simple-swipe-card-pagination-dot-size") ||
        8;
      const inactiveDotSize =
        getCustomProperty("--simple-swipe-card-pagination-dot-size") || 8;

      // Use the larger of the two sizes
      const maxDotSize = Math.max(activeDotSize, inactiveDotSize);

      // Read actual padding from CSS (default is "4px 8px")
      const paddingValue =
        paginationStyle
          .getPropertyValue("--simple-swipe-card-pagination-padding")
          .trim() || "4px 8px";
      const paddingParts = paddingValue.split(" ");
      const verticalPadding = parseCSSValue(paddingParts[0]) || 4;
      const totalVerticalPadding = verticalPadding * 2; // top + bottom

      const fixedDimension = maxDotSize + totalVerticalPadding;

      // Set FIXED dimensions based on direction
      if (this.card._swipeDirection === "horizontal") {
        this.paginationElement.style.height = `${fixedDimension}px`;
        this.paginationElement.style.minHeight = "unset";
      } else {
        const horizontalPadding =
          parseCSSValue(paddingParts[1] || paddingParts[0]) || 8;
        const totalHorizontalPadding = horizontalPadding * 2; // left + right
        const fixedWidth = maxDotSize + totalHorizontalPadding;
        this.paginationElement.style.width = `${fixedWidth}px`;
        this.paginationElement.style.minWidth = "unset";
      }

      logDebug("INIT", "Set FIXED pagination dimensions:", {
        activeDotSize,
        inactiveDotSize,
        maxDotSize,
        totalVerticalPadding,
        fixedDimension: `${fixedDimension}px`,
        direction: this.card._swipeDirection,
        paddingValue,
      });
    });
  }

  /**
   * Gets the current dot index that should be active
   * Handles all loop modes consistently
   * @returns {number} The dot index (0-based)
   * @private
   */
  _getCurrentDotIndex() {
    const totalVisibleCards = this.card.visibleCardIndices.length;
    if (totalVisibleCards === 0) return 0;

    if (this.card._config.loop_mode === "infinite") {
      // For infinite mode, wrap the current index to the visible range
      return (
        ((this.card.currentIndex % totalVisibleCards) + totalVisibleCards) %
        totalVisibleCards
      );
    } else {
      // For other modes, clamp to valid range
      return Math.max(
        0,
        Math.min(this.card.currentIndex, totalVisibleCards - 1),
      );
    }
  }

  /**
   * Updates pagination dots to reflect current state
   * @param {boolean} animate - Whether to animate the transition (defaults to true)
   */
  update(animate = true) {
    if (!this.paginationElement) return;

    const activeDotIndex = this._getCurrentDotIndex();
    const dots = this.paginationElement.querySelectorAll(".pagination-dot");

    // Temporarily disable transitions if not animating
    if (!animate) {
      dots.forEach((dot) => {
        dot.style.transition = "none";
      });
      // Force reflow to ensure transition: none takes effect
      this.paginationElement.offsetHeight;
    }

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === activeDotIndex);
    });

    // Restore transitions after a frame if we disabled them
    if (!animate) {
      requestAnimationFrame(() => {
        dots.forEach((dot) => {
          dot.style.transition = "";
        });
      });
    }

    logDebug(
      "PAGINATION",
      `Updated dots: active dot ${activeDotIndex}${animate ? " (animated)" : " (instant)"}`,
    );
  }

  /**
   * Updates pagination dots during swipe gesture
   * @param {number} virtualIndex - The virtual card index during swipe
   */
  updateDuringSwipe(virtualIndex) {
    if (!this.paginationElement) return;

    const totalVisibleCards = this.card.visibleCardIndices.length;
    if (totalVisibleCards === 0) return;

    // Calculate which dot should be active for this virtual position
    let activeDotIndex;
    if (this.card._config.loop_mode === "infinite") {
      activeDotIndex =
        ((virtualIndex % totalVisibleCards) + totalVisibleCards) %
        totalVisibleCards;
    } else {
      activeDotIndex = Math.max(
        0,
        Math.min(virtualIndex, totalVisibleCards - 1),
      );
    }

    const dots = this.paginationElement.querySelectorAll(".pagination-dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === activeDotIndex);
    });
  }

  /**
   * Updates pagination visibility and layout
   */
  updateLayout() {
    const showPagination = this.card._config.show_pagination !== false;

    // Update pagination visibility - use visible cards count
    if (showPagination && this.card.visibleCardIndices.length > 1) {
      if (!this.paginationElement) {
        this.create();
      } else {
        this.paginationElement.style.display = "flex";
      }
    } else if (this.paginationElement) {
      this.paginationElement.style.display = "none";
    }
  }

  /**
   * Removes the pagination element
   */
  remove() {
    this.cleanupAutoHide();

    if (this.paginationElement) {
      this.paginationElement.remove();
      this.paginationElement = null;
    }
  }

  /**
   * Initializes auto-hide functionality if enabled
   * Call this from the create() method
   * @private
   */
  _initializeAutoHide() {
    this._isAutoHideEnabled =
      this.card._config.show_pagination &&
      this.card._config.auto_hide_pagination > 0;

    if (this._isAutoHideEnabled) {
      logDebug(
        "PAGINATION",
        "Auto-hide enabled with timeout:",
        this.card._config.auto_hide_pagination,
      );
      this._isPaginationVisible = true;
      this._setupAutoHideCSS();
      this.startAutoHideTimer();
    }
  }

  /**
   * Sets up CSS for smooth transitions with backward compatibility
   * @private
   */
  _setupAutoHideCSS() {
    if (!this.paginationElement) return;

    // Get animation type to determine which approach to use
    const animationType =
      getComputedStyle(this.paginationElement)
        .getPropertyValue("--simple-swipe-card-pagination-animation-type")
        .trim()
        .replace(/['"]/g, "") || "fade";

    if (animationType === "fade") {
      // Use original container-based animation for 'fade' (default)
      this.paginationElement.style.transition =
        "opacity var(--simple-swipe-card-pagination-fade-duration, 600ms) var(--simple-swipe-card-pagination-animation-easing, ease-out)";
      this.paginationElement.style.opacity = "1";
    } else {
      // Use individual dot animation for advanced patterns
      const dots = this.paginationElement.querySelectorAll(".pagination-dot");
      const duration =
        getComputedStyle(this.paginationElement)
          .getPropertyValue("--simple-swipe-card-pagination-fade-duration")
          .trim() || "600ms";
      const easing =
        getComputedStyle(this.paginationElement)
          .getPropertyValue("--simple-swipe-card-pagination-animation-easing")
          .trim() || "ease-out";

      // Set up individual dot transitions
      dots.forEach((dot) => {
        dot.style.transition = `opacity ${duration} ${easing}`;
        dot.style.opacity = "1";
      });

      // Ensure container doesn't interfere
      this.paginationElement.style.transition = "none";
      this.paginationElement.style.opacity = "1";
    }
  }

  /**
   * Starts the auto-hide timer
   */
  startAutoHideTimer() {
    if (!this._isAutoHideEnabled || !this.paginationElement) return;

    // Clear any existing timer
    this.stopAutoHideTimer();

    const timeout = this.card._config.auto_hide_pagination;
    logDebug("PAGINATION", "Starting auto-hide timer:", timeout + "ms");

    this._autoHideTimer = setTimeout(() => {
      this.hidePagination();
      this._autoHideTimer = null;
    }, timeout);
  }

  /**
   * Stops the auto-hide timer
   */
  stopAutoHideTimer() {
    if (this._autoHideTimer) {
      clearTimeout(this._autoHideTimer);
      this._autoHideTimer = null;
      logDebug("PAGINATION", "Auto-hide timer stopped");
    }
  }

  /**
   * Hides pagination dots with configurable animation pattern
   */
  hidePagination() {
    if (!this._isAutoHideEnabled || !this.paginationElement) return;

    if (this._isPaginationVisible) {
      logDebug("PAGINATION", "Hiding pagination");

      const animationType =
        getComputedStyle(this.paginationElement)
          .getPropertyValue("--simple-swipe-card-pagination-animation-type")
          .trim()
          .replace(/['"]/g, "") || "fade";

      if (animationType === "fade") {
        // Use original container-based animation
        this.paginationElement.style.opacity = "0";
      } else {
        // Use advanced individual dot animation
        this._applyHideAnimation();
      }

      this._isPaginationVisible = false;
    }
  }

  /**
   * Shows pagination dots immediately
   */
  showPagination() {
    if (!this._isAutoHideEnabled || !this.paginationElement) return;

    if (!this._isPaginationVisible) {
      logDebug("PAGINATION", "Showing pagination");

      const animationType =
        getComputedStyle(this.paginationElement)
          .getPropertyValue("--simple-swipe-card-pagination-animation-type")
          .trim()
          .replace(/['"]/g, "") || "fade";

      if (animationType === "fade") {
        // Use original container-based animation
        this.paginationElement.style.opacity = "1";
      } else {
        // Use individual dot animation
        this._applyShowAnimation();
      }

      this._isPaginationVisible = true;
    }

    // Stop any existing timer - don't start new one yet
    this.stopAutoHideTimer();
  }

  /**
   * Applies the configured hide animation pattern (for non-fade animations)
   * @private
   */
  _applyHideAnimation() {
    const dots = this.paginationElement.querySelectorAll(".pagination-dot");
    const animationType =
      getComputedStyle(this.paginationElement)
        .getPropertyValue("--simple-swipe-card-pagination-animation-type")
        .trim()
        .replace(/['"]/g, "") || "fade";
    const baseDelay =
      parseFloat(
        getComputedStyle(this.paginationElement)
          .getPropertyValue("--simple-swipe-card-pagination-animation-delay")
          .trim()
          .replace("ms", ""),
      ) || 50;

    const delays = this._calculateAnimationDelays(
      dots.length,
      animationType,
      baseDelay,
    );

    dots.forEach((dot, index) => {
      setTimeout(() => {
        dot.style.opacity = "0";
      }, delays[index]);
    });
  }

  /**
   * Applies the show animation (reverse of hide animation for non-fade animations)
   * @private
   */
  _applyShowAnimation() {
    const dots = this.paginationElement.querySelectorAll(".pagination-dot");
    const animationType =
      getComputedStyle(this.paginationElement)
        .getPropertyValue("--simple-swipe-card-pagination-animation-type")
        .trim()
        .replace(/['"]/g, "") || "fade";
    const baseDelay =
      parseFloat(
        getComputedStyle(this.paginationElement)
          .getPropertyValue("--simple-swipe-card-pagination-animation-delay")
          .trim()
          .replace("ms", ""),
      ) || 50;

    // Get the reverse animation pattern
    const reverseAnimationType = this._getReverseAnimationType(animationType);
    const delays = this._calculateAnimationDelays(
      dots.length,
      reverseAnimationType,
      baseDelay,
    );

    // Start with all dots hidden
    dots.forEach((dot) => {
      dot.style.opacity = "0";
    });

    // Show dots with staggered animation (reverse of hide)
    dots.forEach((dot, index) => {
      setTimeout(() => {
        dot.style.opacity = "1";
      }, delays[index]);
    });
  }

  /**
   * Calculates animation delays for different patterns
   * @param {number} totalDots - Total number of dots
   * @param {string} animationType - Animation pattern type
   * @param {number} baseDelay - Base delay between animations
   * @returns {number[]} Array of delays in milliseconds
   * @private
   */
  _calculateAnimationDelays(totalDots, animationType, baseDelay) {
    const delays = [];

    switch (animationType) {
      case "left-to-right":
        for (let i = 0; i < totalDots; i++) {
          delays[i] = i * baseDelay;
        }
        break;

      case "right-to-left":
        for (let i = 0; i < totalDots; i++) {
          delays[i] = (totalDots - 1 - i) * baseDelay;
        }
        break;

      case "center-out": {
        const center = Math.floor(totalDots / 2);
        for (let i = 0; i < totalDots; i++) {
          const distanceFromCenter = Math.abs(i - center);
          delays[i] = distanceFromCenter * baseDelay;
        }
        break;
      }

      case "edges-in":
        for (let i = 0; i < totalDots; i++) {
          const distanceFromEdge = Math.min(i, totalDots - 1 - i);
          delays[i] = distanceFromEdge * baseDelay;
        }
        break;

      case "random": {
        const randomOrder = Array.from({ length: totalDots }, (_, i) => i).sort(
          () => Math.random() - 0.5,
        );
        randomOrder.forEach((originalIndex, newIndex) => {
          delays[originalIndex] = newIndex * baseDelay;
        });
        break;
      }

      case "fade":
      default:
        // All dots fade simultaneously - but this shouldn't be called for 'fade'
        for (let i = 0; i < totalDots; i++) {
          delays[i] = 0;
        }
        break;
    }

    return delays;
  }

  /**
   * Gets the reverse animation type for show animations
   * @param {string} hideAnimationType - The hide animation type
   * @returns {string} The corresponding show animation type
   * @private
   */
  _getReverseAnimationType(hideAnimationType) {
    const reverseMap = {
      "left-to-right": "right-to-left",
      "right-to-left": "left-to-right",
      "center-out": "edges-in",
      "edges-in": "center-out",
      random: "random", // Random stays random
      fade: "fade",
    };

    return reverseMap[hideAnimationType] || "fade";
  }

  /**
   * Public method: Show pagination and start auto-hide timer
   * Call this after user interactions end
   */
  showAndStartTimer() {
    if (!this._isAutoHideEnabled) return;

    this.showPagination();
    this.startAutoHideTimer();
  }

  /**
   * Cleanup method for auto-hide timers
   */
  cleanupAutoHide() {
    this.stopAutoHideTimer();
  }
}
