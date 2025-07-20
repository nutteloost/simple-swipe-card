/**
 * Main Simple Swipe Card class
 */

import { LitElement } from "./Dependencies.js";
import { logDebug } from "../utils/Debug.js";
import { DEFAULT_CONFIG } from "../utils/Constants.js";
import { evaluateVisibilityConditions } from "../features/VisibilityConditions.js";
import { SwipeGestures } from "../features/SwipeGestures.js";
import { AutoSwipe } from "../features/AutoSwipe.js";
import { ResetAfter } from "../features/ResetAfter.js";
import { Pagination } from "../features/Pagination.js";
import { CardBuilder } from "./CardBuilder.js";
import { StateSynchronization } from "../features/StateSynchronization.js";
import {
  setupResizeObserver,
  applyCardModStyles,
  setupCardModObserver,
  removeCardMargins,
} from "../ui/DomHelpers.js";
import {
  getTransitionStyle,
  initializeGlobalDialogStack,
} from "../utils/EventHelpers.js";

/**
 * Main Simple Swipe Card class
 * @extends LitElement
 */
export class SimpleSwipeCard extends (LitElement || HTMLElement) {
  constructor() {
    super();
    logDebug("INIT", "SimpleSwipeCard Constructor invoked.");

    this._config = {};
    this._hass = null;
    this.cards = [];
    this.visibleCardIndices = []; // Track which cards are currently visible
    this.currentIndex = 0;
    this.slideWidth = 0;
    this.slideHeight = 0;
    this.cardContainer = null;
    this.sliderElement = null;
    this.initialized = false;
    this.building = false;
    this.resizeObserver = null;
    this._swipeDirection = "horizontal"; // Default swipe direction
    this._autoSwipeInProgress = false;

    // Card-mod support
    this._cardModConfig = null;
    this._cardModObserver = null;

    // Initialize feature managers
    this.swipeGestures = new SwipeGestures(this);
    this.autoSwipe = new AutoSwipe(this);
    this.resetAfter = new ResetAfter(this);
    this.pagination = new Pagination(this);
    this.cardBuilder = new CardBuilder(this);
    this.stateSynchronization = new StateSynchronization(this);

    this._visibilityUpdateTimeout = null;
    this._debouncedUpdateVisibility = this._debounceVisibilityUpdate.bind(this);

    // Generate unique instance ID
    this._instanceId = Math.random().toString(36).substring(2, 15);

    // Initialize global dialog stack
    initializeGlobalDialogStack();
  }

  /**
   * Gets the config element for the Lovelace editor
   * @returns {Promise<HTMLElement>} The editor element
   */
  static async getConfigElement() {
    logDebug("SYSTEM", "SimpleSwipeCard.getConfigElement called");
    await customElements.whenDefined("simple-swipe-card-editor");
    return document.createElement("simple-swipe-card-editor");
  }

  /**
   * Gets the minimal configuration for new cards
   * @returns {Object} Minimal configuration object
   */
  static getStubConfig() {
    logDebug("SYSTEM", "SimpleSwipeCard.getStubConfig called");
    return {
      type: "custom:simple-swipe-card",
      cards: [],
    };
  }

