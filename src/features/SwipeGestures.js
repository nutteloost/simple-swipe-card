/**
 * Swipe gesture handling for Simple Swipe Card
 */

import { logDebug } from "../utils/Debug.js";
import { SWIPE_CONSTANTS } from "../utils/Constants.js";

/**
 * Swipe gesture manager class
 */
export class SwipeGestures {
  constructor(cardInstance) {
    this.card = cardInstance;

    // Swipe state management
    this._isDragging = false;
    this._startX = 0;
    this._startY = 0;
    this._currentX = 0;
    this._currentY = 0;
    this._initialTransform = 0;
    this._lastMoveTime = 0;
    this._isScrolling = false;
    this._isGestureActive = false;
    this._gestureStartTime = 0;
    this._totalMovement = 0;
    this._hasMovedDuringGesture = false;
    this._gestureThreshold = SWIPE_CONSTANTS.gestureThreshold;
    this._clickBlockTimer = null;
    this._isClickBlocked = false;
    this._clickBlockDuration = SWIPE_CONSTANTS.clickBlockDuration;
    this._lastSwipeTime = 0;
    this._swipeVelocityThreshold = SWIPE_CONSTANTS.swipeVelocityThreshold;

    // Bind event handlers for proper cleanup
    this._boundHandleSwipeStart = this._handleSwipeStart.bind(this);
    this._boundHandleSwipeMove = this._handleSwipeMove.bind(this);
    this._boundHandleSwipeEnd = this._handleSwipeEnd.bind(this);
    this._boundMouseMove = this._handleSwipeMove.bind(this);
    this._boundMouseUp = this._handleSwipeEnd.bind(this);
    this._boundPreventClick = this._preventClick.bind(this);
    this._boundPreventPointerEvents = this._preventPointerEvents.bind(this);
  }

  /**
   * Remove all swipe gesture event listeners
   */
  removeGestures() {
    logDebug("SWIPE", "Removing swipe gesture listeners");
    if (this.card.cardContainer) {
      // Remove swipe gesture listeners
      this.card.cardContainer.removeEventListener(
        "touchstart",
        this._boundHandleSwipeStart,
        { passive: true },
      );
      this.card.cardContainer.removeEventListener(
        "touchmove",
        this._boundHandleSwipeMove,
        { passive: false },
      );
      this.card.cardContainer.removeEventListener(
        "touchend",
        this._boundHandleSwipeEnd,
        { passive: true },
      );
      this.card.cardContainer.removeEventListener(
        "touchcancel",
        this._boundHandleSwipeEnd,
        { passive: true },
      );
      this.card.cardContainer.removeEventListener(
        "mousedown",
        this._boundHandleSwipeStart,
        { passive: false },
      );
      this.card.cardContainer.removeEventListener(
        "click",
        this._boundPreventClick,
        { capture: true },
      );
      this.card.cardContainer.removeEventListener(
        "pointerdown",
        this._boundPreventPointerEvents,
        { capture: true },
      );
      this.card.cardContainer.removeEventListener(
        "pointerup",
        this._boundPreventPointerEvents,
        { capture: true },
      );

      logDebug("SWIPE", "Removed swipe listeners from cardContainer.");
    }

    // Clean up window listeners
    window.removeEventListener("mousemove", this._boundMouseMove, {
      passive: false,
    });
    window.removeEventListener("mouseup", this._boundMouseUp, {
      passive: true,
    });
    logDebug("SWIPE", "Removed potential swipe listeners from window.");

    // Reset state flags
    this._isDragging = false;
    this._isScrolling = false;

    // Clear click blocking timer
    if (this._clickBlockTimer) {
      clearTimeout(this._clickBlockTimer);
      this._clickBlockTimer = null;
      this._isClickBlocked = false;
    }
  }

