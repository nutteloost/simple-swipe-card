/**
 * Swipe transition effects for Simple Swipe Card
 */

import { logDebug } from "../utils/Debug.js";

/**
 * Available swipe effects and their configurations
 */
export const SWIPE_EFFECTS = {
  slide: {
    name: "Slide",
    easing: "ease-out",
    description: "Default smooth slide transition",
  },
  bounce: {
    name: "Bounce",
    easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    description: "Elastic bounce with overshoot",
  },
  spring: {
    name: "Spring",
    easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    description: "Gentle spring effect",
  },
  instant: {
    name: "Instant",
    easing: "linear",
    duration: 0,
    description: "No animation, instant switch",
  },
  fade: {
    name: "Fade",
    easing: "ease-in-out",
    description: "Crossfade between cards",
    stackedMode: true,
  },
  flip: {
    name: "Flip",
    easing: "ease-in-out",
    description: "3D card flip",
    stackedMode: true,
    use3D: true,
  },
  coverflow: {
    name: "Coverflow",
    easing: "ease-out",
    description: "3D coverflow effect",
    stackedMode: true,
    use3D: true,
  },
  creative: {
    name: "Creative",
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    description: "Slide with rotation and scale",
    stackedMode: true,
  },
  cards: {
    name: "Cards",
    easing: "ease-out",
    description: "Stacked cards effect",
    stackedMode: true,
  },
  reveal: {
    name: "Reveal",
    easing: "ease-out",
    description: "Wipe reveal transition",
    stackedMode: true,
    usesClipPath: true,
  },
  zoom: {
    name: "Zoom",
    easing: "ease-out",
    description: "Zoom in/out transition",
    stackedMode: true,
  },
  swing: {
    name: "Swing",
    easing: "ease-in-out",
    description: "Swing door effect",
    stackedMode: true,
    use3D: true,
  },
};

/**
 * Swipe effects manager class
 */
export class SwipeEffects {
  constructor(cardInstance) {
    this.card = cardInstance;
    this._initialized = false;
    this._lastEffectName = null;
  }

  /**
   * Gets the current effect configuration
   * Returns "slide" effect if configured effect is not available in current mode
   * @returns {Object} Effect configuration
   */
  getEffect() {
    const effectName = this.card._config.swipe_effect || "slide";
    const effect = SWIPE_EFFECTS[effectName] || SWIPE_EFFECTS.slide;

    // If the effect is not available in current mode, return slide effect
    if (!this._isEffectAllowed(effectName, effect)) {
      return SWIPE_EFFECTS.slide;
    }

    return effect;
  }

  /**
   * Gets the effect name (returns "slide" if configured effect is not available)
   * @returns {string} Effect name
   */
  getEffectName() {
    const effectName = this.card._config.swipe_effect || "slide";
    const effect = SWIPE_EFFECTS[effectName] || SWIPE_EFFECTS.slide;

    // If the effect is not available in current mode, return "slide"
    if (!this._isEffectAllowed(effectName, effect)) {
      return "slide";
    }

    return effectName;
  }

  /**
   * Internal check if effect is allowed (without logging)
   * @private
   */
  _isEffectAllowed(effectName, effect) {
    // "slide" is always allowed
    if (effectName === "slide") {
      return true;
    }

    // All other effects require single view mode
    const viewMode = this.card._config.view_mode || "single";
    if (viewMode === "carousel") {
      return false;
    }

    // Non-stacked effects are allowed in single mode
    if (!effect.stackedMode) {
      return true;
    }

    // Stacked effects have additional requirements
    const swipeBehavior = this.card._config.swipe_behavior || "single";
    const swipeDirection = this.card._config.swipe_direction || "horizontal";

    if (swipeBehavior === "free" || swipeDirection === "vertical") {
      return false;
    }

    return true;
  }

