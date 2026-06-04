/**
 * Scroll strategy functionality for Simple Swipe Card
 *
 * Handles the "css" scroll strategy: native CSS scroll-snap. Instead of writing
 * `transform` to the slider on every touchmove (the "js" strategy), the slider
 * becomes an overflow scroll container and the browser drives scrolling on the
 * compositor thread — much smoother on low-power devices (e.g. wall panels, #102).
 *
 * In css mode the JS swipe gestures are not attached (see SwipeGestures.addGestures)
 * and `updateSlider`/`goToSlide` scroll programmatically via `scrollToIndex` instead
 * of setting transforms. A passive, rAF-coalesced scroll listener keeps the active
 * index, pagination dots and state sync in step with the native scroll position.
 *
 * Desktop mouse drag-to-scroll is added on top (pointer events gated to
 * `pointerType === "mouse"`), so a mouse can still grab-and-drag to swipe. Touch
 * and pen never enter this JS path — they keep scrolling natively on the
 * compositor thread, so low-power touch panels retain the full performance win.
 */

import { logDebug } from "../utils/Debug.js";
import {
  SWIPE_CONSTANTS,
  INTERACTIVE_CONTROL_TAGS,
  SLIDER_CONTROL_TAGS,
} from "../utils/Constants.js";

/**
 * Scroll strategy manager class
 */
export class ScrollStrategy {
  constructor(cardInstance) {
    this.card = cardInstance;
    this._scrollHandler = null;
    this._scrollRaf = null;
    // Suppresses reset-after restarts while a programmatic (smooth) scroll settles,
    // so auto-swipe / reset-after navigation does not retrigger the reset timer.
    this._programmaticUntil = 0;
    // Desktop mouse drag-to-scroll state.
    this._pointerDownHandler = null;
    this._pointerMoveHandler = null;
    this._pointerUpHandler = null;
    this._clickGuard = null;
    this._dragState = null;
    // Swallow the click that follows a real drag (until this timestamp).
    this._suppressClickUntil = 0;
  }

  /**
   * Gets the current scroll strategy from configuration
   * @returns {string} "js" or "css"
   */
  getStrategy() {
    return this.card._config?.scroll_strategy || "js";
  }

  /**
   * @returns {boolean} True when the native CSS scroll-snap strategy is active
   */
  isNative() {
    return this.getStrategy() === "css";
  }

  /**
   * Whether the active carousel uses centered alignment (peek neighbours).
   * @returns {boolean}
   * @private
   */
  _isCentered() {
    return (
      this.card._config?.view_mode === "carousel" &&
      this.card._config?.carousel_alignment === "center"
    );
  }

  /**
   * Scrolls the native scroll container so the given visible slide is aligned.
   * Uses the slide element's own offset, so it works for single, carousel and
   * centered layouts alike.
   * @param {number} index - Visible slide index
   * @param {boolean} [smooth=true] - Animate the scroll
   */
  scrollToIndex(index, smooth = true) {
    const slider = this.card.sliderElement;
    if (!slider) return;

    const slides = slider.querySelectorAll(".slide");
    const slide = slides[index];
    if (!slide) return;

    const horizontal = this.card._swipeDirection === "horizontal";
    // behavior:"auto" resolves to the element's CSS scroll-behavior (which we leave
    // unset = instant), so unanimated jumps stay instant.
    const behavior = smooth ? "smooth" : "auto";
    const centered = this._isCentered();

    if (smooth) {
      // Allow the smooth scroll to settle without restarting the reset-after timer.
      this._programmaticUntil = Date.now() + 600;
    }

    if (horizontal) {
      let left = slide.offsetLeft;
      if (centered) left -= (slider.clientWidth - slide.offsetWidth) / 2;
      slider.scrollTo({ left: Math.max(0, left), behavior });
    } else {
      let top = slide.offsetTop;
      if (centered) top -= (slider.clientHeight - slide.offsetHeight) / 2;
      slider.scrollTo({ top: Math.max(0, top), behavior });
    }
  }