  /**
   * Enhanced method to add swipe gesture listeners with click prevention
   */
  addGestures() {
    this.removeGestures();
    if (
      !this.card.cardContainer ||
      this.card.visibleCardIndices.length <= 1 ||
      !this.card.initialized
    ) {
      logDebug("SWIPE", "Skipping addSwiperGesture", {
        container: !!this.card.cardContainer,
        visibleCount: this.card.visibleCardIndices.length,
        init: this.card.initialized,
      });
      return;
    }
    logDebug("SWIPE", "Adding swipe listeners with click prevention.");

    // Add swipe gesture listeners
    this.card.cardContainer.addEventListener(
      "touchstart",
      this._boundHandleSwipeStart,
      { passive: true },
    );
    this.card.cardContainer.addEventListener(
      "touchmove",
      this._boundHandleSwipeMove,
      { passive: false },
    );
    this.card.cardContainer.addEventListener(
      "touchend",
      this._boundHandleSwipeEnd,
      { passive: true },
    );
    this.card.cardContainer.addEventListener(
      "touchcancel",
      this._boundHandleSwipeEnd,
      { passive: true },
    );
    this.card.cardContainer.addEventListener(
      "mousedown",
      this._boundHandleSwipeStart,
      { passive: false },
    );
    this.card.cardContainer.addEventListener("click", this._boundPreventClick, {
      capture: true,
      // Remove passive: false to match working version
    });
    this.card.cardContainer.addEventListener(
      "pointerdown",
      this._boundPreventPointerEvents,
      { capture: true },
    );
    this.card.cardContainer.addEventListener(
      "pointerup",
      this._boundPreventPointerEvents,
      { capture: true },
    );
  }