  /**
   * Sets the card configuration
   * @param {Object} config - The card configuration
   */
  setConfig(config) {
    logDebug("CONFIG", "setConfig received:", JSON.stringify(config));

    // Validate configuration
    if (!config || typeof config !== "object") {
      this._handleInvalidConfig("Configuration must be an object");
      return;
    }

    if (!config.cards || !Array.isArray(config.cards)) {
      logDebug(
        "CONFIG",
        "No cards array found in configuration, creating empty array",
      );
      this._config = { ...DEFAULT_CONFIG };
      if (this.isConnected) this.cardBuilder.build();
      return;
    }

    // Check if configuration has changed
    const oldConfigString = JSON.stringify(this._config);
    const newConfigString = JSON.stringify(config);

    if (oldConfigString === newConfigString) {
      logDebug("CONFIG", "setConfig: No change detected, skipping update.");
      return;
    }

    // Apply new configuration
    this._config = JSON.parse(newConfigString);

    // Handle backward compatibility
    if (this._config.parameters?.show_pagination !== undefined) {
      this._config.show_pagination = this._config.parameters.show_pagination;
      delete this._config.parameters;
    }

    // Set defaults
    Object.keys(DEFAULT_CONFIG).forEach((key) => {
      if (this._config[key] === undefined) {
        this._config[key] = DEFAULT_CONFIG[key];
      }
    });

    // Validate numeric values
    this._config.card_spacing = parseInt(this._config.card_spacing);
    if (isNaN(this._config.card_spacing) || this._config.card_spacing < 0) {
      this._config.card_spacing = DEFAULT_CONFIG.card_spacing;
    }

    this._config.auto_swipe_interval = parseInt(
      this._config.auto_swipe_interval,
    );
    if (
      isNaN(this._config.auto_swipe_interval) ||
      this._config.auto_swipe_interval < 500
    ) {
      this._config.auto_swipe_interval = DEFAULT_CONFIG.auto_swipe_interval;
    }

    this._config.reset_after_timeout = parseInt(
      this._config.reset_after_timeout,
    );
    if (
      isNaN(this._config.reset_after_timeout) ||
      this._config.reset_after_timeout < 5000
    ) {
      this._config.reset_after_timeout = DEFAULT_CONFIG.reset_after_timeout;
    }

    // Validate swipe direction
    if (!["horizontal", "vertical"].includes(this._config.swipe_direction)) {
      this._config.swipe_direction = DEFAULT_CONFIG.swipe_direction;
    }

    // Validate state_entity if provided
    if (
      this._config.state_entity &&
      typeof this._config.state_entity !== "string"
    ) {
      logDebug("CONFIG", "Invalid state_entity, must be string");
      this._config.state_entity = null;
    }

    // Store the card_mod configuration if present
    if (config.card_mod) {
      logDebug("CARD_MOD", "Card-mod configuration detected", config.card_mod);
      this._cardModConfig = JSON.parse(JSON.stringify(config.card_mod));
    } else {
      this._cardModConfig = null;
    }

    // Store the current swipe direction for internal use
    this._swipeDirection = this._config.swipe_direction;

    delete this._config.title; // Remove title if present (legacy)

    // Evaluate visibility conditions and update visible indices
    this._updateVisibleCardIndices();

    // Determine if rebuild is needed
    const needsRebuild =
      !this.initialized ||
      !this.isConnected ||
      this.cards.length !== this.visibleCardIndices.length;

    if (needsRebuild && this.isConnected) {
      logDebug("CONFIG", "setConfig triggering rebuild");
      this.cardBuilder.build();
    } else if (this.initialized) {
      logDebug("CONFIG", "setConfig triggering updates (no rebuild)");
      this._updateChildCardConfigs();
      this._updateLayoutOptions();
      this.autoSwipe.manage();
      this.resetAfter.manage();
      this.stateSynchronization.manage();
    }
  }

  /**
   * Updates the list of visible card indices based on visibility conditions
   * @private
   */
  _updateVisibleCardIndices() {
    if (!this._config?.cards || !this._hass) {
      const wasEmpty = this.visibleCardIndices.length === 0;
      this.visibleCardIndices = [];
      if (!wasEmpty) {
        logDebug(
          "VISIBILITY",
          "No cards or hass available, cleared visible indices",
        );
      }
      return;
    }

    const previousVisibleIndices = [...this.visibleCardIndices];
    this.visibleCardIndices = [];

    this._config.cards.forEach((cardConfig, index) => {
      const isVisible = evaluateVisibilityConditions(
        cardConfig.visibility,
        this._hass,
      );
      if (isVisible) {
        this.visibleCardIndices.push(index);
      }
    });

    // Only log when visibility actually changes
    const hasChanged =
      JSON.stringify(previousVisibleIndices) !==
      JSON.stringify(this.visibleCardIndices);
    if (hasChanged) {
      logDebug(
        "VISIBILITY",
        `Visible cards changed: ${this.visibleCardIndices.length}/${this._config.cards.length} visible`,
        this.visibleCardIndices,
      );

      // If the currently visible cards changed, we need to adjust the current index
      this._adjustCurrentIndexForVisibility(previousVisibleIndices);
    }
  }

