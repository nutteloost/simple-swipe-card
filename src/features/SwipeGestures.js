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

    this._setupAutoHideListeners();
  }

  /**
   * Prevents click events during and after swipe gestures
   * @param {Event} e - Click event to potentially prevent
   * @private
   */
  _preventClick(e) {
    // FIRST: Check if we're blocking clicks due to swipe - this takes priority over everything
    if (this._isClickBlocked || this._isDragging) {
      logDebug("SWIPE", "Click prevented during/after swipe gesture");
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }

    // SECOND: If not blocking, check if click is on or inside a button (check entire path)
    // This allows buttons to work normally when NOT swiping
    if (e.composedPath && typeof e.composedPath === "function") {
      const path = e.composedPath();

      const allowedClickElements = [
        "button",
        "ha-icon-button",
        "mwc-icon-button",
        "ha-button",
        "mwc-button",
        "paper-button",
        "a",
        "input",
        "select",
        "textarea",
      ];

      // Check first 10 elements in the path for buttons
      for (let i = 0; i < Math.min(10, path.length); i++) {
        const element = path[i];

        if (
          element === this.card.cardContainer ||
          element === this.card.sliderElement
        ) {
          break;
        }

        if (element.nodeType === Node.ELEMENT_NODE) {
          const tagName = element.localName?.toLowerCase();
          const role = element.getAttribute?.("role");

          if (allowedClickElements.includes(tagName) || role === "button") {
            logDebug(
              "SWIPE",
              "Allowing click - button found in path:",
              tagName || role,
            );
            return; // Let the click proceed normally
          }
        }
      }
    }
  }

  /**
   * Prevents pointer events during swipe gestures
   * @param {Event} e - Pointer event to potentially prevent
   * @private
   */
  _preventPointerEvents(e) {
    // FIRST: Check if we're blocking pointer events due to swipe - this takes priority
    if (this._isDragging && this._hasMovedDuringGesture) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // SECOND: If not blocking, check if pointer event is on or inside a button (check entire path)
    // This allows buttons to work normally when NOT swiping
    if (e.composedPath && typeof e.composedPath === "function") {
      const path = e.composedPath();

      const allowedPointerElements = [
        "button",
        "ha-icon-button",
        "mwc-icon-button",
        "ha-button",
        "mwc-button",
        "paper-button",
        "a",
        "input",
        "select",
        "textarea",
      ];

      // Check first 10 elements in the path for buttons
      for (let i = 0; i < Math.min(10, path.length); i++) {
        const element = path[i];

        if (
          element === this.card.cardContainer ||
          element === this.card.sliderElement
        ) {
          break;
        }

        if (element.nodeType === Node.ELEMENT_NODE) {
          const tagName = element.localName?.toLowerCase();
          const role = element.getAttribute?.("role");

          if (allowedPointerElements.includes(tagName) || role === "button") {
            logDebug(
              "SWIPE",
              "Allowing pointer event - button found in path:",
              tagName || role,
            );
            return; // Let the pointer event proceed normally
          }
        }
      }
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
   * Enhanced swipe start handler with Shadow DOM support
   * @param {Event} e - Touch or mouse event
   * @private
   */
  _handleSwipeStart(e) {
    logDebug("SWIPE", "Swipe Start:", e.type);

    this.card.pagination?.showPagination();

    if (this._isDragging || (e.type === "mousedown" && e.button !== 0)) {
      logDebug(
        "SWIPE",
        "Swipe Start ignored (already dragging or wrong button)",
      );
      return;
    }

    // MOBILE BUTTON FIX: Check the ENTIRE event path for interactive elements
    // This is critical for deeply nested shadow DOM elements like cover controls
    if (e.composedPath && typeof e.composedPath === "function") {
      const path = e.composedPath();

      // Check first 15 elements in the path (covers deep nesting)
      for (let i = 0; i < Math.min(15, path.length); i++) {
        const pathElement = path[i];

        // Stop if we reach our container
        if (
          pathElement === this.card.cardContainer ||
          pathElement === this.card.sliderElement
        ) {
          break;
        }

        // Check if this element in the path is interactive
        if (
          pathElement.nodeType === Node.ELEMENT_NODE &&
          this._isInteractiveOrScrollable(pathElement)
        ) {
          logDebug(
            "SWIPE",
            "Swipe Start ignored - found interactive element in path:",
            pathElement.localName,
          );
          return; // Don't start swipe on interactive elements
        }
      }
    } else {
      // Fallback for browsers without composedPath
      const actualTarget = this._getActualEventTarget(e);
      if (this._isInteractiveOrScrollable(actualTarget)) {
        logDebug(
          "SWIPE",
          "Swipe Start ignored (interactive element):",
          actualTarget,
        );
        return;
      }
    }

    // Reset gesture state
    this._isDragging = true;
    this._isScrolling = false;
    this._hasMovedDuringGesture = false;
    this._totalMovement = 0;
    this._gestureStartTime = Date.now();
    this._isGestureActive = true;

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
      this._initialTransform = matrix.m41;
      if (this.card._swipeDirection === "vertical") {
        this._initialTransform = matrix.m42;
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

      // Prevent default browser behavior for mouse events during valid swipe gestures**
      if (!isTouch) {
        e.preventDefault();
      }

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
        // Update pagination dots to match current transform position
        this._updatePaginationDuringSwipe(newTransform);
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

    // Debug: Check if seamless jump is blocking
    if (this.card._performingSeamlessJump) {
      logDebug(
        "SWIPE",
        "WARNING: Swipe end during seamless jump - this might indicate a stuck flag",
      );
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

      // Calculate velocity and movement for swipe logic
      const timeDiffForSwipe = Math.max(1, Date.now() - this._gestureStartTime); // Use gesture start time instead
      const velocityForSwipe = Math.abs(totalMove) / timeDiffForSwipe;

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
      const swipeBehavior = this.card._config.swipe_behavior || "single";

      // Check if swipe threshold is crossed
      let skipCount = 1; // Default value
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
          swipeBehavior: swipeBehavior,
        });

        // Calculate skip count based on swipe behavior
        skipCount = this.card.swipeBehavior.calculateSkipCount(
          velocityForSwipe,
          Math.abs(totalMove),
          totalVisibleCards,
          swipeBehavior,
        );

        // Determine direction and apply skip count
        const direction = totalMove > 0 ? skipCount : -skipCount; // Fixed: removed negative sign from first part
        nextIndex = this.card.loopMode.handleSwipeNavigation(
          this.card.currentIndex,
          direction,
        );

        logDebug(
          "SWIPE",
          `Swipe resulted in navigation: ${this.card.currentIndex} → ${nextIndex} (${loopMode} mode, ${swipeBehavior} behavior, skip: ${skipCount})`,
        );
      } else {
        logDebug("SWIPE", `Swipe threshold NOT crossed:`, {
          totalMove: totalMove,
          threshold: threshold,
          velocity: velocityForSwipe,
          velocityThreshold: this._swipeVelocityThreshold,
          viewMode: viewMode,
          swipeBehavior: swipeBehavior,
        });
      }

      if (nextIndex !== this.card.currentIndex) {
        logDebug("SWIPE", `Swipe resulted in index change to ${nextIndex}`);

        // Store the starting position for pagination animation (use current wrapped index for infinite mode)
        if (this.card._config.loop_mode === "infinite") {
          this.card._previousIndex =
            this.card.loopMode.getWrappedIndexForPagination(
              this.card.currentIndex,
            );
        } else {
          this.card._previousIndex = this.card.currentIndex;
        }

        this.card.goToSlide(nextIndex, skipCount);
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

    setTimeout(() => {
      this.card.pagination?.showAndStartTimer();
    }, 100); // Small delay to ensure swipe is fully complete
  }

  /**
   * Updates pagination dots during swipe gesture based on current transform
   * @param {number} currentTransform - Current transform value
   * @private
   */
  _updatePaginationDuringSwipe(currentTransform) {
    if (
      !this.card.pagination?.paginationElement ||
      this.card.visibleCardIndices.length <= 1
    ) {
      return;
    }

    const isHorizontal = this.card._swipeDirection === "horizontal";
    const viewMode = this.card._config.view_mode || "single";
    const cardSpacing =
      Math.max(0, parseInt(this.card._config.card_spacing)) || 0;

    // Calculate relative movement from initial position
    const deltaTransform = currentTransform - this._initialTransform;

    let cardsMoved;

    if (viewMode === "carousel") {
      // For carousel mode, calculate based on card width
      const cardsVisible =
        this.card._config.cards_visible ||
        this.card._calculateCardsVisibleFromMinWidth();
      const totalSpacing = (cardsVisible - 1) * cardSpacing;
      const cardWidth = (this.card.slideWidth - totalSpacing) / cardsVisible;
      const moveDistance = cardWidth + cardSpacing;

      // Simple calculation - no threshold complexity
      cardsMoved = Math.round(-deltaTransform / moveDistance);
    } else {
      // For single mode
      const slideSize = isHorizontal
        ? this.card.slideWidth
        : this.card.slideHeight;
      const moveDistance = slideSize + cardSpacing;

      // Simple calculation - no threshold complexity
      cardsMoved = Math.round(-deltaTransform / moveDistance);
    }

    // Calculate virtual index based on starting position + movement
    const virtualIndex = this.card.currentIndex + cardsMoved;

    // Update pagination with the calculated virtual index
    this.card.pagination.updateDuringSwipe(virtualIndex);
  }

  /**
   * Checks if an element is interactive or scrollable - SIMPLIFIED with robust slider detection
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

    const tagName = element.localName?.toLowerCase();
    const role = element.getAttribute("role");

    // CHART FIX: Allow swiping on chart elements (SVG, Canvas)
    if (tagName === "svg" || tagName === "canvas") {
      logDebug("SWIPE", "Allowing swipe on chart element:", tagName);
      return false;
    }

    // Block swipes ONLY on actual button/icon elements
    const blockSwipeElements = [
      "button",
      "ha-icon-button",
      "mwc-icon-button",
      "ha-button",
      "mwc-button",
      "paper-button",
      "ha-cover-controls",
    ];

    if (blockSwipeElements.includes(tagName)) {
      logDebug("SWIPE", "Blocking swipe on button/icon element:", tagName);
      return true;
    }

    // SIMPLE & ROBUST: Detect slider-like elements
    const className =
      element.className && typeof element.className === "string"
        ? element.className
        : element.className?.toString() || "";
    const id = element.id || "";

    if (
      className.includes("slider") ||
      id.includes("slider") ||
      role === "slider" ||
      role === "range"
    ) {
      logDebug(
        "SWIPE",
        "_isInteractiveOrScrollable: Found slider element:",
        element,
      );
      return true;
    }

    // TOUCH-ACTION FIX: Only block swipes if touch-action conflicts with swipe direction
    // pan-y means allow vertical panning, which conflicts with VERTICAL swipes (not horizontal)
    // pan-x means allow horizontal panning, which conflicts with HORIZONTAL swipes (not vertical)
    try {
      const style = window.getComputedStyle(element);
      const touchAction = style.touchAction;
      const isHorizontalSwipe = this.card._swipeDirection === "horizontal";

      if (touchAction) {
        // Only block if there's a direction conflict
        if (isHorizontalSwipe && touchAction.includes("pan-x")) {
          logDebug(
            "SWIPE",
            "_isInteractiveOrScrollable: Found conflicting touch-action pan-x for horizontal swipe:",
            element,
          );
          return true;
        }
        if (!isHorizontalSwipe && touchAction.includes("pan-y")) {
          logDebug(
            "SWIPE",
            "_isInteractiveOrScrollable: Found conflicting touch-action pan-y for vertical swipe:",
            element,
          );
          return true;
        }
        // If pan-y on horizontal swipe or pan-x on vertical swipe, that's fine - no conflict
      }
    } catch (e) {
      // Ignore style errors
    }

    if (["input", "textarea", "select", "a", "audio"].includes(tagName)) {
      logDebug(
        "SWIPE",
        "_isInteractiveOrScrollable: Found basic interactive element:",
        tagName,
      );
      return true;
    }

    if (
      role &&
      [
        "checkbox",
        "switch",
        "slider",
        "link",
        "menuitem",
        "textbox",
        "combobox",
        "option",
        "range",
      ].includes(role)
    ) {
      logDebug(
        "SWIPE",
        "_isInteractiveOrScrollable: Found interactive role:",
        role,
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

          const currentClassName =
            current.className && typeof current.className === "string"
              ? current.className
              : current.className?.toString() || "";
          const currentId = current.id || "";
          if (
            currentClassName.includes("slider") ||
            currentId.includes("slider")
          ) {
            logDebug(
              "SWIPE",
              "_isInteractiveOrScrollable: Found slider-like ancestor:",
              current,
            );
            return true;
          }
        } catch (e) {
          logDebug(
            "ERROR",
            "Error accessing style/scroll properties:",
            current,
            e,
          );
        }
      }

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

  /**
   * Gets the actual event target, accounting for Shadow DOM
   * @param {Event} e - The event
   * @returns {Element} The actual target element
   * @private
   */
  _getActualEventTarget(e) {
    // Try to get the composed path (works through shadow DOM)
    if (e.composedPath && typeof e.composedPath === "function") {
      const composedPath = e.composedPath();
      if (composedPath && composedPath.length > 0) {
        // Return the first element in the path (the actual clicked element)
        const actualTarget = composedPath[0];
        if (actualTarget && actualTarget.nodeType === Node.ELEMENT_NODE) {
          return actualTarget;
        }
      }
    }

    // Fallback to regular target for browsers that don't support composedPath
    return e.target;
  }

  /**
   * Sets up auto-hide pagination event listeners
   * Call this from setupGestures()
   * @private
   */
  _setupAutoHideListeners() {
    if (
      !this.card._config.show_pagination ||
      !this.card._config.auto_hide_pagination
    ) {
      return; // Only setup if auto-hide is enabled
    }

    const element = this.card.cardContainer;
    if (!element) return;

    // Mouse events for desktop
    element.addEventListener("mouseenter", this._handleMouseEnter.bind(this), {
      passive: true,
    });
    element.addEventListener("mouseleave", this._handleMouseLeave.bind(this), {
      passive: true,
    });

    // Touch events for mobile (non-swipe touches)
    element.addEventListener("touchstart", this._handleTouchStart.bind(this), {
      passive: true,
    });
    element.addEventListener("touchend", this._handleTouchEnd.bind(this), {
      passive: true,
    });
  }

  /**
   * Handle mouse enter - show pagination
   * @private
   */
  _handleMouseEnter() {
    this.card.pagination?.showPagination();
  }

  /**
   * Handle mouse leave - start auto-hide timer
   * @private
   */
  _handleMouseLeave() {
    // Only start timer if not currently swiping
    if (!this._isDragging) {
      this.card.pagination?.showAndStartTimer();
    }
  }

  /**
   * Handle touch start - show pagination
   * @private
   */
  _handleTouchStart() {
    this.card.pagination?.showPagination();
  }

  /**
   * Handle touch end - start auto-hide timer if not swiping
   * @private
   */
  _handleTouchEnd() {
    // Small delay to see if this becomes a swipe
    setTimeout(() => {
      if (!this._isDragging) {
        this.card.pagination?.showAndStartTimer();
      }
    }, 50);
  }
}