  /**
   * Prevents click events during and after swipe gestures
   * @param {Event} e - Click event to potentially prevent
   * @private
   */
  _preventClick(e) {
    if (this._isClickBlocked || this._isDragging) {
      logDebug("SWIPE", "Click prevented during/after swipe gesture");
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  }

  /**
   * Prevents pointer events during swipe gestures
   * @param {Event} e - Pointer event to potentially prevent
   * @private
   */
  _preventPointerEvents(e) {
    if (this._isDragging && this._hasMovedDuringGesture) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  /**
   * Blocks clicks for a specified duration
   * @param {number} duration - Duration to block clicks in milliseconds
   * @private
   */
  _blockClicksTemporarily(duration = this._clickBlockDuration) {
    this._isClickBlocked = true;
    this._lastSwipeTime = Date.now();

    if (this._clickBlockTimer) {
      clearTimeout(this._clickBlockTimer);
    }

    this._clickBlockTimer = setTimeout(() => {
      this._isClickBlocked = false;
      this._clickBlockTimer = null;
      logDebug("SWIPE", "Click blocking period ended");
    }, duration);

    logDebug("SWIPE", `Blocking clicks for ${duration}ms`);
  }

  /**
   * Enhanced swipe start handler - simplified
   * @param {Event} e - Touch or mouse event
   * @private
   */
  _handleSwipeStart(e) {
    logDebug("SWIPE", "Swipe Start:", e.type);

    if (this._isDragging || (e.type === "mousedown" && e.button !== 0)) {
      logDebug(
        "SWIPE",
        "Swipe Start ignored (already dragging or wrong button)",
      );
      return;
    }

    if (this._isInteractiveOrScrollable(e.target)) {
      logDebug("SWIPE", "Swipe Start ignored (interactive element):", e.target);
      return;
    }

    // Reset gesture state
    this._isDragging = true;
    this._isScrolling = false;
    this._hasMovedDuringGesture = false;
    this._totalMovement = 0;
    this._gestureStartTime = Date.now();
    this._isGestureActive = true; // Mark gesture as active

    const isTouch = e.type === "touchstart";
    const point = isTouch ? e.touches[0] : e;
    this._startX = point.clientX;
    this._startY = point.clientY;
    this._currentX = this._startX;
    this._currentY = this._startY;
    this._lastMoveTime = this._gestureStartTime;

    if (this.card.sliderElement) {
      const style = window.getComputedStyle(this.card.sliderElement);
      const matrix = new DOMMatrixReadOnly(style.transform);
      this._initialTransform = matrix.m41; // For horizontal, we track X transform
      if (this.card._swipeDirection === "vertical") {
        this._initialTransform = matrix.m42; // For vertical, we track Y transform
      }
      this.card.sliderElement.style.transition =
        this.card._getTransitionStyle(false);
      this.card.sliderElement.style.cursor = "grabbing";
    }

    if (e.type === "mousedown") {
      logDebug("SWIPE", "Attaching mousemove/mouseup listeners to window");
      e.preventDefault();
      window.addEventListener("mousemove", this._boundMouseMove, {
        passive: false,
      });
      window.addEventListener("mouseup", this._boundMouseUp, { passive: true });
    }

    // Pause auto-swipe when user interaction begins
    if (this.card._config.enable_auto_swipe) {
      this.card.autoSwipe?.pause(5000);
    }
  }

  /**
   * Enhanced swipe move handler - simplified
   * @param {Event} e - Touch or mouse event
   * @private
   */
  _handleSwipeMove(e) {
    if (!this._isDragging) return;

    const isTouch = e.type === "touchmove";
    const point = isTouch ? e.touches[0] : e;
    const clientX = point.clientX;
    const clientY = point.clientY;

    const deltaX = clientX - this._startX;
    const deltaY = clientY - this._startY;
    const currentTime = Date.now();

    // Calculate total movement distance
    const movementDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    this._totalMovement = Math.max(this._totalMovement, movementDistance);

    // Determine if this is a horizontal or vertical swipe based on configuration
    const isHorizontal = this.card._swipeDirection === "horizontal";

    // Calculate the primary and secondary deltas based on swipe direction
    const primaryDelta = isHorizontal ? deltaX : deltaY;
    const secondaryDelta = isHorizontal ? deltaY : deltaX;

    // Check for scrolling in the perpendicular direction
    if (
      !this._isScrolling &&
      Math.abs(secondaryDelta) > Math.abs(primaryDelta) &&
      Math.abs(secondaryDelta) > 10
    ) {
      logDebug(
        "SWIPE",
        `${isHorizontal ? "Vertical" : "Horizontal"} scroll detected, cancelling ${isHorizontal ? "horizontal" : "vertical"} drag.`,
      );
      this._isScrolling = true;
      this._isGestureActive = false; // Not a swipe gesture
    }

    // Mark that we've moved during this gesture if movement exceeds threshold
    if (movementDistance > this._gestureThreshold) {
      this._hasMovedDuringGesture = true;
    }

    // Process movement in the primary direction
    if (!this._isScrolling && Math.abs(primaryDelta) > this._gestureThreshold) {
      logDebug(
        "SWIPE",
        `${isHorizontal ? "Horizontal" : "Vertical"} move detected`,
      );

      // Update current position based on swipe direction
      if (isHorizontal) {
        this._currentX = clientX;
      } else {
        this._currentY = clientY;
      }

      let dragAmount = primaryDelta;

      // Apply resistance at edges (only if loopback mode is not enabled)
      const loopbackEnabled = this.card._config.enable_loopback === true;
      if (!loopbackEnabled) {
        const atFirstEdge = this.card.currentIndex === 0;
        const atLastEdge =
          this.card.currentIndex === this.card.visibleCardIndices.length - 1;
        if ((atFirstEdge && dragAmount > 0) || (atLastEdge && dragAmount < 0)) {
          const resistanceFactor =
            0.3 +
            0.7 /
              (1 +
                (Math.abs(dragAmount) /
                  (isHorizontal
                    ? this.card.slideWidth
                    : this.card.slideHeight)) *
                  0.5);
          dragAmount *= resistanceFactor * 0.5;
        }
      }

      const newTransform = this._initialTransform + dragAmount;

      if (this.card.sliderElement) {
        // Apply transform based on swipe direction
        if (isHorizontal) {
          this.card.sliderElement.style.transform = `translateX(${newTransform}px)`;
        } else {
          this.card.sliderElement.style.transform = `translateY(${newTransform}px)`;
        }
      }
      this._lastMoveTime = currentTime;
    }
  }

  /**
   * Enhanced swipe end handler with restored click prevention
   * @param {Event} e - Touch or mouse event
   * @private
   */
  _handleSwipeEnd(e) {
    logDebug("SWIPE", "Swipe End:", e.type);
    if (!this._isDragging) {
      logDebug("SWIPE", "Swipe End ignored (not dragging)");
      return;
    }

    // Cleanup listeners
    if (e.type === "mouseup") {
      logDebug("SWIPE", "Removing mousemove/mouseup listeners from window");
      window.removeEventListener("mousemove", this._boundMouseMove);
      window.removeEventListener("mouseup", this._boundMouseUp);
    }

    const hasSignificantMovement =
      this._hasMovedDuringGesture &&
      this._totalMovement > this._gestureThreshold;
    const gestureTime = Date.now() - this._gestureStartTime;
    const isQuickGesture = gestureTime < 200;

    // Calculate velocity (use consistent logic)
    const isHorizontal = this.card._swipeDirection === "horizontal";
    const totalMove = isHorizontal
      ? this._currentX - this._startX
      : this._currentY - this._startY;
    const timeDiff = Date.now() - this._lastMoveTime;
    const velocity = timeDiff > 10 ? Math.abs(totalMove) / timeDiff : 0;
    const hasHighVelocity = velocity > this._swipeVelocityThreshold;

    const shouldPreventClicks =
      hasSignificantMovement || (isQuickGesture && hasHighVelocity);

    if (shouldPreventClicks) {
      // Temporal click blocking (main mechanism for all events)
      // No preventDefault() calls since both touch and mouse end events are passive
      this._blockClicksTemporarily(hasHighVelocity ? 400 : 300);
      logDebug("SWIPE", "Prevented clicks after swipe gesture", {
        movement: this._totalMovement,
        velocity: velocity,
        gestureTime: gestureTime,
        eventType: e.type,
      });
    }

    // Reset gesture state
    this._isGestureActive = false;

    // Process swipe logic
    Promise.resolve().then(() => {
      if (!this.card.sliderElement) return;

      const wasDragging = this._isDragging;
      this._isDragging = false;

      this.card.sliderElement.style.transition =
        this.card._getTransitionStyle(true);
      this.card.sliderElement.style.cursor = "";

      if (!wasDragging) {
        logDebug("SWIPE", "Swipe End: Not dragging or already processed.");
        return;
      }

      if (this._isScrolling || e.type === "touchcancel") {
        logDebug("SWIPE", "Swipe End: Scrolling or Cancelled - Snapping back.");
        this.card.updateSlider();
        this._isScrolling = false;
        return;
      }

      // Calculate velocity and movement for swipe logic (reuse variables for consistency)
      const timeDiffForSwipe = Date.now() - this._lastMoveTime;
      const velocityForSwipe =
        timeDiffForSwipe > 10 ? Math.abs(totalMove) / timeDiffForSwipe : 0;

      // Use the appropriate dimension for threshold calculation
      const slideSize = isHorizontal
        ? this.card.slideWidth
        : this.card.slideHeight;

      // For carousel mode, use single card width instead of full slide width
      const viewMode = this.card._config.view_mode || "single";
      let threshold;

      if (viewMode === "carousel") {
        // In carousel mode, use card width for threshold
        const cardsVisible = this.card._config.cards_visible || 2.5;
        const cardSpacing =
          Math.max(0, parseInt(this.card._config.card_spacing)) || 0;
        const totalSpacing = (cardsVisible - 1) * cardSpacing;
        const cardWidth = (this.card.slideWidth - totalSpacing) / cardsVisible;
        threshold = cardWidth * 0.2; // 20% of card width
      } else {
        threshold = slideSize * 0.2; // Use original logic for single mode
      }

      let nextIndex = this.card.currentIndex;
      const loopMode = this.card._config.loop_mode || "none";
      const totalVisibleCards = this.card.visibleCardIndices.length;

      // Use consistent velocity threshold
      if (
        Math.abs(totalMove) > threshold ||
        Math.abs(velocityForSwipe) > this._swipeVelocityThreshold
      ) {
        logDebug("SWIPE", `Swipe threshold crossed:`, {
          totalMove: totalMove,
          threshold: threshold,
          velocity: velocityForSwipe,
          velocityThreshold: this._swipeVelocityThreshold,
          currentIndex: this.card.currentIndex,
          totalVisibleCards: totalVisibleCards,
          loopMode: loopMode,
        });

        if (
          Math.abs(totalMove) > threshold ||
          Math.abs(velocityForSwipe) > this._swipeVelocityThreshold
        ) {
          nextIndex = this.card.loopMode.handleSwipeNavigation(
            this.card.currentIndex,
            totalMove,
          );

          logDebug(
            "SWIPE",
            `Swipe resulted in navigation: ${this.card.currentIndex} → ${nextIndex} (${this.card.loopMode.getMode()} mode)`,
          );
        }
      } else {
        logDebug("SWIPE", `Swipe threshold NOT crossed:`, {
          totalMove: totalMove,
          threshold: threshold,
          velocity: velocityForSwipe,
          velocityThreshold: this._swipeVelocityThreshold,
          viewMode: viewMode,
        });
      }

      if (nextIndex !== this.card.currentIndex) {
        logDebug("SWIPE", `Swipe resulted in index change to ${nextIndex}`);
        this.card.goToSlide(nextIndex);
        // Start reset-after timer for manual swipe interactions
        setTimeout(() => {
          if (this.card.isConnected && !this.card._autoSwipeInProgress) {
            this.card.resetAfter?.startTimer();
          }
        }, 100);
      } else {
        logDebug(
          "SWIPE",
          "Swipe did not cross threshold or velocity, snapping back.",
        );
        this.card.updateSlider();
      }
    });
  }

  /**
   * Checks if an element is interactive or scrollable
   * @param {Element} element - The element to check
   * @returns {boolean} True if the element is interactive or scrollable
   * @private
   */
  _isInteractiveOrScrollable(element) {
    if (
      !element ||
      element === this.card.cardContainer ||
      element === this.card.sliderElement
    )
      return false;

    // Expanded list of interactive elements
    const interactiveTags = [
      "input",
      "textarea",
      "select",
      "button",
      "a",
      "audio",
      "video",
      "ha-switch",
      "ha-checkbox",
      "mwc-checkbox",
      "paper-checkbox",
      "ha-textfield",
      "ha-slider",
      "paper-slider",
      "ha-control-button",
      "ha-control-select",
      "ha-control-slider",
      "ha-control-button-group",
      "ha-text-input",
      "mwc-button",
      "paper-button",
      "ha-icon-button",
      "paper-icon-button",
      "ha-select",
      "paper-dropdown-menu",
      "vaadin-combo-box",
      "ha-card",
      "hui-entity-button",
      "more-info-content",
    ];

    const tagName = element.localName?.toLowerCase();
    const role = element.getAttribute("role");

    // Check basic interactive elements
    if (
      interactiveTags.includes(tagName) ||
      (role &&
        [
          "button",
          "checkbox",
          "switch",
          "slider",
          "link",
          "menuitem",
          "textbox",
          "combobox",
          "option",
        ].includes(role))
    ) {
      logDebug(
        "SWIPE",
        "_isInteractiveOrScrollable: Found interactive tag/role:",
        tagName || role,
      );
      return true;
    }

    // Check for clickable elements (elements that might open more-info dialogs)
    if (
      element.classList.contains("clickable") ||
      element.hasAttribute("clickable") ||
      element.getAttribute("data-domain") ||
      element.closest(".entity, .clickable, [data-domain]")
    ) {
      logDebug("SWIPE", "_isInteractiveOrScrollable: Found clickable element");
      return true;
    }

    // Check common HA interactive components
    if (
      element.closest(
        `
            ha-control-button, ha-control-select, ha-control-slider, ha-control-button-group, 
            ha-alert[action], ha-more-info-control, hui-buttons-base, ha-form, ha-formfield, 
            ha-icon-button, mwc-list-item, paper-item, ha-list-item, hui-entity-button,
            more-info-content, ha-card[clickable], .clickable
        `
          .replace(/\s+/g, " ")
          .trim(),
      )
    ) {
      logDebug(
        "SWIPE",
        "_isInteractiveOrScrollable: Found interactive ancestor component.",
      );
      return true;
    }

    // Check for scrollable overflow
    let current = element;
    let depth = 0;
    while (
      current &&
      current !== this.card.sliderElement &&
      current !== this.card.cardContainer &&
      depth < 10
    ) {
      if (current.nodeType === Node.ELEMENT_NODE) {
        try {
          const style = window.getComputedStyle(current);
          const hasVerticalScroll =
            (style.overflowY === "auto" || style.overflowY === "scroll") &&
            current.scrollHeight > current.clientHeight + 1;
          const hasHorizontalScroll =
            (style.overflowX === "auto" || style.overflowX === "scroll") &&
            current.scrollWidth > current.clientWidth + 1;

          if (hasVerticalScroll || hasHorizontalScroll) {
            logDebug(
              "SWIPE",
              "_isInteractiveOrScrollable: Found scrollable ancestor:",
              current,
            );
            return true;
          }

          // Check specific known-scrollable cards
          if (
            current.localName === "ha-logbook" ||
            current.localName === "hui-logbook-card" ||
            current.localName === "hui-history-graph-card"
          ) {
            logDebug(
              "SWIPE",
              "_isInteractiveOrScrollable: Found specific scrollable card type:",
              current.localName,
            );
            return true;
          }
        } catch (e) {
          logDebug(
            "ERROR",
            "Error accessing style/scroll properties for:",
            current,
            e,
          );
        }
      }

      // Traverse up
      current =
        current.assignedSlot ||
        current.parentNode ||
        (current.getRootNode() instanceof ShadowRoot
          ? current.getRootNode().host
          : null);
      depth++;
    }

    return false;
  }
}