  /**
   * Adjusts the current index when visibility changes (improved version)
   * @param {Array} previousVisibleIndices - The previously visible card indices
   * @private
   */
  _adjustCurrentIndexForVisibility(previousVisibleIndices) {
    if (this.visibleCardIndices.length === 0) {
      this.currentIndex = 0;
      return;
    }

    // Try to stay on the same actual card if it's still visible
    const currentCardOriginalIndex = previousVisibleIndices[this.currentIndex];
    const newVisiblePosition = this.visibleCardIndices.indexOf(
      currentCardOriginalIndex,
    );

    if (newVisiblePosition !== -1) {
      // Current card is still visible, update position
      this.currentIndex = newVisiblePosition;
      logDebug(
        "VISIBILITY",
        `Current card still visible, adjusted index to ${this.currentIndex}`,
      );
    } else {
      // Current card is no longer visible, try to stay close to current position
      const totalVisibleCards = this.visibleCardIndices.length;

      if (this.currentIndex >= totalVisibleCards) {
        // We were at or past the end, go to last visible card
        this.currentIndex = totalVisibleCards - 1;
        logDebug(
          "VISIBILITY",
          `Adjusted to last visible card: ${this.currentIndex}`,
        );
      } else {
        // Try to maintain relative position, but don't go to first card automatically
        this.currentIndex = Math.min(this.currentIndex, totalVisibleCards - 1);
        this.currentIndex = Math.max(0, this.currentIndex);
        logDebug(
          "VISIBILITY",
          `Adjusted to maintain relative position: ${this.currentIndex}`,
        );
      }
    }
  }

  /**
   * Debounced version of _updateVisibleCardIndices
   * @private
   */
  _debounceVisibilityUpdate() {
    if (this._visibilityUpdateTimeout) {
      clearTimeout(this._visibilityUpdateTimeout);
    }

    this._visibilityUpdateTimeout = setTimeout(() => {
      this._updateVisibleCardIndices();
      this._visibilityUpdateTimeout = null;
    }, 50); // 50ms debounce
  }

  /**
   * Handles invalid configuration gracefully
   * @param {string} message - Error message to display
   * @private
   */
  _handleInvalidConfig(message) {
    logDebug("ERROR", `${message}`);
    this._config = { ...DEFAULT_CONFIG };
    this.visibleCardIndices = [];
    if (this.isConnected) this.cardBuilder.build();
  }

  /**
   * Updates child card configurations without rebuilding the entire card
   * @private
   */
  _updateChildCardConfigs() {
    logDebug("CONFIG", "Updating child card configs");
    if (!this.cards || this.cards.length !== this.visibleCardIndices.length)
      return;

    this.visibleCardIndices.forEach((originalIndex, visibleIndex) => {
      const cardConfig = this._config.cards[originalIndex];
      const cardInstance = this.cards[visibleIndex];
      if (
        cardInstance &&
        !cardInstance.error &&
        cardInstance.element?.setConfig
      ) {
        if (
          JSON.stringify(cardInstance.config) !== JSON.stringify(cardConfig)
        ) {
          logDebug(
            "CONFIG",
            "Updating config for visible card",
            visibleIndex,
            "original index",
            originalIndex,
          );
          try {
            cardInstance.element.setConfig(cardConfig);
            cardInstance.config = JSON.parse(JSON.stringify(cardConfig));
          } catch (e) {
            console.error(
              `Error setting config on child card ${visibleIndex}:`,
              e,
            );
          }
        }
      }
    });
  }

  /**
   * Updates layout options (pagination and spacing)
   * @private
   */
  _updateLayoutOptions() {
    logDebug(
      "CONFIG",
      "Updating layout options (pagination, spacing, direction)",
    );

    // Update swipe direction
    if (this._swipeDirection !== this._config.swipe_direction) {
      this._swipeDirection = this._config.swipe_direction;
      // Need to rebuild for direction change
      this.cardBuilder.build();
      return;
    }

    // Update pagination visibility
    this.pagination.updateLayout();

    // Update slider position with new spacing
    this.updateSlider(false);

    if (this._cardModConfig) {
      this._applyCardModStyles();
    }
  }