  /**
   * Gets the easing function for the current effect
   * Checks for CSS variable override, then falls back to effect default
   * CSS variable: --simple-swipe-card-transition-easing
   * @returns {string} CSS easing function
   */
  getEasing() {
    // Check for CSS variable override
    if (this.card.isConnected) {
      const computedStyle = getComputedStyle(this.card);
      const easingValue = computedStyle
        .getPropertyValue("--simple-swipe-card-transition-easing")
        .trim();

      if (easingValue) {
        return easingValue;
      }
    }

    // Fall back to effect's default easing (getEffect() handles availability check)
    return this.getEffect().easing;
  }

  /**
   * Gets custom duration if effect specifies one
   * @returns {number|null} Duration in ms or null for default
   */
  getCustomDuration() {
    // getEffect() handles availability check, returns slide effect if not available
    const effect = this.getEffect();
    return effect.duration !== undefined ? effect.duration : null;
  }

  /**
   * Checks if effect is available in current mode
   * Effects only work in single view mode (carousel always uses slide)
   * Stacked effects also require single swipe behavior + horizontal direction
   * @returns {boolean}
   */
  isEffectAvailable() {
    const effect = this.getEffect();
    const effectName = this.getEffectName();

    // "slide" effect is always available everywhere
    if (effectName === "slide") {
      return true;
    }

    // All other effects require single view mode (not carousel)
    const viewMode = this.card._config.view_mode || "single";
    if (viewMode === "carousel") {
      if (
        !this._loggedCarouselWarning ||
        this._loggedCarouselWarning !== effectName
      ) {
        logDebug(
          "EFFECTS",
          `Effect "${effectName}" is not available in carousel mode. Using "slide" effect instead.`,
        );
        this._loggedCarouselWarning = effectName;
      }
      return false;
    }

    // Non-stacked effects (bounce, spring, instant) are available in single mode
    if (!effect.stackedMode) {
      return true;
    }

    // Stacked effects require additional conditions
    const swipeBehavior = this.card._config.swipe_behavior || "single";
    const swipeDirection = this.card._config.swipe_direction || "horizontal";

    // Check swipe behavior
    if (swipeBehavior === "free") {
      if (
        !this._loggedFreeSwipeWarning ||
        this._loggedFreeSwipeWarning !== effectName
      ) {
        logDebug(
          "EFFECTS",
          `Effect "${effectName}" is not available with free swipe behavior. Using "slide" effect instead.`,
        );
        this._loggedFreeSwipeWarning = effectName;
      }
      return false;
    }

    // Check swipe direction
    if (swipeDirection === "vertical") {
      if (
        !this._loggedVerticalWarning ||
        this._loggedVerticalWarning !== effectName
      ) {
        logDebug(
          "EFFECTS",
          `Effect "${effectName}" is not available in vertical swipe mode. Using "slide" effect instead.`,
        );
        this._loggedVerticalWarning = effectName;
      }
      return false;
    }

    return true;
  }

  /**
   * Checks if effect uses stacked mode (cards at same position, no slider translate)
   * @returns {boolean}
   */
  usesStackedMode() {
    const effect = this.getEffect();
    if (!this.isEffectAvailable()) return false;
    return effect.stackedMode === true;
  }

  /**
   * Checks if the current effect uses 3D transforms
   * @returns {boolean}
   */
  uses3D() {
    const effect = this.getEffect();
    if (!this.isEffectAvailable()) return false;
    return effect.use3D === true;
  }

  /**
   * Checks if effect needs per-slide transforms
   * @returns {boolean}
   */
  needsSlideTransforms() {
    return this.usesStackedMode();
  }

  /**
   * Initializes effect on first load
   * Should be called AFTER the slider is visible and all cards are built
   */
  initialize() {
    const currentEffectName = this.getEffectName();

    // Reset if effect changed
    if (this._lastEffectName && this._lastEffectName !== currentEffectName) {
      this.resetEffects();
      this._initialized = false;
    }
    this._lastEffectName = currentEffectName;

    if (!this.usesStackedMode()) {
      this._initialized = true;
      return;
    }

    // Always setup stacked layout to ensure ALL slides are positioned
    // This handles cases where cards were added in batches
    this._setupStackedLayout();

    // Setup 3D perspective if needed
    if (this.uses3D()) {
      this._setup3DContainer();
    }

    // Apply transforms IMMEDIATELY to prevent flash of wrong card
    // The gap between stacked layout and transforms causes the last DOM element to show
    if (this.card.isConnected) {
      this._applySlideTransformsImmediate(this.card.currentIndex);
      this._initialized = true;
      logDebug(
        "EFFECTS",
        `Swipe effects initialized for ${currentEffectName} mode`,
      );
    }
  }

