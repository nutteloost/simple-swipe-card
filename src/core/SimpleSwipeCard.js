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
import { LoopMode } from "../features/LoopMode.js";
import { SwipeBehavior } from "../features/SwipeBehavior.js";

/**
 * Main Simple Swipe Card class
 * @extends LitElement
 */
export class SimpleSwipeCard extends LitElement {
  constructor() {
    super();

    // LitElement should create shadowRoot automatically, but ensure it exists
    // This is needed because our build method runs before LitElement's first update
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      logDebug("INIT", "Created shadowRoot for manual DOM manipulation");
    }

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

    // Pagination animation tracking
    this._previousIndex = undefined;
    this._previousWrappedIndex = undefined;

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
    this.loopMode = new LoopMode(this);
    this.swipeBehavior = new SwipeBehavior(this);
    this._performingSeamlessJump = false;

    this._visibilityUpdateTimeout = null;
    this._visibilityRebuildTimeout = null;
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

    // Migrate enable_loopback to loop_mode
    if (
      this._config.enable_loopback !== undefined &&
      this._config.loop_mode === undefined
    ) {
      this._config.loop_mode = this._config.enable_loopback
        ? "loopback"
        : "none";
      delete this._config.enable_loopback;
      logDebug(
        "CONFIG",
        "Migrated enable_loopback to loop_mode:",
        this._config.loop_mode,
      );
    }

    // Set default for loop_mode
    if (this._config.loop_mode === undefined) {
      this._config.loop_mode = "none";
    }

    // Validate loop_mode
    if (!["none", "loopback", "infinite"].includes(this._config.loop_mode)) {
      logDebug(
        "CONFIG",
        "Invalid loop_mode, defaulting to 'none':",
        this._config.loop_mode,
      );
      this._config.loop_mode = "none";
    }

    // Initialize loop mode after config is set
    this.loopMode?.initialize();

    // Set default for swipe_direction
    if (
      this._config.swipe_direction === undefined ||
      !["horizontal", "vertical"].includes(this._config.swipe_direction)
    ) {
      this._config.swipe_direction = "horizontal";
    }

    // Set default for swipe_behavior and validate based on loop_mode
    if (this._config.swipe_behavior === undefined) {
      this._config.swipe_behavior = "single";
    }