  /**
   * Sets the Home Assistant object
   * @param {Object} hass - Home Assistant object
   */
  set hass(hass) {
    if (!hass) {
      return;
    }

    // Better change detection - only process if hass has actually changed
    const oldHass = this._hass;
    if (
      oldHass === hass ||
      (oldHass &&
        hass &&
        oldHass.states === hass.states &&
        oldHass.user === hass.user &&
        JSON.stringify(oldHass.config) === JSON.stringify(hass.config))
    ) {
      // Hass hasn't meaningfully changed, just update child cards
      if (this.cards) {
        this.cards.forEach((card) => {
          if (card.element && !card.error) {
            try {
              card.element.hass = hass;
            } catch (e) {
              console.error("Error setting hass on child card:", e);
            }
          }
        });
      }
      return;
    }

    // Only log when hass has actually changed
    logDebug("INIT", "Setting hass (changed)");
    this._hass = hass;

    // Notify state synchronization of hass change
    this.stateSynchronization?.onHassChange(oldHass, hass);

    // Update visibility when hass changes, but be careful about rebuilds
    if (oldHass !== hass) {
      const oldVisibleIndices = [...this.visibleCardIndices];

      // Use debounced update for better performance
      this._debouncedUpdateVisibility();

      // Only rebuild immediately if we already know visibility changed significantly
      const currentVisibleCount = this.visibleCardIndices.length;
      if (Math.abs(currentVisibleCount - oldVisibleIndices.length) > 1) {
        // Significant change, rebuild immediately
        if (this._visibilityUpdateTimeout) {
          clearTimeout(this._visibilityUpdateTimeout);
          this._visibilityUpdateTimeout = null;
        }
        this._updateVisibleCardIndices();

        const visibilityChanged =
          JSON.stringify(oldVisibleIndices) !==
          JSON.stringify(this.visibleCardIndices);
        if (visibilityChanged && this.initialized && this.isConnected) {
          this.cardBuilder.build();
        }
      }
    }

    // Update hass for all child cards
    if (this.cards) {
      this.cards.forEach((card) => {
        if (card.element && !card.error) {
          try {
            card.element.hass = hass;
          } catch (e) {
            console.error("Error setting hass on child card:", e);
          }
        }
      });
    }
  }

  /**
   * Called when element is connected to DOM
   */
  connectedCallback() {
    logDebug("INIT", "connectedCallback");

    // Add event listeners for editor integration
    this.addEventListener(
      "config-changed",
      this._handleConfigChanged.bind(this),
    );

    if (!this.initialized && this._config?.cards) {
      logDebug("INIT", "connectedCallback: Initializing build.");
      this.cardBuilder.build();
    } else if (this.initialized && this.cardContainer) {
      logDebug(
        "INIT",
        "connectedCallback: Re-initializing observers and gestures.",
      );
      this._setupResizeObserver();
      if (this.visibleCardIndices.length > 1) {
        this.swipeGestures.removeGestures();
        setTimeout(() => {
          if (this.isConnected) this.swipeGestures.addGestures();
        }, 50);
      }

      // Apply card-mod styles when connected to DOM
      if (this._cardModConfig) {
        this._applyCardModStyles();
        this._setupCardModObserver();
      }

      // Initialize or resume auto-swipe and reset-after if enabled
      this.autoSwipe.manage();
      this.resetAfter.manage();
      this.stateSynchronization.manage();
    }
  }

  /**
   * Called when element is disconnected from DOM
   */
  disconnectedCallback() {
    logDebug("INIT", "disconnectedCallback");

    // Safely remove observers and gestures
    try {
      this.resizeObserver?.cleanup();
      this.swipeGestures?.removeGestures();
      this.autoSwipe?.stop();
      this.resetAfter?.stopTimer();
      this.stateSynchronization?.stop();

      // Clean up visibility rebuild timeout
      if (this._visibilityRebuildTimeout) {
        clearTimeout(this._visibilityRebuildTimeout);
        this._visibilityRebuildTimeout = null;
      }

      // Clean up card-mod observer
      if (this._cardModObserver) {
        this._cardModObserver.disconnect();
        this._cardModObserver = null;
        logDebug("CARD_MOD", "Disconnected card-mod observer");
      }
    } catch (error) {
      console.warn("Error during cleanup:", error);
    }

    this.initialized = false;
  }