  /**
   * Applies stacked transforms to a single newly-added slide
   * Called when slides are inserted after effects have been initialized
   * @param {HTMLElement} slide - The newly added slide element
   * @param {number} domIndex - The slide's index in the DOM
   */
  applyStackedTransformToNewSlide(slide, domIndex) {
    if (!this.usesStackedMode() || !this._initialized) {
      return;
    }

    // Apply stacked layout positioning
    slide.style.position = "absolute";
    slide.style.top = "0";
    slide.style.left = "0";
    slide.style.width = "100%";
    slide.style.height = "100%";

    // Calculate offset from current position
    const loopMode = this.card._config.loop_mode || "none";
    const totalVisible = this.card.visibleCardIndices.length;
    const duplicateCount =
      loopMode === "infinite" && totalVisible > 1
        ? this.card.loopMode.getDuplicateCount()
        : 0;
    const domPosition = this.card.currentIndex + duplicateCount;
    const offset = domIndex - domPosition;

    // Apply the transform based on current effect
    const effectName = this.getEffectName();
    slide.style.transition = "none";
    this._applySlideTransform(slide, offset, effectName);
    // Force reflow
    slide.offsetHeight;
  }

  /**
   * Sets up stacked layout where all slides are positioned at the same place
   * @private
   */
  _setupStackedLayout() {
    const slides = this.card.sliderElement?.querySelectorAll(".slide");
    if (!slides) return;

    // Position all slides at the same location
    // Set default opacity=0 and z-index=0 to prevent flash of wrong card
    // The actual values will be set by _applySlideTransformsImmediate
    slides.forEach((slide) => {
      slide.style.position = "absolute";
      slide.style.top = "0";
      slide.style.left = "0";
      slide.style.width = "100%";
      slide.style.height = "100%";
      // Default to hidden - transforms will make the correct slide visible
      if (!slide.style.opacity) {
        slide.style.opacity = "0";
      }
      if (!slide.style.zIndex) {
        slide.style.zIndex = "0";
      }
    });

    // Make slider non-scrolling
    if (this.card.sliderElement) {
      this.card.sliderElement.style.position = "relative";
      this.card.sliderElement.style.overflow = "hidden";
    }

    logDebug("EFFECTS", "Stacked layout setup complete");
  }

  /**
   * Sets up 3D perspective on the container
   * @private
   */
  _setup3DContainer() {
    if (!this.card.cardContainer) return;

    this.card.cardContainer.style.perspective = "1200px";
    this.card.cardContainer.style.perspectiveOrigin = "center center";

    if (this.card.sliderElement) {
      this.card.sliderElement.style.transformStyle = "preserve-3d";
    }

    const slides = this.card.sliderElement?.querySelectorAll(".slide");
    const effectName = this.getEffectName();
    slides?.forEach((slide) => {
      slide.style.transformStyle = "preserve-3d";
      slide.style.backfaceVisibility =
        effectName === "flip" ? "hidden" : "visible";
    });

    logDebug("EFFECTS", "3D container setup complete");
  }

  /**
   * Applies transforms immediately without transition
   * @param {number} currentIndex - Current active index
   * @private
   */
  _applySlideTransformsImmediate(currentIndex) {
    const slides = this.card.sliderElement?.querySelectorAll(".slide");
    if (!slides || slides.length === 0) return;

    const effectName = this.getEffectName();
    const loopMode = this.card._config.loop_mode || "none";
    const totalVisible = this.card.visibleCardIndices.length;
    const duplicateCount =
      loopMode === "infinite" && totalVisible > 1
        ? this.card.loopMode.getDuplicateCount()
        : 0;
    const domPosition = currentIndex + duplicateCount;

    slides.forEach((slide, index) => {
      const offset = index - domPosition;
      slide.style.transition = "none";
      this._applySlideTransform(slide, offset, effectName);
      // Force reflow
      slide.offsetHeight;
    });

    logDebug(
      "EFFECTS",
      `Applied immediate transforms, active index: ${currentIndex}`,
    );
  }