  /**
   * Derives the nearest visible slide index from the current scroll position.
   * @returns {number}
   */
  indexFromScroll() {
    const slider = this.card.sliderElement;
    if (!slider) return this.card.currentIndex || 0;

    const slides = slider.querySelectorAll(".slide");
    if (!slides.length) return 0;

    const horizontal = this.card._swipeDirection === "horizontal";
    const centered = this._isCentered();
    const scrollPos = horizontal ? slider.scrollLeft : slider.scrollTop;
    const viewport = horizontal ? slider.clientWidth : slider.clientHeight;

    let best = 0;
    let bestDist = Infinity;
    slides.forEach((slide, i) => {
      const size = horizontal ? slide.offsetWidth : slide.offsetHeight;
      let pos = horizontal ? slide.offsetLeft : slide.offsetTop;
      if (centered) pos -= (viewport - size) / 2;
      const dist = Math.abs(pos - scrollPos);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    return best;
  }

  /**
   * Attaches the passive scroll listener that syncs index + pagination + state.
   * No-op unless the css strategy is active. Safe to call repeatedly.
   */
  attach() {
    if (!this.isNative()) return;
    const slider = this.card.sliderElement;
    if (!slider) return;

    // Clear any previous binding first. A rebuild creates a fresh slider element,
    // so without this the stale handler reference would block re-attaching to the
    // new slider and scroll sync would silently stop working.
    this.detach();

    this._scrollHandler = () => {
      // Coalesce bursts of scroll events into one update per frame. This runs
      // off the compositor scroll, so the main thread only does cheap index math.
      if (this._scrollRaf) return;
      this._scrollRaf = requestAnimationFrame(() => {
        this._scrollRaf = null;
        this._onScroll();
      });
    };

    slider.addEventListener("scroll", this._scrollHandler, { passive: true });
    this._attachMouseDrag(slider);
    logDebug("SWIPE", "ScrollStrategy: native scroll listener attached");
  }

  /**
   * Removes the scroll listener and cancels any pending frame.
   */
  detach() {
    const slider = this.card.sliderElement;
    if (slider && this._scrollHandler) {
      slider.removeEventListener("scroll", this._scrollHandler);
    }
    this._scrollHandler = null;
    if (this._scrollRaf) {
      cancelAnimationFrame(this._scrollRaf);
      this._scrollRaf = null;
    }
    this._detachMouseDrag(slider);
  }

  /**
   * Wires desktop mouse drag-to-scroll. The handlers no-op for non-mouse pointers,
   * so touch/pen keep scrolling natively. A capture-phase click guard swallows the
   * click that follows a real drag so it doesn't trigger the card underneath.
   * @param {HTMLElement} slider
   * @private
   */
  _attachMouseDrag(slider) {
    if (!slider || this._pointerDownHandler) return;

    this._pointerDownHandler = (e) => this._onPointerDown(e);
    this._pointerMoveHandler = (e) => this._onPointerMove(e);
    this._pointerUpHandler = () => this._onPointerUp();
    this._clickGuard = (e) => {
      if (Date.now() < this._suppressClickUntil) {
        e.stopPropagation();
        e.preventDefault();
        this._suppressClickUntil = 0;
      }
    };

    slider.addEventListener("pointerdown", this._pointerDownHandler);
    slider.addEventListener("click", this._clickGuard, { capture: true });
  }

  /**
   * Removes the mouse drag handlers and any in-flight window listeners.
   * @param {HTMLElement} slider
   * @private
   */
  _detachMouseDrag(slider) {
    if (slider && this._pointerDownHandler) {
      slider.removeEventListener("pointerdown", this._pointerDownHandler);
      slider.removeEventListener("click", this._clickGuard, { capture: true });
    }
    window.removeEventListener("pointermove", this._pointerMoveHandler);
    window.removeEventListener("pointerup", this._pointerUpHandler);
    window.removeEventListener("pointercancel", this._pointerUpHandler);
    this._pointerDownHandler = null;
    this._pointerMoveHandler = null;
    this._pointerUpHandler = null;
    this._clickGuard = null;
    this._dragState = null;
  }

  /**
   * Starts a potential mouse drag. Bails for touch/pen (native scroll) and when
   * the press lands on an interactive control (let the control handle it).
   * @param {PointerEvent} e
   * @private
   */
  _onPointerDown(e) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    if (this._isInteractiveTarget(e)) return;

    const slider = this.card.sliderElement;
    if (!slider) return;

    const horizontal = this.card._swipeDirection === "horizontal";
    this._dragState = {
      startX: e.clientX,
      startY: e.clientY,
      startScroll: horizontal ? slider.scrollLeft : slider.scrollTop,
      horizontal,
      moved: 0,
      active: false,
    };

    // Track on window so the drag continues even if the cursor leaves the card.
    window.addEventListener("pointermove", this._pointerMoveHandler);
    window.addEventListener("pointerup", this._pointerUpHandler);
    window.addEventListener("pointercancel", this._pointerUpHandler);
  }

  /**
   * Drives the scroll position from the mouse delta once past a small threshold.
   * @param {PointerEvent} e
   * @private
   */
  _onPointerMove(e) {
    const st = this._dragState;
    if (!st) return;

    const dx = e.clientX - st.startX;
    const dy = e.clientY - st.startY;
    st.moved = Math.max(st.moved, Math.abs(dx), Math.abs(dy));

    // Begin dragging once intent is clear; turn off snap so the content tracks
    // the cursor instead of snapping every frame.
    if (!st.active) {
      if (st.moved < SWIPE_CONSTANTS.gestureThreshold) return;
      st.active = true;
      const slider = this.card.sliderElement;
      slider.style.scrollSnapType = "none";
      slider.style.cursor = "grabbing";
      slider.style.userSelect = "none";
    }

    e.preventDefault();
    const slider = this.card.sliderElement;
    const primary = st.horizontal ? dx : dy;
    if (st.horizontal) slider.scrollLeft = st.startScroll - primary;
    else slider.scrollTop = st.startScroll - primary;
  }

  /**
   * Ends the drag: restore snapping, settle on the nearest slide, and suppress the
   * trailing click if the pointer actually moved.
   * @private
   */
  _onPointerUp() {
    const st = this._dragState;
    this._dragState = null;
    window.removeEventListener("pointermove", this._pointerMoveHandler);
    window.removeEventListener("pointerup", this._pointerUpHandler);
    window.removeEventListener("pointercancel", this._pointerUpHandler);
    if (!st) return;

    const slider = this.card.sliderElement;
    if (!st.active || !slider) return;

    slider.style.cursor = "";
    slider.style.userSelect = "";
    slider.style.scrollSnapType = "";

    // Suppress the click that a real drag leaves behind.
    this._suppressClickUntil = Date.now() + SWIPE_CONSTANTS.clickBlockDuration;

    // Settle on the nearest slide (idx is a snap point, so restoring mandatory
    // snap above lands here without a visible jump).
    const idx = this.indexFromScroll();
    this.card.currentIndex = idx;
    this.scrollToIndex(idx, true);
    this.card.pagination?.update(false);
    this.card.stateSynchronization?.onCardNavigate(idx);
  }

  /**
   * True when the pointer press landed on an interactive form control / slider,
   * so a drag should not hijack it. Buttons are intentionally not included — a
   * click without movement still activates them, while a drag scrolls.
   * @param {PointerEvent} e
   * @returns {boolean}
   * @private
   */
  _isInteractiveTarget(e) {
    const path = e.composedPath?.() || [];
    for (const node of path) {
      if (node === this.card.sliderElement) break;
      const tag = node.tagName?.toLowerCase();
      if (!tag) continue;
      if (
        INTERACTIVE_CONTROL_TAGS.includes(tag) ||
        SLIDER_CONTROL_TAGS.includes(tag) ||
        ["input", "textarea", "select", "option", "a"].includes(tag)
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Handles a settled scroll frame: update active index, pagination and state.
   * @private
   */
  _onScroll() {
    if (!this.card.initialized || this.card.building) return;

    const idx = this.indexFromScroll();
    if (idx !== this.card.currentIndex) {
      this.card.currentIndex = idx;
      this.card.pagination?.update(false);
      this.card.stateSynchronization?.onCardNavigate(idx);
    }

    // Restart reset-after only for genuine user scrolls (not programmatic ones
    // from auto-swipe / reset / dot clicks, which manage their own timers).
    const programmatic = Date.now() < this._programmaticUntil;
    if (
      !programmatic &&
      this.card._config.enable_reset_after &&
      !this.card.autoSwipe?.isInProgress &&
      !this.card.resetAfter?.isInProgress
    ) {
      this.card.resetAfter?.startTimer();
      if (this.card._config.enable_auto_swipe) {
        this.card.autoSwipe?.pause(5000);
      }
    }
  }
}