    // Validate swipe_behavior - only allow "free" with infinite loop mode
    if (!["single", "free"].includes(this._config.swipe_behavior)) {
      this._config.swipe_behavior = "single";
    } else if (
      this._config.swipe_behavior === "free" &&
      this._config.loop_mode !== "infinite"
    ) {
      // Force to single if free is selected but not in infinite mode
      this._config.swipe_behavior = "single";
      logDebug(
        "CONFIG",
        "Free swipe behavior requires infinite loop mode, defaulting to single",
      );
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

    // Handle both card_min_width and cards_visible for backwards compatibility
    if (this._config.view_mode === "carousel") {
      // Set default for card_min_width (new responsive approach)
      if (this._config.card_min_width === undefined) {
        this._config.card_min_width = 200;
      } else {
        const minWidth = parseInt(this._config.card_min_width);
        if (isNaN(minWidth) || minWidth < 50 || minWidth > 500) {
          this._config.card_min_width = 200;
        }
      }

      // Handle legacy cards_visible for backwards compatibility
      if (this._config.cards_visible !== undefined) {
        // Validate cards_visible with better bounds
        const cardsVisible = parseFloat(this._config.cards_visible);
        if (isNaN(cardsVisible) || cardsVisible < 1.1 || cardsVisible > 8.0) {
          this._config.cards_visible = 2.5;
        } else {
          // Round to 1 decimal place to avoid precision issues
          this._config.cards_visible = Math.round(cardsVisible * 10) / 10;
        }
      }
      // If cards_visible is undefined, we'll use the responsive approach
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
   * Calculates cards visible from card_min_width (for responsive carousel)
   * @returns {number} Number of cards visible
   */
  _calculateCardsVisibleFromMinWidth() {
    if (!this.cardContainer) return 2.5; // Default fallback

    const containerWidth = this.cardContainer.offsetWidth;

    // SAFETY CHECK: If container not properly sized yet, use a reasonable default
    if (containerWidth <= 0) {
      logDebug(
        "LOOP",
        "Container width not available, using default cards_visible: 2.5",
      );
      return 2.5;
    }

    const minWidth = this._config.card_min_width || 200;
    const cardSpacing = Math.max(0, parseInt(this._config.card_spacing)) || 0;

    const rawCardsVisible =
      (containerWidth + cardSpacing) / (minWidth + cardSpacing);
    return Math.max(1.1, Math.round(rawCardsVisible * 10) / 10);
  }

  /**
   * Handles visibility changes from conditional cards (OPTIMIZED)
   * @private
   */
  _handleConditionalVisibilityChange() {
    logDebug("VISIBILITY", "Handling conditional card visibility change");

    if (this._conditionalVisibilityTimeout) {
      clearTimeout(this._conditionalVisibilityTimeout);
    }

    this._conditionalVisibilityTimeout = setTimeout(() => {
      this._updateVisibleCardIndicesWithConditional();
      this._conditionalVisibilityTimeout = null;
    }, 150);
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

      // Use debounced rebuild to prevent interference with card-mod
      this._scheduleVisibilityRebuild();
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
   * Schedules a debounced rebuild when visibility changes to prevent interference with card-mod
   * @private
   */
  _scheduleVisibilityRebuild() {
    // Clear any existing rebuild timeout
    if (this._visibilityRebuildTimeout) {
      clearTimeout(this._visibilityRebuildTimeout);
    }

    this._visibilityRebuildTimeout = setTimeout(() => {
      if (this.initialized && this.isConnected && !this.building) {
        logDebug(
          "VISIBILITY",
          "Performing debounced rebuild due to visibility changes",
        );
        this.cardBuilder.build();
      }
      this._visibilityRebuildTimeout = null;
    }, 300);
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
   * More aggressive debounced version
   * @private
   */
  _debounceVisibilityUpdate() {
    if (this._visibilityUpdateTimeout) {
      clearTimeout(this._visibilityUpdateTimeout);
    }

    this._visibilityUpdateTimeout = setTimeout(() => {
      this._updateVisibleCardIndices();
      this._visibilityUpdateTimeout = null;
    }, 200);
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
   * Sets the Home Assistant object (OPTIMIZED)
   * @param {Object} hass - Home Assistant object
   */
  set hass(hass) {
    if (!hass) {
      return;
    }

    // OPTIMIZATION: Better change detection - only process if hass has actually changed
    const oldHass = this._hass;
    if (oldHass === hass) {
      return; // Exact same object, no need to update
    }

    // OPTIMIZATION: More granular change detection
    const hasStatesChanged = !oldHass || oldHass.states !== hass.states;
    const hasUserChanged = !oldHass || oldHass.user !== hass.user;
    const hasConfigChanged =
      !oldHass ||
      JSON.stringify(oldHass.config) !== JSON.stringify(hass.config);

    if (!hasStatesChanged && !hasUserChanged && !hasConfigChanged) {
      // Only update child cards if nothing relevant changed
      this._updateChildCardsHass(hass);
      return;
    }

    // Only log when hass has actually changed
    logDebug("INIT", "Setting hass (changed)");
    this._hass = hass;

    // Notify state synchronization of hass change
    this.stateSynchronization?.onHassChange(oldHass, hass);

    // Skip visibility updates during seamless jump to prevent interference
    if (this._performingSeamlessJump) {
      logDebug(
        "LOOP",
        "Skipping hass-triggered visibility update during seamless jump",
      );
      this._updateChildCardsHass(hass);
      return;
    }

    // OPTIMIZATION: Only update visibility if states actually changed
    if (hasStatesChanged) {
      // Clear any pending debounced updates
      if (this._visibilityUpdateTimeout) {
        clearTimeout(this._visibilityUpdateTimeout);
        this._visibilityUpdateTimeout = null;
      }

      // Update visibility immediately when hass changes
      this._updateVisibleCardIndices();
    }

    // Update hass for all child cards
    this._updateChildCardsHass(hass);
  }

  /**
   * OPTIMIZATION: Separate method for updating child cards hass
   * @param {Object} hass - Home Assistant object
   * @private
   */
  _updateChildCardsHass(hass) {
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

    // Safety mechanism: Reset any stuck seamless jump flag
    if (this._performingSeamlessJump) {
      logDebug("INIT", "Clearing stuck seamless jump flag on connect");
      this._performingSeamlessJump = false;
    }

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
    logDebug("INIT", "disconnectedCallback - Enhanced cleanup starting");

    // Remove the config-changed event listener
    this.removeEventListener(
      "config-changed",
      this._handleConfigChanged.bind(this),
    );

    try {
      // Clear all timeouts and intervals with better logging
      this._clearAllTimeouts();

      // Clean up feature managers (but don't destroy core state)
      this._cleanupFeatureManagers();

      // Clean up DOM references and observers, but preserve cards array
      this._cleanupDOMAndObservers();

      // Clean up card-mod observer
      this._cleanupCardModObserver();

      // Clear any remaining event listeners
      this._clearRemainingEventListeners();
    } catch (error) {
      console.warn("Error during cleanup:", error);
    }

    this.initialized = false;
    logDebug("INIT", "disconnectedCallback - Enhanced cleanup completed");
  }

  /**
   * Clear all timeout references
   * @private
   */
  _clearAllTimeouts() {
    const timeouts = [
      "_visibilityRebuildTimeout",
      "_conditionalVisibilityTimeout",
      "_visibilityUpdateTimeout",
      "_layoutRetryCount",
    ];

    timeouts.forEach((timeoutName) => {
      if (this[timeoutName]) {
        clearTimeout(this[timeoutName]);
        this[timeoutName] = null;
        logDebug("INIT", `Cleared timeout: ${timeoutName}`);
      }
    });
  }

  /**
   * Enhanced feature manager cleanup (preserve state, stop activities)
   * @private
   */
  _cleanupFeatureManagers() {
    try {
      if (this.resizeObserver) {
        this.resizeObserver.cleanup();
        this.resizeObserver = null;
      }

      if (this.swipeGestures) {
        this.swipeGestures.removeGestures();
        // Clear any internal state flags but don't destroy the object
        this.swipeGestures._isDragging = false;
        this.swipeGestures._isScrolling = false;
      }

      if (this.autoSwipe) {
        this.autoSwipe.stop();
        // Clear internal timers
        this.autoSwipe._autoSwipeTimer = null;
        this.autoSwipe._autoSwipePauseTimer = null;
      }

      if (this.resetAfter) {
        this.resetAfter.stopTimer();
        // Clear internal timer but keep preserved state for restoration
        this.resetAfter._resetAfterTimer = null;
        // Keep _resetAfterPreservedState for potential reconnection
      }

      if (this.stateSynchronization) {
        this.stateSynchronization.stop();
      }

      logDebug("INIT", "Feature managers cleaned up (state preserved)");
    } catch (error) {
      console.warn("Error cleaning up feature managers:", error);
    }
  }

  /**
   * Clean up DOM references and observers without destroying card state
   * @private
   */
  _cleanupDOMAndObservers() {
    // Clear DOM references (but keep cards array intact for reconnection)
    this.cardContainer = null;
    this.sliderElement = null;

    // Clear pagination DOM references
    if (this.pagination && this.pagination.paginationElement) {
      this.pagination.paginationElement = null;
    }

    // Don't clear hass or config - keep them for reconnection
    // Don't clear cards array - preserve for reconnection

    logDebug(
      "INIT",
      "DOM references and observers cleaned up (cards preserved)",
    );
  }

  /**
   * Card-mod observer cleanup
   * @private
   */
  _cleanupCardModObserver() {
    if (this._cardModObserver) {
      try {
        this._cardModObserver.disconnect();
        this._cardModObserver = null;
        logDebug("CARD_MOD", "Card-mod observer cleaned up");
      } catch (error) {
        console.warn("Error cleaning up card-mod observer:", error);
      }
    }

    // Keep card-mod config for reconnection
    // this._cardModConfig = null; // Don't clear this
  }

  /**
   * Clear any remaining event listeners
   * @private
   */
  _clearRemainingEventListeners() {
    // Remove any click blocking timers from swipe gestures
    if (this.swipeGestures && this.swipeGestures._clickBlockTimer) {
      clearTimeout(this.swipeGestures._clickBlockTimer);
      this.swipeGestures._clickBlockTimer = null;
      this.swipeGestures._isClickBlocked = false;
    }

    // Clear any pending seamless jump operations
    if (this.loopMode && this.loopMode._pendingSeamlessJump) {
      clearTimeout(this.loopMode._pendingSeamlessJump);
      this.loopMode._pendingSeamlessJump = null;
      this._performingSeamlessJump = false;
    }

    logDebug("INIT", "Remaining event listeners cleared");
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
  goToSlide(visibleIndex, skipCount = 1) {
    // Store skip count for animation duration calculation
    this._lastSkipCount = skipCount;
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
    const loopMode = this._config.loop_mode || "none";

    // Handle loop mode navigation
    visibleIndex = this.loopMode.handleNavigation(
      visibleIndex,
      viewMode === "carousel",
    );
    this.currentIndex = visibleIndex;

    logDebug(
      "SWIPE",
      `Going to visible slide ${this.currentIndex} (${viewMode} mode)`,
    );

    // Notify state synchronization (use wrapped index for infinite mode)
    const stateIndex =
      loopMode === "infinite"
        ? ((this.currentIndex % totalVisibleCards) + totalVisibleCards) %
          totalVisibleCards
        : this.currentIndex;
    this.stateSynchronization?.onCardNavigate(stateIndex);

    this.updateSlider();

    // Handle reset-after timer for manual user interactions
    if (!this.autoSwipe.isInProgress && !this.resetAfter.isInProgress) {
      this.resetAfter.startTimer();
    }

    // Only pause auto-swipe for manual user interactions
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
    if (this.cardContainer) {
      this.slideWidth = this.cardContainer.offsetWidth;
      this.slideHeight = this.cardContainer.offsetHeight;
    }

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
    const viewMode = this._config.view_mode || "single";
    const loopMode = this._config.loop_mode || "none";

    // Handle carousel mode
    if (viewMode === "carousel" && this.carouselView) {
      // Set gap for carousel spacing
      this.sliderElement.style.gap = `${cardSpacing}px`;

      // Handle custom animation duration for free swipe behavior in carousel mode
      let animationDuration = animate ? 300 : 0; // Default, or 0 if not animating

      if (
        animate &&
        this._config.swipe_behavior === "free" &&
        this._lastSkipCount > 1
      ) {
        animationDuration = this.swipeBehavior.calculateAnimationDuration(
          this._lastSkipCount,
        );
        const easingFunction = this.swipeBehavior.getEasingFunction(
          this._lastSkipCount,
        );
        this.sliderElement.style.transition = `transform ${animationDuration}ms ${easingFunction}`;
        logDebug(
          "SWIPE",
          `Carousel multi-card animation: ${this._lastSkipCount} cards, ${animationDuration}ms duration, easing: ${easingFunction}`,
        );
      }

      this.carouselView.updateSliderPosition(this.currentIndex, animate);

      // Simple pagination update - no complex animation
      this.pagination.update();

      // Reset skip count
      this._lastSkipCount = 1;

      // Only schedule seamless jump if we're animating and have a valid duration
      if (animate && animationDuration > 0) {
        this.loopMode.scheduleSeamlessJump(
          this.currentIndex,
          animationDuration,
        );
      }
      return;
    }

    // Single mode logic
    const isHorizontal = this._swipeDirection === "horizontal";

    // Calculate the DOM position from the logical index
    let domPosition = this.currentIndex;

    if (loopMode === "infinite") {
      // For single mode infinite, we need to offset by duplicateCount to show real cards
      const duplicateCount = this.loopMode.getDuplicateCount();
      domPosition = this.currentIndex + duplicateCount;

      logDebug(
        "SWIPE",
        `Infinite mode: logical index ${this.currentIndex} -> DOM position ${domPosition}`,
      );
    } else {
      // For non-infinite modes, ensure currentIndex is valid
      if (loopMode !== "none" && totalVisibleCards > 1) {
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
      domPosition = this.currentIndex;
    }

    // Use gap for spacing instead of margins to maintain transparency
    this.sliderElement.style.gap = `${cardSpacing}px`;

    // Calculate transform amount based on DOM position
    let translateAmount = 0;
    if (isHorizontal) {
      translateAmount = domPosition * (this.slideWidth + cardSpacing);
    } else {
      translateAmount = domPosition * (this.slideHeight + cardSpacing);
    }

    // Handle custom animation duration for free swipe behavior
    let animationDuration = 300; // Default

    if (
      animate &&
      this._config.swipe_behavior === "free" &&
      this._lastSkipCount > 1
    ) {
      animationDuration = this.swipeBehavior.calculateAnimationDuration(
        this._lastSkipCount,
      );
      const easingFunction = this.swipeBehavior.getEasingFunction(
        this._lastSkipCount,
      );
      this.sliderElement.style.transition = `transform ${animationDuration}ms ${easingFunction}`;
      logDebug(
        "SWIPE",
        `Multi-card animation: ${this._lastSkipCount} cards, ${animationDuration}ms duration, easing: ${easingFunction}`,
      );
    } else {
      this.sliderElement.style.transition = this._getTransitionStyle(animate);
    }

    // Apply transform based on swipe direction
    if (isHorizontal) {
      this.sliderElement.style.transform = `translateX(-${translateAmount}px)`;
    } else {
      this.sliderElement.style.transform = `translateY(-${translateAmount}px)`;
    }

    // Remove any existing margins that could interfere with transparency
    removeCardMargins(this.cards);

    // Simple pagination update - no complex animation
    this.pagination.update();

    // Reset skip count
    this._lastSkipCount = 1;

    logDebug(
      "SWIPE",
      `Slider updated, DOM position: ${domPosition}, transform: -${translateAmount}px along ${isHorizontal ? "X" : "Y"} axis`,
    );

    // Schedule seamless jump for infinite mode with proper timing
    // Only schedule if we're animating and have a valid duration
    if (animate && animationDuration > 0) {
      this.loopMode.scheduleSeamlessJump(this.currentIndex, animationDuration);
    }
  }

  /**
   * Updates pagination dots manually for infinite mode
   * @param {number} activeIndex - The index that should be active
   * @private
   */
  _updatePaginationDots(activeIndex) {
    if (this.pagination.paginationElement) {
      const dots =
        this.pagination.paginationElement.querySelectorAll(".pagination-dot");
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === activeIndex);
      });
    }
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