  /**
   * Applies transform to a single slide based on effect
   * @param {HTMLElement} slide - The slide element
   * @param {number} offset - Position offset from current (-1, 0, 1, etc)
   * @param {string} effectName - Name of the effect
   * @param {number|null} baseOffset - Original offset before swipe progress (for consistent pivots)
   * @private
   */
  _applySlideTransform(slide, offset, effectName, baseOffset = null) {
    const absOffset = Math.abs(offset);
    // Use baseOffset for determining pivot direction, fall back to offset
    const pivotOffset = baseOffset !== null ? baseOffset : offset;

    switch (effectName) {
      case "fade":
        this._applyFadeTransform(slide, offset, absOffset);
        break;

      case "flip":
        this._applyFlipTransform(slide, offset, absOffset, pivotOffset);
        break;

      case "coverflow":
        this._applyCoverflowTransform(slide, offset, absOffset, pivotOffset);
        break;

      case "creative":
        this._applyCreativeTransform(slide, offset, absOffset);
        break;

      case "cards":
        this._applyCardsTransform(slide, offset, absOffset);
        break;

      case "reveal":
        this._applyRevealTransform(slide, offset, absOffset, pivotOffset);
        break;

      case "zoom":
        this._applyZoomTransform(slide, offset, absOffset);
        break;

      case "swing":
        this._applySwingTransform(slide, offset, absOffset, pivotOffset);
        break;

      default:
        slide.style.opacity = "";
        slide.style.transform = "";
        slide.style.zIndex = "";
        slide.style.clipPath = "";
        break;
    }
  }

  /**
   * Fade effect - pure crossfade
   */
  _applyFadeTransform(slide, offset, absOffset) {
    if (absOffset > 1) {
      slide.style.opacity = "0";
      slide.style.zIndex = "0";
    } else if (absOffset === 0) {
      slide.style.opacity = "1";
      slide.style.zIndex = "2";
    } else {
      // During transition, partially visible
      slide.style.opacity = String(Math.max(0, 1 - absOffset));
      slide.style.zIndex = "1";
    }
    slide.style.transform = "";
  }

  /**
   * Flip effect - 3D card flip
   * @param {number} pivotOffset - Base offset for determining rotation direction
   */
  _applyFlipTransform(slide, offset, absOffset, pivotOffset = null) {
    const direction =
      pivotOffset !== null
        ? Math.sign(pivotOffset) || Math.sign(offset)
        : Math.sign(offset);
    const rotateY = offset * -180;

    if (absOffset > 1) {
      slide.style.opacity = "0";
      slide.style.transform = "rotateY(0deg)";
      slide.style.zIndex = "0";
    } else {
      slide.style.opacity = absOffset < 0.5 ? "1" : "0";
      slide.style.transform = `rotateY(${rotateY}deg)`;
      slide.style.zIndex = absOffset < 0.5 ? "2" : "1";
    }
  }