  /**
   * Handles config-changed events
   * @param {Event} e - The config-changed event
   * @private
   */
  _handleConfigChanged(e) {
    // Handle nested card events and prevent interference
    if (e.detail?.fromSwipeCardEditor && e.detail?.editorId === this._editorId)
      return;

    logDebug("EVENT", "Root element received config-changed event:", e.detail);

    // Check if this is from an element editor to prevent interference
    if (
      e.detail?.fromElementEditor ||
      e.detail?.elementConfig ||
      e.detail?.element
    ) {
      logDebug(
        "ELEMENT",
        "Caught element editor event, allowing normal propagation",
      );
      return;
    }
  }

  /**
   * Sets up a ResizeObserver to handle container resizing
   * @private
   */
  _setupResizeObserver() {
    if (this.resizeObserver || !this.cardContainer) return;

    this.resizeObserver = setupResizeObserver(
      this.cardContainer,
      (newWidth, newHeight) => {
        if (
          (newWidth > 0 && Math.abs(newWidth - this.slideWidth) > 1) ||
          (newHeight > 0 && Math.abs(newHeight - this.slideHeight) > 1)
        ) {
          logDebug("INIT", "Resize detected, recalculating layout.", {
            oldWidth: this.slideWidth,
            newWidth,
            oldHeight: this.slideHeight,
            newHeight,
          });
          this.cardBuilder.finishBuildLayout();
        }
      },
    );
  }

  /**
   * Gets transition CSS properties with fallbacks
   * @param {boolean} animate - Whether to apply animation
   * @returns {string} - Transition style value
   */
  _getTransitionStyle(animate) {
    return getTransitionStyle(animate, this);
  }

  /**
   * Applies card-mod styles to the component
   * @private
   */
  _applyCardModStyles() {
    applyCardModStyles(
      this._cardModConfig,
      this.shadowRoot,
      this.shadowRoot?.host,
      this.sliderElement,
      this.pagination.paginationElement,
    );
  }

  /**
   * Sets up a MutationObserver for card-mod style changes
   * @private
   */
  _setupCardModObserver() {
    if (this._cardModObserver) {
      this._cardModObserver.disconnect();
      this._cardModObserver = null;
    }

    this._cardModObserver = setupCardModObserver(this.shadowRoot, () => {
      this._applyCardModStyles();
    });
  }

  /**
   * Navigates to a specific visible slide
   * @param {number} visibleIndex - The visible slide index to navigate to
   */
  goToSlide(visibleIndex) {
    const totalVisibleCards = this.visibleCardIndices.length;

    if (
      !this.visibleCardIndices ||
      totalVisibleCards === 0 ||
      !this.initialized ||
      this.building
    ) {
      logDebug("SWIPE", "goToSlide skipped", {
        totalVisible: totalVisibleCards,
        initialized: this.initialized,
        building: this.building,
      });
      return;
    }

    const loopbackEnabled = this._config.enable_loopback === true;

    if (loopbackEnabled && totalVisibleCards > 1) {
      if (visibleIndex < 0) {
        visibleIndex = totalVisibleCards - 1;
      } else if (visibleIndex >= totalVisibleCards) {
        visibleIndex = 0;
      }
    } else {
      // Clamp to valid range based on visible cards
      visibleIndex = Math.max(0, Math.min(visibleIndex, totalVisibleCards - 1));
    }

    if (
      visibleIndex === this.currentIndex &&
      !this.autoSwipe.isInProgress &&
      !this.resetAfter.isInProgress
    ) {
      logDebug(
        "SWIPE",
        `goToSlide: visible index ${visibleIndex} is current, no change needed.`,
      );
      return;
    }

    logDebug("SWIPE", `Going to visible slide ${visibleIndex}`);
    this.currentIndex = visibleIndex;

    // Notify state synchronization of navigation
    this.stateSynchronization?.onCardNavigate(visibleIndex);

    // No preloading needed - all cards are already loaded
    this.updateSlider();

    // Handle reset-after timer for manual user interactions
    if (!this.autoSwipe.isInProgress && !this.resetAfter.isInProgress) {
      // This was a manual user interaction, start reset-after timer
      this.resetAfter.startTimer();
    }

    // Only pause auto-swipe for manual user interactions, not auto-swipe itself or reset-after
    if (
      this._config.enable_auto_swipe &&
      !this.autoSwipe.isInProgress &&
      !this.resetAfter.isInProgress
    ) {
      this.autoSwipe.pause(5000);
    }
  }

