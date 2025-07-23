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
import { CarouselView } from "../features/CarouselView.js";

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
    this.carouselView = new CarouselView(this);

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
   * Sets the configuration for the editor
   * @param {Object} config - The configuration object
   */
  setConfig(config) {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    logDebug("EDITOR", "Editor setConfig received:", JSON.stringify(config));

    this._config = JSON.parse(JSON.stringify(config));
    if (!Array.isArray(this._config.cards)) this._config.cards = [];
    if (this._config.show_pagination === undefined)
      this._config.show_pagination = true;
    if (this._config.card_spacing === undefined) {
      this._config.card_spacing = 15;
    } else {
      const spacing = parseInt(this._config.card_spacing);
      this._config.card_spacing = isNaN(spacing) || spacing < 0 ? 15 : spacing;
    }
    // Set default for enable_loopback
    if (this._config.enable_loopback === undefined)
      this._config.enable_loopback = false;

    // Set default for swipe_direction
    if (
      this._config.swipe_direction === undefined ||
      !["horizontal", "vertical"].includes(this._config.swipe_direction)
    ) {
      this._config.swipe_direction = "horizontal";
    }

    // Set defaults for auto-swipe options
    if (this._config.enable_auto_swipe === undefined)
      this._config.enable_auto_swipe = false;
    if (this._config.auto_swipe_interval === undefined) {
      this._config.auto_swipe_interval = 2000;
    } else {
      this._config.auto_swipe_interval = parseInt(
        this._config.auto_swipe_interval,
      );
      if (
        isNaN(this._config.auto_swipe_interval) ||
        this._config.auto_swipe_interval < 500
      ) {
        this._config.auto_swipe_interval = 2000;
      }
    }

    // Set defaults for reset-after options
    if (this._config.enable_reset_after === undefined)
      this._config.enable_reset_after = false;
    if (this._config.reset_after_timeout === undefined) {
      this._config.reset_after_timeout = 30000; // 30 seconds default
    } else {
      // Ensure reset_after_timeout is a positive number (minimum 5 seconds)
      this._config.reset_after_timeout = parseInt(
        this._config.reset_after_timeout,
      );
      if (
        isNaN(this._config.reset_after_timeout) ||
        this._config.reset_after_timeout < 5000
      ) {
        this._config.reset_after_timeout = 30000;
      }
    }
    if (this._config.reset_target_card === undefined) {
      this._config.reset_target_card = 1; // Default to first card (1-based)
    } else {
      // Ensure it's a valid 1-based number
      this._config.reset_target_card = Math.max(
        1,
        parseInt(this._config.reset_target_card),
      );
    }

    // Set defaults for view mode options
    if (this._config.view_mode === undefined) {
      this._config.view_mode = "single";
    }

    // Validate view_mode
    if (!["single", "carousel"].includes(this._config.view_mode)) {
      this._config.view_mode = "single";
    }

    // Set default for cards_visible
    if (this._config.cards_visible === undefined) {
      this._config.cards_visible = 2.5;
    } else {
      // Validate cards_visible with better bounds
      const cardsVisible = parseFloat(this._config.cards_visible);
      if (isNaN(cardsVisible) || cardsVisible < 1.1 || cardsVisible > 8.0) {
        this._config.cards_visible = 2.5;
      } else {
        // Round to 1 decimal place to avoid precision issues
        this._config.cards_visible = Math.round(cardsVisible * 10) / 10;
      }
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

    // Store view mode for internal use
    this._viewMode = this._config.view_mode || "single";

    delete this._config.title;
  }

  /**
   * Handles visibility changes from conditional cards
   * @private
   */
  _handleConditionalVisibilityChange() {
    logDebug("VISIBILITY", "Handling conditional card visibility change");

    // Debounce multiple rapid changes
    if (this._conditionalVisibilityTimeout) {
      clearTimeout(this._conditionalVisibilityTimeout);
    }

    this._conditionalVisibilityTimeout = setTimeout(() => {
      this._updateVisibleCardIndicesWithConditional();
      this._conditionalVisibilityTimeout = null;
    }, 50);
  }

  /**
   * Updates visible card indices considering both Simple Swipe Card visibility conditions
   * and conditional card visibility states
   * @private
   */
  _updateVisibleCardIndicesWithConditional() {
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
      // Check Simple Swipe Card visibility conditions
      const swipeCardVisible = evaluateVisibilityConditions(
        cardConfig.visibility,
        this._hass,
      );

      // Check conditional card visibility if applicable
      let conditionalVisible = true;
      if (cardConfig.type === "conditional" && this.cards) {
        const cardData = this.cards.find(
          (card) => card && card.originalIndex === index,
        );
        if (cardData) {
          conditionalVisible = cardData.conditionallyVisible;
        }
      }

      // Card is visible if both conditions are met
      if (swipeCardVisible && conditionalVisible) {
        this.visibleCardIndices.push(index);
      }
    });

    // Only log and rebuild when visibility actually changes
    const hasChanged =
      JSON.stringify(previousVisibleIndices) !==
      JSON.stringify(this.visibleCardIndices);

    if (hasChanged) {
      logDebug(
        "VISIBILITY",
        `Visible cards changed: ${this.visibleCardIndices.length}/${this._config.cards.length} visible`,
        this.visibleCardIndices,
      );

      // Adjust current index and rebuild if necessary
      this._adjustCurrentIndexForVisibility(previousVisibleIndices);

      // Rebuild if connected and initialized
      if (this.initialized && this.isConnected) {
        this.cardBuilder.build();
      }
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
      // Check Simple Swipe Card's own visibility conditions
      const swipeCardVisible = evaluateVisibilityConditions(
        cardConfig.visibility,
        this._hass,
      );

      // Check conditional card conditions if this is a conditional card
      let conditionalCardVisible = true;
      if (cardConfig.type === "conditional" && cardConfig.conditions) {
        conditionalCardVisible = this._evaluateConditionalCardConditions(
          cardConfig.conditions,
        );
      }

      // Card is visible only if both conditions are met
      const isVisible = swipeCardVisible && conditionalCardVisible;

      if (isVisible) {
        this.visibleCardIndices.push(index);
      }
    });

    // Only log and rebuild when visibility actually changes
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

      // Trigger rebuild if initialized and connected
      if (this.initialized && this.isConnected) {
        logDebug("VISIBILITY", "Triggering rebuild due to visibility changes");
        this.cardBuilder.build();
      }
    }
  }

  /**
   * Evaluates conditional card conditions using the same logic as Home Assistant
   * @param {Array} conditions - Array of condition objects
   * @returns {boolean} True if all conditions are met
   * @private
   */
  _evaluateConditionalCardConditions(conditions) {
    if (!conditions || !Array.isArray(conditions) || conditions.length === 0) {
      return true; // No conditions means always visible
    }

    if (!this._hass) {
      return true; // Default to visible if we can't evaluate
    }

    // All conditions must be true (AND logic)
    return conditions.every((condition) => {
      try {
        return this._evaluateSingleCondition(condition);
      } catch (error) {
        logDebug(
          "VISIBILITY",
          "Error evaluating conditional card condition:",
          condition,
          error,
        );
        return true; // Default to visible on error
      }
    });
  }

  /**
   * Evaluates a single conditional card condition
   * @param {Object} condition - The condition to evaluate
   * @returns {boolean} True if the condition is met
   * @private
   */
  _evaluateSingleCondition(condition) {
    if (!condition || typeof condition !== "object") {
      return true;
    }

    const {
      condition: conditionType,
      entity,
      state,
      state_not,
      above,
      below,
    } = condition;

    // Handle shorthand format where condition type is implied
    // If no explicit condition type but we have entity + state/state_not, treat as state condition
    const actualConditionType =
      conditionType ||
      (entity && (state !== undefined || state_not !== undefined)
        ? "state"
        : null) ||
      (entity && (above !== undefined || below !== undefined)
        ? "numeric_state"
        : null);

    switch (actualConditionType) {
      case "state": {
        if (!entity || !this._hass.states[entity]) {
          logDebug(
            "VISIBILITY",
            `Entity ${entity} not found for conditional card state condition`,
          );
          return false;
        }

        const entityState = this._hass.states[entity].state;

        if (state !== undefined) {
          const expectedState = String(state);
          const actualState = String(entityState);
          const result = actualState === expectedState;
          logDebug(
            "VISIBILITY",
            `Conditional card state condition: ${entity} = ${actualState}, expected: ${expectedState}, result: ${result}`,
          );
          return result;
        }

        if (state_not !== undefined) {
          const notExpectedState = String(state_not);
          const actualState = String(entityState);
          const result = actualState !== notExpectedState;
          logDebug(
            "VISIBILITY",
            `Conditional card state not condition: ${entity} = ${actualState}, not expected: ${notExpectedState}, result: ${result}`,
          );
          return result;
        }

        return true;
      }

      case "numeric_state": {
        if (!entity || !this._hass.states[entity]) {
          logDebug(
            "VISIBILITY",
            `Entity ${entity} not found for conditional card numeric_state condition`,
          );
          return false;
        }

        const numericValue = parseFloat(this._hass.states[entity].state);
        if (isNaN(numericValue)) {
          return false;
        }

        let result = true;
        if (above !== undefined) {
          result = result && numericValue > parseFloat(above);
        }
        if (below !== undefined) {
          result = result && numericValue < parseFloat(below);
        }

        logDebug(
          "VISIBILITY",
          `Conditional card numeric state condition: ${entity} = ${numericValue}, result: ${result}`,
        );
        return result;
      }

      case "screen": {
        // Screen size conditions
        const media = condition.media_query;
        if (media && window.matchMedia) {
          const mediaQuery = window.matchMedia(media);
          const result = mediaQuery.matches;
          logDebug(
            "VISIBILITY",
            `Screen condition: ${media}, result: ${result}`,
          );
          return result;
        }
        return true;
      }

      case "user": {
        // User-based conditions
        if (condition.users && Array.isArray(condition.users)) {
          const currentUser = this._hass.user;
          if (currentUser && currentUser.id) {
            const result = condition.users.includes(currentUser.id);
            logDebug(
              "VISIBILITY",
              `User condition: current user ${currentUser.id}, allowed users: ${condition.users}, result: ${result}`,
            );
            return result;
          }
        }
        return true;
      }

      default:
        // If we can't determine the condition type, log it and default to not visible for safety
        if (entity) {
          logDebug(
            "VISIBILITY",
            `Unknown or invalid conditional card condition:`,
            condition,
          );
          return false; // Changed from true to false for safety
        }
        logDebug(
          "VISIBILITY",
          `Unknown condition type: ${actualConditionType}`,
        );
        return true; // Unknown conditions without entity default to visible
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

    // Update visibility immediately when hass changes
    if (oldHass !== hass) {
      // Clear any pending debounced updates
      if (this._visibilityUpdateTimeout) {
        clearTimeout(this._visibilityUpdateTimeout);
        this._visibilityUpdateTimeout = null;
      }

      // Update visibility immediately
      this._updateVisibleCardIndices();
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

    // Remove the config-changed event listener
    this.removeEventListener(
      "config-changed",
      this._handleConfigChanged.bind(this),
    );

    // Safely remove observers and gestures
    try {
      this.resizeObserver?.cleanup();
      this.swipeGestures?.removeGestures();
      this.autoSwipe?.stop();
      this.resetAfter?.stopTimer();
      this.stateSynchronization?.stop();

      // Clean up all timeout references
      if (this._visibilityRebuildTimeout) {
        clearTimeout(this._visibilityRebuildTimeout);
        this._visibilityRebuildTimeout = null;
      }

      if (this._conditionalVisibilityTimeout) {
        clearTimeout(this._conditionalVisibilityTimeout);
        this._conditionalVisibilityTimeout = null;
      }

      // Add missing visibility update timeout cleanup
      if (this._visibilityUpdateTimeout) {
        clearTimeout(this._visibilityUpdateTimeout);
        this._visibilityUpdateTimeout = null;
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

    const viewMode = this._config.view_mode || "single";

    // Handle loopback logic
    if (viewMode === "carousel" && this.carouselView) {
      visibleIndex = this.carouselView.handleLoopback(visibleIndex);
    } else {
      // Original loopback logic for both single mode and carousel fallback
      const loopbackEnabled = this._config.enable_loopback === true;

      if (loopbackEnabled && totalVisibleCards > 1) {
        if (visibleIndex < 0) {
          visibleIndex = totalVisibleCards - 1;
        } else if (visibleIndex >= totalVisibleCards) {
          visibleIndex = 0;
        }
      } else {
        // Clamp to valid range based on visible cards
        visibleIndex = Math.max(
          0,
          Math.min(visibleIndex, totalVisibleCards - 1),
        );
      }
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

    logDebug(
      "SWIPE",
      `Going to visible slide ${visibleIndex} (${viewMode} mode)`,
    );
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
      viewMode: this._config.view_mode,
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

    // Handle carousel mode
    const viewMode = this._config.view_mode || "single";
    if (viewMode === "carousel" && this.carouselView) {
      // Set gap for carousel spacing
      this.sliderElement.style.gap = `${cardSpacing}px`;
      this.carouselView.updateSliderPosition(this.currentIndex, animate);
      this.pagination.update();
      return;
    }

    // Original single mode logic
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