  /**
   * Coverflow effect - 3D carousel style
   * @param {number} pivotOffset - Base offset for consistent transforms
   */
  _applyCoverflowTransform(slide, offset, absOffset, pivotOffset = null) {
    if (absOffset > 2) {
      slide.style.opacity = "0";
      slide.style.transform = "";
      slide.style.zIndex = "0";
      return;
    }

    const rotateY = offset * -45;
    const translateX = offset * 40;
    const translateZ = -absOffset * 100;
    const scale = 1 - absOffset * 0.15;
    const opacity = 1 - absOffset * 0.3;

    slide.style.opacity = String(Math.max(0, opacity));
    slide.style.transform = `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
    slide.style.zIndex = String(10 - Math.round(absOffset));
  }

  /**
   * Creative effect - slide with rotation and scale
   */
  _applyCreativeTransform(slide, offset, absOffset) {
    if (absOffset > 2) {
      slide.style.opacity = "0";
      slide.style.transform = "";
      slide.style.zIndex = "0";
      return;
    }

    const translateX = offset * 100;
    const rotate = offset * -15;
    const scale = 1 - absOffset * 0.2;
    const opacity = 1 - absOffset * 0.5;

    slide.style.opacity = String(Math.max(0, opacity));
    slide.style.transform = `translateX(${translateX}%) rotate(${rotate}deg) scale(${scale})`;
    slide.style.zIndex = String(10 - Math.round(absOffset));
  }

  /**
   * Cards effect - stacked deck of cards
   */
  _applyCardsTransform(slide, offset, absOffset) {
    if (absOffset > 3) {
      slide.style.opacity = "0";
      slide.style.transform = "";
      slide.style.zIndex = "0";
      return;
    }

    // Cards stack behind current, slide in from the side
    const translateX = offset > 0 ? 100 : offset * 10;
    const translateY = offset <= 0 ? absOffset * 8 : 0;
    const scale = offset <= 0 ? 1 - absOffset * 0.05 : 1;
    const rotate = offset <= 0 ? offset * 2 : 0;
    const opacity = offset <= 0 ? 1 - absOffset * 0.2 : 1;

    slide.style.opacity = String(Math.max(0, opacity));
    slide.style.transform = `translateX(${translateX}%) translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`;
    slide.style.zIndex = String(10 - Math.round(absOffset));
  }

  /**
   * Reveal effect - wipe/comparison slider style
   * Top card clips away to reveal card underneath
   * Works symmetrically for both swipe directions
   */
  _applyRevealTransform(slide, offset, absOffset, pivotOffset = null) {
    if (absOffset > 1) {
      slide.style.opacity = "0";
      slide.style.transform = "";
      slide.style.clipPath = "";
      slide.style.zIndex = "0";
      return;
    }

    if (absOffset === 0) {
      // Fully visible current card - on top, no clipping
      slide.style.opacity = "1";
      slide.style.clipPath = "inset(0 0 0 0)";
      slide.style.zIndex = "2";
      slide.style.transform = "";
      return;
    }

    // During transition:
    // - The card moving AWAY from 0 is the "top" card that gets clipped
    // - The card moving TOWARD 0 is the "bottom" card that gets revealed

    // Use baseOffset to determine original position
    const basis = pivotOffset !== null ? pivotOffset : offset;

    if (basis <= 0 && offset < 0) {
      // Card originally at or left of current, now moving further left
      // This is the TOP card being clipped from the RIGHT (revealing card behind from right)
      const clipPercent = absOffset * 100;
      slide.style.opacity = "1";
      slide.style.clipPath = `inset(0 ${clipPercent}% 0 0)`;
      slide.style.zIndex = "2";
    } else if (basis >= 0 && offset > 0) {
      // Card originally at or right of current, now moving further right
      // This is the TOP card being clipped from the LEFT (revealing card behind from left)
      const clipPercent = absOffset * 100;
      slide.style.opacity = "1";
      slide.style.clipPath = `inset(0 0 0 ${clipPercent}%)`;
      slide.style.zIndex = "2";
    } else {
      // Card moving toward 0 - this is the BOTTOM card being revealed
      slide.style.opacity = "1";
      slide.style.clipPath = "inset(0 0 0 0)";
      slide.style.zIndex = "1";
    }
    slide.style.transform = "";
  }

  /**
   * Zoom effect - current zooms out, next zooms in
   */
  _applyZoomTransform(slide, offset, absOffset) {
    // Hide slides not involved in current transition
    if (absOffset > 1) {
      slide.style.opacity = "0";
      slide.style.transform = "scale(1)";
      slide.style.zIndex = "0";
      return;
    }

    // Current card (fully visible, not transitioning)
    if (absOffset === 0) {
      slide.style.opacity = "1";
      slide.style.transform = "scale(1)";
      slide.style.zIndex = "2";
      return;
    }

    // During transition: one card zooms out, other zooms in
    // The card that's "leaving" (moving away from 0) zooms out
    // The card that's "entering" (moving toward 0) zooms in

    if (offset < 0) {
      // This card is leaving (was current, now moving to negative)
      // Zoom out and fade out
      const scale = 1 - absOffset * 0.3;
      slide.style.opacity = String(Math.max(0, 1 - absOffset));
      slide.style.transform = `scale(${Math.max(0.7, scale)})`;
      slide.style.zIndex = "1";
    } else {
      // This card is entering (coming from positive toward 0)
      // Zoom in from small
      const scale = 0.7 + (1 - absOffset) * 0.3;
      slide.style.opacity = String(Math.max(0, 1 - absOffset));
      slide.style.transform = `scale(${scale})`;
      slide.style.zIndex = "2";
    }
  }

  /**
   * Swing effect - cards swing like a door
   * Works symmetrically for both swipe directions
   */
  _applySwingTransform(slide, offset, absOffset, pivotOffset = null) {
    if (absOffset > 1) {
      slide.style.opacity = "0";
      slide.style.transform = "rotateY(0deg)";
      slide.style.zIndex = "0";
      return;
    }

    if (absOffset === 0) {
      slide.style.opacity = "1";
      slide.style.transform = "rotateY(0deg)";
      slide.style.transformOrigin = "center center";
      slide.style.zIndex = "2";
      return;
    }

    const basis = pivotOffset !== null ? pivotOffset : offset;
    const isLeaving = Math.abs(basis) < 0.1;

    // Swing rotation amount (door opening effect)
    const maxRotation = 90;

    if (isLeaving) {
      // Leaving card: swings away like opening a door
      // Pivot on the edge opposite to the swipe direction
      const rotateY = offset * maxRotation;
      const originX = offset < 0 ? "100%" : "0%"; // Hinge on opposite edge
      slide.style.opacity = String(Math.max(0, 1 - absOffset * 0.5));
      slide.style.transform = `rotateY(${rotateY}deg)`;
      slide.style.transformOrigin = `${originX} center`;
      slide.style.zIndex = "2"; // On top while swinging away
    } else {
      // Entering card: swings in from the side
      // Starts rotated, ends at 0
      const startRotation = basis > 0 ? -maxRotation : maxRotation;
      const rotateY = startRotation * absOffset;
      const originX = basis > 0 ? "0%" : "100%"; // Hinge on near edge
      slide.style.opacity = String(Math.max(0.5, 1 - absOffset * 0.3));
      slide.style.transform = `rotateY(${rotateY}deg)`;
      slide.style.transformOrigin = `${originX} center`;
      slide.style.zIndex = "1"; // Behind while entering
    }
  }

  /**
   * Applies effect styles to slides during/after transition
   * @param {number} currentIndex - Current active index
   * @param {boolean} animate - Whether animating
   */
  applyEffect(currentIndex, animate) {
    if (!this.needsSlideTransforms()) return;

    // Setup stacked layout if needed (but don't mark as fully initialized yet)
    // Full initialization happens in initialize() after all cards are built
    if (this.usesStackedMode()) {
      this._setupStackedLayout();
      if (this.uses3D()) {
        this._setup3DContainer();
      }
    }

    // If not animating, use immediate application (no transition)
    if (!animate) {
      this._applySlideTransformsImmediate(currentIndex);
      return;
    }

    const slides = this.card.sliderElement?.querySelectorAll(".slide");
    if (!slides || slides.length === 0) return;

    const effectName = this.getEffectName();
    const loopMode = this.card._config.loop_mode || "none";
    const totalVisible = this.card.visibleCardIndices.length;
    const duplicateCount =
      loopMode === "infinite" && totalVisible > 1
        ? this.card.loopMode.getDuplicateCount()
        : 0;
    const domPosition = currentIndex + duplicateCount;
    const duration = this._getTransitionDuration();
    const easing = this.getEasing();

    // Include clipPath in transitions for reveal effect
    const transitionProps =
      effectName === "reveal"
        ? `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}, clip-path ${duration}ms ${easing}`
        : `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;