  /**
   * Updates the slider position and pagination
   * @param {boolean} [animate=true] - Whether to animate the transition
   */
  updateSlider(animate = true) {
    const totalVisibleCards = this.visibleCardIndices.length;
    logDebug("SWIPE", `Updating slider to visible index ${this.currentIndex}`, {
      animate,
      totalVisible: totalVisibleCards,
    });

    if (
      !this.sliderElement ||
      totalVisibleCards === 0 ||
      !this.initialized ||
      this.building
    ) {
      logDebug("SWIPE", "updateSlider skipped", {
        slider: !!this.sliderElement,
        totalVisible: totalVisibleCards,
        init: this.initialized,
        building: this.building,
      });
      return;
    }

    const cardSpacing = Math.max(0, parseInt(this._config.card_spacing)) || 0;
    const isHorizontal = this._swipeDirection === "horizontal";

    // Handle loopback mode for index wrapping
    const loopbackEnabled = this._config.enable_loopback === true;

    // Ensure currentIndex is valid according to visible cards
    if (loopbackEnabled && totalVisibleCards > 1) {
      if (this.currentIndex < 0) {
        this.currentIndex = totalVisibleCards - 1;
      } else if (this.currentIndex >= totalVisibleCards) {
        this.currentIndex = 0;
      }
    } else {
      this.currentIndex = Math.max(
        0,
        Math.min(this.currentIndex, totalVisibleCards - 1),
      );
    }

    // Use gap for spacing instead of margins to maintain transparency
    this.sliderElement.style.gap = `${cardSpacing}px`;

    // Calculate transform amount based on direction for visible cards
    let translateAmount = 0;
    if (isHorizontal) {
      translateAmount = this.currentIndex * (this.slideWidth + cardSpacing);
    } else {
      translateAmount = this.currentIndex * (this.slideHeight + cardSpacing);
    }

    this.sliderElement.style.transition = this._getTransitionStyle(animate);

    // Apply transform based on swipe direction
    if (isHorizontal) {
      this.sliderElement.style.transform = `translateX(-${translateAmount}px)`;
    } else {
      this.sliderElement.style.transform = `translateY(-${translateAmount}px)`;
    }

    // Remove any existing margins that could interfere with transparency
    removeCardMargins(this.cards);

    // Update pagination dots
    this.pagination.update();

    logDebug(
      "SWIPE",
      `Slider updated, transform: -${translateAmount}px along ${isHorizontal ? "X" : "Y"} axis`,
    );
  }

  /**
   * Gets the card size for Home Assistant
   * @returns {number} The card size
   */
  getCardSize() {
    // If showing preview, return a moderate size
    if (this.visibleCardIndices.length === 0) {
      return 3;
    }

    // Normal logic for actual cards
    let maxSize = 3;
    if (this.cards && this.cards.length > 0) {
      const currentCardData = this.cards[this.currentIndex];
      if (
        currentCardData?.element &&
        !currentCardData.error &&
        typeof currentCardData.element.getCardSize === "function"
      ) {
        try {
          maxSize = currentCardData.element.getCardSize();
        } catch (e) {
          console.warn("Error getting card size from current element:", e);
          maxSize = 3;
        }
      } else if (
        currentCardData?.element &&
        currentCardData.element.offsetHeight
      ) {
        // Fallback height estimation
        maxSize = Math.max(
          1,
          Math.ceil(currentCardData.element.offsetHeight / 50),
        );
      }
    }
    logDebug("CONFIG", "Calculated card size:", maxSize);
    return Math.max(3, maxSize);
  }
}