    slides.forEach((slide, index) => {
      const offset = index - domPosition;

      if (animate) {
        slide.style.transition = transitionProps;
      } else {
        slide.style.transition = "none";
      }

      this._applySlideTransform(slide, offset, effectName);
    });

    logDebug(
      "EFFECTS",
      `Applied ${effectName} effect, active index: ${currentIndex}, animate: ${animate}`,
    );
  }

  /**
   * Updates transforms during swipe gesture (real-time feedback)
   * @param {number} progress - Swipe progress from -1 to 1
   * @param {number} currentIndex - Current index before swipe completes
   */
  applySwipeProgress(progress, currentIndex) {
    if (!this.needsSlideTransforms()) return;

    const slides = this.card.sliderElement?.querySelectorAll(".slide");
    if (!slides || slides.length === 0) return;

    const effectName = this.getEffectName();
    const loopMode = this.card._config.loop_mode || "none";
    const duplicateCount =
      loopMode === "infinite" ? this.card.loopMode.getDuplicateCount() : 0;
    const domPosition = currentIndex + duplicateCount;

    slides.forEach((slide, index) => {
      slide.style.transition = "none";
      const baseOffset = index - domPosition; // Original offset (for pivot determination)
      const offset = baseOffset + progress; // Interpolated offset (for actual position)

      // Pass both offset and baseOffset for consistent transform origins
      this._applySlideTransform(slide, offset, effectName, baseOffset);
    });
  }

  /**
   * Gets the slider transform for stacked mode effects
   * Returns fixed position to disable slider movement
   * @param {boolean} animate - Whether animating
   * @returns {string|null} Fixed transform for stacked effects, null for normal
   */
  getSliderTransform(animate) {
    if (this.usesStackedMode()) {
      return "translate3d(0, 0, 0)";
    }
    return null;
  }

  /**
   * Resets all slide transforms and styles
   */
  resetEffects() {
    const slides = this.card.sliderElement?.querySelectorAll(".slide");
    if (slides) {
      slides.forEach((slide) => {
        slide.style.opacity = "";
        slide.style.transform = "";
        slide.style.transition = "";
        slide.style.transformOrigin = "";
        slide.style.transformStyle = "";
        slide.style.backfaceVisibility = "";
        slide.style.zIndex = "";
        slide.style.position = "";
        slide.style.top = "";
        slide.style.left = "";
        slide.style.width = "";
        slide.style.height = "";
        slide.style.clipPath = "";
      });
    }

    // Reset container styles
    if (this.card.cardContainer) {
      this.card.cardContainer.style.perspective = "";
      this.card.cardContainer.style.perspectiveOrigin = "";
    }

    if (this.card.sliderElement) {
      this.card.sliderElement.style.transformStyle = "";
      this.card.sliderElement.style.position = "";
      this.card.sliderElement.style.overflow = "";
    }

    this._initialized = false;
    logDebug("EFFECTS", "Reset all slide effects");
  }

  /**
   * Legacy method for backwards compatibility
   */
  resetOpacity() {
    this.resetEffects();
  }

  /**
   * Gets transition duration in milliseconds
   * @returns {number}
   * @private
   */
  _getTransitionDuration() {
    const customDuration = this.getCustomDuration();
    if (customDuration !== null) {
      return customDuration;
    }

    if (!this.card.isConnected) return 300;

    const computedStyle = getComputedStyle(this.card);
    const speedValue = computedStyle
      .getPropertyValue("--simple-swipe-card-transition-speed")
      .trim();

    if (speedValue && speedValue.endsWith("s")) {
      return parseFloat(speedValue) * 1000;
    } else if (speedValue && speedValue.endsWith("ms")) {
      return parseFloat(speedValue);
    }

    return 300;
  }
}
