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
import { AutoHeight } from "../features/AutoHeight.js";
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
    this._swipeDirection = "horizontal";

    // Pagination animation tracking
    this._previousIndex = undefined;
    this._previousWrappedIndex = undefined;

    // Card-mod support
    this._cardModConfig = null;
    this._cardModObserver = null;

    // UPDATED: Cache for OUR relevant entities (visibility/state sync only)
    this._cachedOurRelevantEntities = null;
    this._cachedConfigHash = null;

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
    this.autoHeight = new AutoHeight(this);

    // Child card visibility observer (for cards like bubble-card that manage their own visibility)
    this._childVisibilityObserver = null;
    this._childVisibilityDebounce = null;

    // Input focus tracking for auto-swipe pause
    this._inputFocusListener = null;
    this._inputBlurListener = null;

    // Initialize global dialog stack for picture-elements card support
    initializeGlobalDialogStack();

    // Bind event handlers
    this._handleConfigChanged = this._handleConfigChanged.bind(this);
    this._handleInputFocus = this._handleInputFocus.bind(this);
    this._handleInputBlur = this._handleInputBlur.bind(this);

    logDebug("INIT", "SimpleSwipeCard Constructor completed successfully.");
  }

  /**
   * LitElement lifecycle - called after first render
   * Handle one-time initialization for the wrapper card
   */
  async firstUpdated() {
    logDebug("LIFECYCLE", "firstUpdated called for wrapper card");

    // Move the initial build logic here from connectedCallback
    if (!this._firstUpdateCompleted && this._config?.cards) {
      this._firstUpdateCompleted = true;

      logDebug("INIT", "firstUpdated: Initializing build.");

      try {
        // Attempt to build - but it might be skipped if not connected
        const buildResult = await this.cardBuilder.build();

        // If build was skipped due to disconnection, it will be retried in connectedCallback
        if (buildResult === false) {
          logDebug(
            "LIFECYCLE",
            "Build was skipped in firstUpdated (likely disconnected) - will retry on connect",
          );
          return;
        }

        // Check if the card is still connected to the DOM before attaching listeners
        if (this.isConnected && this.cardContainer) {
          logDebug(
            "LIFECYCLE",
            "Build finished in firstUpdated, setting up features",
          );
        }
      } catch (error) {
        console.error("SimpleSwipeCard: Build failed in firstUpdated:", error);
        logDebug("ERROR", "Build failed, card may not function properly");
      }
    }
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

    // Clear cache when config changes
    this._clearOurRelevantEntitiesCache();

    if (!Array.isArray(this._config.cards)) this._config.cards = [];
    if (this._config.show_pagination === undefined)
      this._config.show_pagination = true;
    if (this._config.auto_hide_pagination === undefined) {
      this._config.auto_hide_pagination = 0; // Default: disabled
    } else {
      const autoHideValue = parseInt(this._config.auto_hide_pagination);
      if (isNaN(autoHideValue) || autoHideValue < 0) {
        this._config.auto_hide_pagination = 0; // Invalid values default to disabled
      } else {
        this._config.auto_hide_pagination = Math.min(autoHideValue, 30000); // Max 30 seconds
      }
    }
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

    // After setting swipe direction, check for grid options
    if (this._config.swipe_direction === "vertical" && !config.grid_options) {
      this.setAttribute("data-vertical-no-grid", "");
    } else {
      this.removeAttribute("data-vertical-no-grid");
    }

    // Detect if we're in editor mode to avoid applying layout fixes there
    if (
      this.closest("hui-card-preview") ||
      this.closest("hui-card-element-editor")
    ) {
      this.setAttribute("data-editor-mode", "");
    } else {
      this.removeAttribute("data-editor-mode");
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

    // Set default for auto_height
    if (this._config.auto_height === undefined) {
      this._config.auto_height = false;
    }

    // Validate auto_height compatibility - auto-delete if incompatible
    if (this._config.auto_height === true) {
      const isIncompatible =
        this._config.view_mode === "carousel" ||
        this._config.swipe_direction === "vertical" ||
        this._config.loop_mode === "infinite";

      if (isIncompatible) {
        delete this._config.auto_height;
        logDebug(
          "CONFIG",
          "auto_height removed: incompatible with current mode (carousel, vertical, or infinite loop)",
        );
      }
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

    // Initialize auto height AFTER all config is validated
    this.autoHeight?.initialize();

    // Fire initial config event
    this.requestUpdate();
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

      // Check if the actual card element has a "hidden" class
      // (for cards like bubble-card that manage their own visibility)
      let elementVisible = true;
      if (this.cards && this.cards[index]?.element) {
        const cardElement = this.cards[index].element;
        // Check if element has "hidden" class (bubble-card uses this)
        if (cardElement.classList?.contains("hidden")) {
          elementVisible = false;
          logDebug(
            "VISIBILITY",
            `Card ${index} has 'hidden' class from child card's own visibility logic`,
          );
        }
      }

      // Card is visible only if all conditions are met
      const isVisible =
        swipeCardVisible && conditionalCardVisible && elementVisible;

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

      // PREVENT rebuilds during initial setup or when already building
      if (this.building || !this.initialized) {
        logDebug(
          "VISIBILITY",
          "Skipping visibility rebuild during initial setup to prevent flicker",
        );
        return;
      }

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
      case "and": {
        // All nested conditions must be true
        if (!condition.conditions || !Array.isArray(condition.conditions)) {
          logDebug(
            "VISIBILITY",
            "Conditional card AND condition missing 'conditions' array",
          );
          return false;
        }

        if (condition.conditions.length === 0) {
          logDebug(
            "VISIBILITY",
            "Conditional card AND condition has empty 'conditions' array",
          );
          return true; // Empty AND is considered true
        }

        const result = condition.conditions.every((nestedCondition) => {
          try {
            return this._evaluateSingleCondition(nestedCondition);
          } catch (error) {
            logDebug(
              "VISIBILITY",
              "Error evaluating nested conditional card AND condition:",
              nestedCondition,
              error,
            );
            return false; // Fail the AND on any error
          }
        });

        logDebug(
          "VISIBILITY",
          `Conditional card AND condition result: ${result} (${condition.conditions.length} nested conditions)`,
        );
        return result;
      }

      case "or": {
        // At least one nested condition must be true
        if (!condition.conditions || !Array.isArray(condition.conditions)) {
          logDebug(
            "VISIBILITY",
            "Conditional card OR condition missing 'conditions' array",
          );
          return false;
        }

        if (condition.conditions.length === 0) {
          logDebug(
            "VISIBILITY",
            "Conditional card OR condition has empty 'conditions' array",
          );
          return false; // Empty OR is considered false
        }

        const result = condition.conditions.some((nestedCondition) => {
          try {
            return this._evaluateSingleCondition(nestedCondition);
          } catch (error) {
            logDebug(
              "VISIBILITY",
              "Error evaluating nested conditional card OR condition:",
              nestedCondition,
              error,
            );
            return false; // Ignore errors in OR, continue with other conditions
          }
        });

        logDebug(
          "VISIBILITY",
          `Conditional card OR condition result: ${result} (${condition.conditions.length} nested conditions)`,
        );
        return result;
      }

      case "not": {
        // The nested condition must be false
        if (!condition.condition) {
          logDebug(
            "VISIBILITY",
            "Conditional card NOT condition missing 'condition' property",
          );
          return false;
        }

        try {
          const nestedResult = this._evaluateSingleCondition(
            condition.condition,
          );
          const result = !nestedResult;
          logDebug(
            "VISIBILITY",
            `Conditional card NOT condition result: ${result} (nested was ${nestedResult})`,
          );
          return result;
        } catch (error) {
          logDebug(
            "VISIBILITY",
            "Error evaluating nested conditional card NOT condition:",
            condition.condition,
            error,
          );
          return false; // Default to false on error
        }
      }

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
            `Conditional card screen condition: ${media}, result: ${result}`,
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
              `Conditional card user condition: current user ${currentUser.id}, allowed users: ${condition.users}, result: ${result}`,
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
          `Unknown conditional card condition type: ${actualConditionType}`,
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
   * Sets the Home Assistant object (OPTIMIZED - Fixed for child card updates)
   * @param {Object} hass - Home Assistant object
   */
  set hass(hass) {
    if (!hass) {
      return;
    }

    // OPTIMIZATION 1: Skip if exact same object reference
    const oldHass = this._hass;
    if (oldHass === hass) {
      return;
    }

    // Store new hass reference
    this._hass = hass;

    // OPTIMIZATION 2: Check if states changed at all
    const hasStatesChanged = !oldHass || oldHass.states !== hass.states;
    const hasUIChanges =
      !oldHass ||
      oldHass.localize !== hass.localize ||
      oldHass.themes !== hass.themes ||
      oldHass.language !== hass.language;

    // OPTIMIZATION 3: Check if OUR relevant entities changed (for visibility/state sync)
    const hasOurRelevantChanges =
      hasStatesChanged && this._hasOurRelevantEntitiesChanged(oldHass, hass);

    // Skip visibility updates during seamless jump to prevent interference
    if (this._performingSeamlessJump) {
      logDebug(
        "LOOP",
        "Skipping hass-triggered visibility update during seamless jump",
      );
      // Always update children - they need to react to entity changes
      if (hasStatesChanged || hasUIChanges) {
        this._updateChildCardsHass(hass);
      }
      return;
    }

    // PREVENT rebuilds during initial setup when building is in progress
    if (this.building) {
      logDebug(
        "VISIBILITY",
        "Skipping visibility update during build to prevent rebuild flicker",
      );
      // Always update children - they need to react to entity changes
      if (hasStatesChanged || hasUIChanges) {
        this._updateChildCardsHass(hass);
      }
      return;
    }

    // OPTIMIZATION 4: Only update visibility if OUR relevant entities changed
    // (visibility conditions and state_entity)
    if (hasOurRelevantChanges) {
      logDebug("HASS", "Our relevant entities changed - updating visibility");

      // Clear any pending debounced updates
      if (this._visibilityUpdateTimeout) {
        clearTimeout(this._visibilityUpdateTimeout);
        this._visibilityUpdateTimeout = null;
      }

      // Update visibility when our entities change
      this._updateVisibleCardIndices();
    }

    // Notify state synchronization of hass changes when states changed
    if (hasStatesChanged) {
      this.stateSynchronization.onHassChange(oldHass, hass);
    }

    // ALWAYS update child cards when states or UI changes
    // (Child cards need to track their own entities)
    if (hasStatesChanged || hasUIChanges) {
      this._updateChildCardsHass(hass);
    }
  }

  /**
   * Checks if any of OUR relevant entities have changed
   * (Only entities used by Simple Swipe Card itself: state_entity, visibility conditions)
   * @param {Object} oldHass - Previous hass object
   * @param {Object} newHass - New hass object
   * @returns {boolean} True if any of our entities changed
   * @private
   */
  _hasOurRelevantEntitiesChanged(oldHass, newHass) {
    // First hass set
    if (!oldHass || !oldHass.states || !newHass.states) {
      return true;
    }

    // Get list of entities WE care about (not child cards)
    const ourEntities = this._getOurRelevantEntities();

    // If no relevant entities, no need to update visibility
    if (ourEntities.length === 0) {
      return false;
    }

    // Check if any of our entities changed
    for (const entityId of ourEntities) {
      const oldState = oldHass.states[entityId];
      const newState = newHass.states[entityId];

      // Entity added or removed
      if (!oldState !== !newState) {
        logDebug("HASS", `Our entity ${entityId} added/removed`);
        return true;
      }

      // Entity state or attributes changed
      if (
        oldState &&
        newState &&
        (oldState.state !== newState.state ||
          oldState.last_changed !== newState.last_changed)
      ) {
        logDebug(
          "HASS",
          `Our entity ${entityId} state changed: ${oldState.state} -> ${newState.state}`,
        );
        return true;
      }
    }

    return false;
  }

  /**
   * Gets the list of entity IDs that Simple Swipe Card uses directly
   * (NOT including entities used by child cards)
   * Results are cached for performance
   * @returns {Array<string>} Array of entity IDs
   * @private
   */
  _getOurRelevantEntities() {
    // Return cached list if config hasn't changed
    if (
      this._cachedOurRelevantEntities &&
      this._cachedConfigHash === this._getConfigHash()
    ) {
      return this._cachedOurRelevantEntities;
    }

    const entities = new Set();

    // Add state synchronization entity
    if (this._config.state_entity) {
      entities.add(this._config.state_entity);
    }

    // Add entities from visibility conditions
    if (this._config.cards && Array.isArray(this._config.cards)) {
      this._config.cards.forEach((cardConfig) => {
        if (cardConfig.visibility && Array.isArray(cardConfig.visibility)) {
          cardConfig.visibility.forEach((condition) => {
            if (condition.entity) {
              entities.add(condition.entity);
            }
          });
        }
      });
    }

    // Cache the results
    this._cachedOurRelevantEntities = Array.from(entities);
    this._cachedConfigHash = this._getConfigHash();

    if (this._cachedOurRelevantEntities.length > 0) {
      logDebug(
        "HASS",
        `Tracking ${this._cachedOurRelevantEntities.length} entities for visibility/state sync:`,
        this._cachedOurRelevantEntities,
      );
    }

    return this._cachedOurRelevantEntities;
  }

  /**
   * Gets a simple hash of the config to detect changes
   * @returns {string} Config hash
   * @private
   */
  _getConfigHash() {
    if (!this._config || !this._config.cards) {
      return "";
    }

    // Create a simple hash based on:
    // - Number of cards
    // - State entity
    // - Whether cards have visibility conditions
    const parts = [
      this._config.cards.length,
      this._config.state_entity || "",
      this._config.cards.filter((c) => c.visibility?.length > 0).length,
    ];

    return parts.join("|");
  }

  /**
   * Clears the cached relevant entities (call when config changes)
   * @private
   */
  _clearOurRelevantEntitiesCache() {
    this._cachedOurRelevantEntities = null;
    this._cachedConfigHash = null;
    logDebug("HASS", "Cleared our relevant entities cache");
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
   * Called when element is connected to DOM.
   * Handles reconnection scenarios and layout-card compatibility.
   */
  connectedCallback() {
    super.connectedCallback();

    logDebug("LIFECYCLE", "connectedCallback - simplified for wrapper card");

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

    // Check if we need to build
    // This handles the case where firstUpdated ran while disconnected
    const needsBuild =
      this._config &&
      this._config.cards &&
      this._config.cards.length > 0 &&
      !this.cardContainer;

    if (needsBuild) {
      logDebug(
        "LIFECYCLE",
        "Card needs build (firstUpdated may have run while disconnected) - triggering build",
      );

      // Defer build to next frame to ensure card is fully connected
      requestAnimationFrame(() => {
        if (this.isConnected) {
          logDebug("LIFECYCLE", "Executing deferred build after reconnection");
          this.cardBuilder
            .build()
            .then(() => {
              if (this.isConnected) {
                logDebug("LIFECYCLE", "Deferred build completed successfully");

                // BUGFIX: Explicitly reapply card-mod styles after rebuild
                // This ensures styles persist when navigating back to the dashboard
                if (this._cardModConfig) {
                  logDebug(
                    "CARD_MOD",
                    "Reapplying card-mod styles after deferred build",
                  );
                  this._applyCardModStyles();
                  this._setupCardModObserver();
                }
              }
            })
            .catch((error) => {
              console.error("SimpleSwipeCard: Deferred build failed:", error);
            });
        }
      });

      logDebug(
        "LIFECYCLE",
        "connectedCallback finished (deferred build scheduled)",
      );
      return;
    }

    // Check for reconnection scenario: we have cards/config but no DOM structure
    const isReconnection =
      this.cards &&
      this.cards.length > 0 &&
      !this.cardContainer &&
      this._config;

    if (isReconnection) {
      logDebug("LIFECYCLE", "Detected reconnection scenario - rebuilding card");

      // Trigger a complete rebuild since DOM structure was cleared
      this.cardBuilder
        .build()
        .then(() => {
          if (this.isConnected) {
            logDebug("LIFECYCLE", "Reconnection build completed");

            // BUGFIX: Explicitly reapply card-mod styles after rebuild
            // This ensures styles persist when navigating back to the dashboard
            if (this._cardModConfig) {
              logDebug(
                "CARD_MOD",
                "Reapplying card-mod styles after reconnection build",
              );
              this._applyCardModStyles();
              this._setupCardModObserver();
            }

            // Ensure pagination is created after reconnection
            requestAnimationFrame(() => {
              if (this.isConnected) {
                this.pagination.updateLayout();
              }
            });
          }
        })
        .catch((error) => {
          console.error("SimpleSwipeCard: Reconnection build failed:", error);
          logDebug("ERROR", "Reconnection build failed, swipe may not work");
        });
    } else if (this.initialized && this.cardContainer) {
      // Original reconnection logic for cases where DOM is still intact
      logDebug(
        "LIFECYCLE",
        "connectedCallback: Handling reconnection with intact DOM",
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

      // Re-create pagination after reconnection
      logDebug("LIFECYCLE", "Re-creating pagination after reconnection");
      requestAnimationFrame(() => {
        if (this.isConnected) {
          this.pagination.updateLayout();
        }
      });
    }

    logDebug("LIFECYCLE", "connectedCallback finished");
  }

  /**
   * Called when element is disconnected from DOM.
   */
  disconnectedCallback() {
    // Call the parent class's method first.
    super.disconnectedCallback();

    logDebug("INIT", "disconnectedCallback - Enhanced cleanup starting");

    // Mark that we're disconnecting to abort any ongoing builds
    const wasBuilding = this.building;
    if (wasBuilding) {
      logDebug("INIT", "Disconnecting during active build - aborting build");
      this.building = false;
    }

    // Safety mechanism: Clear any stuck seamless jump flag
    if (this._performingSeamlessJump) {
      logDebug("INIT", "Clearing stuck seamless jump flag on disconnect");
      this._performingSeamlessJump = false;
    }

    // Remove the config-changed event listener.
    this.removeEventListener(
      "config-changed",
      this._handleConfigChanged.bind(this),
    );

    try {
      // Clear all timeouts and intervals with better logging.
      this._clearAllTimeouts();

      // Clean up feature managers (but don't destroy core state).
      this._cleanupFeatureManagers();

      // Clean up DOM references and observers, but preserve cards array.
      this._cleanupDOMAndObservers();

      // Clean up card-mod observer.
      this._cleanupCardModObserver();

      // Clean up dropdown detection.
      this._cleanupDropdownDetection();

      // Clear any remaining event listeners.
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

      if (this.autoHeight) {
        this.autoHeight.cleanup();
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

    // Clean up child visibility observer
    this._cleanupChildVisibilityObserver();

    // Clean up mushroom-select observer
    if (this._mushroomSelectObserver) {
      this._mushroomSelectObserver.disconnect();
      this._mushroomSelectObserver = null;
      logDebug("MUSHROOM", "Mushroom-select observer cleaned up");
    }

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

    // Clean up input focus/blur listeners
    this._cleanupInputListeners();

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
   * Handle input focus event - pause auto-swipe while user is typing
   * @private
   */
  _handleInputFocus(e) {
    if (!this._config.enable_auto_swipe) return;

    // Check if the event originated from within this card
    const path = e.composedPath();
    if (!path.includes(this)) return;

    // Get the actual focused element (composedPath[0] gives us the real target across shadow DOM)
    const actualTarget = path[0];

    logDebug(
      "INPUT",
      `Focus event detected - e.target: ${e.target.tagName}, actualTarget: ${actualTarget.tagName}, isContentEditable: ${actualTarget.isContentEditable}`,
    );

    const isTextInput =
      actualTarget.tagName === "INPUT" ||
      actualTarget.tagName === "TEXTAREA" ||
      actualTarget.tagName === "SELECT" ||
      actualTarget.isContentEditable;

    if (isTextInput) {
      logDebug(
        "INPUT",
        `Text input focused (${actualTarget.tagName || "contenteditable"}) - pausing auto-swipe indefinitely`,
      );
      // Pause for a very long duration (1 hour) - will be cleared on blur
      this.autoSwipe.pause(3600000);
    }
  }

  /**
   * Handle input blur event - resume auto-swipe after user finishes typing
   * @private
   */
  _handleInputBlur(e) {
    if (!this._config.enable_auto_swipe) return;

    // Check if the event originated from within this card
    const path = e.composedPath();
    if (!path.includes(this)) return;

    // Get the actual blurred element (composedPath[0] gives us the real target across shadow DOM)
    const actualTarget = path[0];

    logDebug(
      "INPUT",
      `Blur event detected - e.target: ${e.target.tagName}, actualTarget: ${actualTarget.tagName}, isContentEditable: ${actualTarget.isContentEditable}`,
    );

    const isTextInput =
      actualTarget.tagName === "INPUT" ||
      actualTarget.tagName === "TEXTAREA" ||
      actualTarget.tagName === "SELECT" ||
      actualTarget.isContentEditable;

    if (isTextInput) {
      logDebug(
        "INPUT",
        `Text input blurred (${actualTarget.tagName || "contenteditable"}) - resuming auto-swipe`,
      );
      // Clear the pause and restart auto-swipe
      if (this.autoSwipe._autoSwipePauseTimer) {
        clearTimeout(this.autoSwipe._autoSwipePauseTimer);
        this.autoSwipe._autoSwipePauseTimer = null;
      }
      this.autoSwipe._autoSwipePaused = false;
      this.autoSwipe.start();
    }
  }

  /**
   * Setup event listeners for input focus/blur to pause auto-swipe
   * @private
   */
  _setupInputListeners() {
    if (this._inputFocusListener) {
      logDebug("INPUT", "Input listeners already set up, skipping");
      return;
    }

    logDebug(
      "INPUT",
      "Setting up input focus/blur listeners for auto-swipe pause on document",
    );

    // Listen on document with capture phase to catch all focus/blur events
    // This works across shadow DOM boundaries
    this._inputFocusListener = this._handleInputFocus;
    this._inputBlurListener = this._handleInputBlur;

    document.addEventListener("focusin", this._inputFocusListener, true);
    document.addEventListener("focusout", this._inputBlurListener, true);

    logDebug("INPUT", "Input listeners successfully attached to document");
  }

  /**
   * Cleanup input focus/blur event listeners
   * @private
   */
  _cleanupInputListeners() {
    if (this._inputFocusListener) {
      document.removeEventListener("focusin", this._inputFocusListener, true);
      this._inputFocusListener = null;
    }

    if (this._inputBlurListener) {
      document.removeEventListener("focusout", this._inputBlurListener, true);
      this._inputBlurListener = null;
    }

    logDebug("INPUT", "Cleaned up input focus/blur listeners from document");
  }

  /**
   * Sets up a ResizeObserver to handle container resizing
   * @private
   */
  _setupResizeObserver() {
    if (this.resizeObserver || !this.cardContainer) return;

    this.resizeObserver = setupResizeObserver(this.cardContainer, () =>
      this.recalculateLayout(),
    );
  }

  /**
   * Recalculates layout due to resize
   * @private
   */
  recalculateLayout() {
    if (!this.cardContainer || !this.isConnected) return;

    const newWidth = this.cardContainer.offsetWidth;
    const newHeight = this.cardContainer.offsetHeight;

    if (
      (newWidth > 0 && Math.abs(newWidth - this.slideWidth) > 1) ||
      (newHeight > 0 && Math.abs(newHeight - this.slideHeight) > 1)
    ) {
      logDebug("SYSTEM", "Recalculating layout due to resize.", {
        oldWidth: this.slideWidth,
        newWidth,
        oldHeight: this.slideHeight,
        newHeight,
      });
      this.slideWidth = newWidth;
      this.slideHeight = newHeight;
      this.updateSlider(false);
    }
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
   * Sets up observer for child card visibility changes
   * (for cards like bubble-card that manage their own visibility with "hidden" class)
   * @private
   */
  _setupChildVisibilityObserver() {
    // Clean up existing observer
    if (this._childVisibilityObserver) {
      this._childVisibilityObserver.disconnect();
      this._childVisibilityObserver = null;
    }

    if (!this.sliderElement || !this.cards || this.cards.length === 0) {
      return;
    }

    logDebug(
      "VISIBILITY",
      "Setting up child visibility observer for cards with self-managed visibility",
    );

    // Create observer to watch for class changes on card elements
    this._childVisibilityObserver = new MutationObserver((mutations) => {
      let hasVisibilityChange = false;

      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const target = mutation.target;
          // Check if this is a card element with visibility conditions
          const hasHiddenClass = target.classList?.contains("hidden");
          const hadHiddenClass = mutation.oldValue?.includes("hidden");

          if (hasHiddenClass !== hadHiddenClass) {
            hasVisibilityChange = true;
            logDebug(
              "VISIBILITY",
              "Child card visibility changed via 'hidden' class:",
              target.tagName,
            );
            break;
          }
        }
      }

      if (hasVisibilityChange) {
        // Debounce visibility updates
        if (this._childVisibilityDebounce) {
          clearTimeout(this._childVisibilityDebounce);
        }

        this._childVisibilityDebounce = setTimeout(() => {
          if (this.isConnected && !this.building) {
            logDebug(
              "VISIBILITY",
              "Triggering visibility update after child card visibility change",
            );
            this._updateVisibleCardIndices();
          }
          this._childVisibilityDebounce = null;
        }, 150);
      }
    });

    // Observe all card elements for class changes
    this.cards.forEach((cardData) => {
      if (cardData.element) {
        this._childVisibilityObserver.observe(cardData.element, {
          attributes: true,
          attributeFilter: ["class"],
          attributeOldValue: true,
        });
      }
    });
  }

  /**
   * Cleans up child visibility observer
   * @private
   */
  _cleanupChildVisibilityObserver() {
    if (this._childVisibilityObserver) {
      this._childVisibilityObserver.disconnect();
      this._childVisibilityObserver = null;
    }

    if (this._childVisibilityDebounce) {
      clearTimeout(this._childVisibilityDebounce);
      this._childVisibilityDebounce = null;
    }
  }

  /**
   * Navigates to a specific visible slide
   * @param {number} visibleIndex - The visible slide index to navigate to
   * @param {number} skipCount - Number of cards to skip (for animation duration)
   * @param {boolean} animate - Whether to animate the transition (defaults to true)
   */
  goToSlide(visibleIndex, skipCount = 1, animate = true) {
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

    // Pass animate parameter to updateSlider
    this.updateSlider(animate);

    // Update container height for auto height mode
    this.autoHeight?.updateForCurrentCard();

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
    // BUGFIX: Only recalculate dimensions if they're not properly initialized
    // This prevents race conditions where child cards (with aspect-ratio, etc.)
    // haven't fully rendered, causing incorrect transform calculations
    // We check both for zero and for obvious fallback values (300x100)
    if (this.cardContainer) {
      const isUninit = this.slideWidth === 0 || this.slideHeight === 0;
      const isFallback = this.slideWidth === 300 && this.slideHeight === 100;

      if (isUninit || isFallback) {
        const newWidth = this.cardContainer.offsetWidth;
        const newHeight = this.cardContainer.offsetHeight;

        // Only update if we got valid dimensions
        if (newWidth > 0 && newHeight > 0) {
          this.slideWidth = newWidth;
          this.slideHeight = newHeight;
          logDebug("SWIPE", "Recalculated dimensions in updateSlider:", {
            width: this.slideWidth,
            height: this.slideHeight,
            reason: isUninit ? "uninitialized" : "fallback",
          });
        }
      }
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
      let animationDuration = animate ? null : 0; // Let scheduleSeamlessJump read CSS duration

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
      this.pagination.update(animate);

      // Reset skip count
      this._lastSkipCount = 1;

      // Only schedule seamless jump if we're animating and have a valid duration
      if (animate && (animationDuration > 0 || animationDuration === null)) {
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

    if (loopMode === "infinite" && totalVisibleCards > 1) {
      // For single mode infinite, we need to offset by duplicateCount to show real cards
      const duplicateCount = this.loopMode.getDuplicateCount();
      domPosition = this.currentIndex + duplicateCount;

      logDebug(
        "SWIPE",
        `Infinite mode: logical index ${this.currentIndex} -> DOM position ${domPosition}`,
      );
    } else {
      // For non-infinite modes or single visible card, ensure currentIndex is valid
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
    let animationDuration = null; // Let scheduleSeamlessJump read CSS duration

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

    // Update active slide for vertical mode (allows dropdowns to overflow on active slide only)
    if (!isHorizontal) {
      if (animate) {
        // Clear any pending cleanup
        if (this._activeSlideTimeout) {
          clearTimeout(this._activeSlideTimeout);
        }

        // Get animation duration (default 300ms)
        let duration = 300;
        if (animationDuration && animationDuration > 0) {
          duration = animationDuration;
        } else if (this.sliderElement.isConnected) {
          const computedStyle = getComputedStyle(this.sliderElement);
          const speedValue = computedStyle
            .getPropertyValue("--simple-swipe-card-transition-speed")
            .trim();
          if (speedValue && speedValue.endsWith("s")) {
            duration = parseFloat(speedValue) * 1000;
          } else if (speedValue && speedValue.endsWith("ms")) {
            duration = parseFloat(speedValue);
          }
        }

        // DURING ANIMATION:
        // Add .animating class to enable container-level clipping
        // This clips at viewport boundaries so only one card visible during transition
        this.sliderElement.classList.add("animating");

        // AFTER ANIMATION:
        // Remove .animating class and update active slide
        this._activeSlideTimeout = setTimeout(() => {
          this.sliderElement.classList.remove("animating");
          this._updateActiveSlide(domPosition);
          this._activeSlideTimeout = null;
        }, duration);
      } else {
        // No animation, update immediately
        this.sliderElement.classList.remove("animating");
        this._updateActiveSlide(domPosition);
      }
    }

    // Remove any existing margins that could interfere with transparency
    removeCardMargins(this.cards);

    // Simple pagination update - no complex animation
    this.pagination.update(animate);

    // Reset skip count
    this._lastSkipCount = 1;

    logDebug(
      "SWIPE",
      `Slider updated, DOM position: ${domPosition}, transform: -${translateAmount}px along ${isHorizontal ? "X" : "Y"} axis`,
    );

    // Schedule seamless jump for infinite mode with proper timing
    // Only schedule if we're animating and have a valid duration
    if (animate && (animationDuration > 0 || animationDuration === null)) {
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
   * Updates the active slide class for vertical mode
   * This allows only the active slide to have dropdowns overflow while inactive slides are clipped
   * @param {number} activePosition - The DOM position of the active slide
   * @private
   */
  _updateActiveSlide(activePosition) {
    if (!this.sliderElement) return;

    // Get all slides
    const slides = this.sliderElement.querySelectorAll(".slide");
    if (slides.length === 0) return;

    // Remove active class from all slides and add to current active slide
    slides.forEach((slide, index) => {
      if (index === activePosition) {
        slide.classList.add("active-slide");
      } else {
        slide.classList.remove("active-slide");
      }
    });

    logDebug("SWIPE", `Active slide updated: position ${activePosition}`);
  }

  /**
   * Sets up dropdown detection to elevate z-index when dropdowns open
   * This ensures dropdowns from this card appear above other stacked simple-swipe-cards
   * @private
   */
  _setupDropdownDetection() {
    if (!this.shadowRoot) return;

    logDebug("DROPDOWN", "Setting up dropdown detection");

    // Track the number of open dropdowns
    this._openDropdownCount = 0;

    // Setup event listeners for common dropdown elements
    this._dropdownOpenHandler = (e) => {
      const target = e.target;
      const path = e.composedPath();

      // Check if event originated from within this card
      if (!path.includes(this)) return;

      logDebug("DROPDOWN", `Dropdown opened: ${target.tagName}`, target);
      this._handleDropdownOpen();
    };

    this._dropdownCloseHandler = (e) => {
      const target = e.target;
      const path = e.composedPath();

      // Check if event originated from within this card
      if (!path.includes(this)) return;

      logDebug("DROPDOWN", `Dropdown closed: ${target.tagName}`, target);
      this._handleDropdownClose();
    };

    // Listen for common dropdown events at the document level to catch all dropdowns
    // These events bubble through shadow DOM boundaries
    document.addEventListener("opened", this._dropdownOpenHandler, true);
    document.addEventListener("closed", this._dropdownCloseHandler, true);

    // Also listen for mwc-menu specific events
    document.addEventListener(
      "MDCMenuSurface:opened",
      this._dropdownOpenHandler,
      true,
    );
    document.addEventListener(
      "MDCMenuSurface:closed",
      this._dropdownCloseHandler,
      true,
    );

    // Monitor for dropdown elements being added to the DOM
    this._dropdownMutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;

          // Check for dropdown menu elements
          const isDropdown =
            node.tagName === "MWC-MENU" ||
            node.tagName === "HA-SELECT" ||
            node.tagName === "MUSHROOM-SELECT" ||
            node.classList?.contains("mdc-menu-surface") ||
            node.classList?.contains("mdc-select__menu");

          if (isDropdown && node.open) {
            logDebug(
              "DROPDOWN",
              "Dropdown element added to DOM and opened",
              node,
            );
            this._handleDropdownOpen();
          }
        });

        mutation.removedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;

          // Check if a dropdown was removed
          const isDropdown =
            node.tagName === "MWC-MENU" ||
            node.tagName === "HA-SELECT" ||
            node.tagName === "MUSHROOM-SELECT" ||
            node.classList?.contains("mdc-menu-surface") ||
            node.classList?.contains("mdc-select__menu");

          if (isDropdown) {
            logDebug("DROPDOWN", "Dropdown element removed from DOM", node);
            this._handleDropdownClose();
          }
        });
      });
    });

    // Observe the entire shadow root and any child cards
    this._dropdownMutationObserver.observe(this.shadowRoot, {
      childList: true,
      subtree: true,
    });

    logDebug("DROPDOWN", "Dropdown detection setup complete");
  }

  /**
   * Cleans up dropdown detection listeners and observers
   * @private
   */
  _cleanupDropdownDetection() {
    logDebug("DROPDOWN", "Cleaning up dropdown detection");

    // Remove event listeners
    if (this._dropdownOpenHandler) {
      document.removeEventListener("opened", this._dropdownOpenHandler, true);
      document.removeEventListener("closed", this._dropdownCloseHandler, true);
      document.removeEventListener(
        "MDCMenuSurface:opened",
        this._dropdownOpenHandler,
        true,
      );
      document.removeEventListener(
        "MDCMenuSurface:closed",
        this._dropdownCloseHandler,
        true,
      );
      this._dropdownOpenHandler = null;
      this._dropdownCloseHandler = null;
    }

    // Disconnect mutation observer
    if (this._dropdownMutationObserver) {
      this._dropdownMutationObserver.disconnect();
      this._dropdownMutationObserver = null;
    }

    // Reset counter and remove class
    this._openDropdownCount = 0;
    this.classList.remove("dropdown-open");

    logDebug("DROPDOWN", "Dropdown detection cleanup complete");
  }

  /**
   * Handles dropdown open event by increasing z-index
   * @private
   */
  _handleDropdownOpen() {
    this._openDropdownCount++;

    if (this._openDropdownCount === 1) {
      // First dropdown opened - elevate z-index
      this.classList.add("dropdown-open");
      logDebug("DROPDOWN", "Elevated z-index - dropdown opened");
    }
  }

  /**
   * Handles dropdown close event by restoring z-index
   * @private
   */
  _handleDropdownClose() {
    this._openDropdownCount = Math.max(0, this._openDropdownCount - 1);

    if (this._openDropdownCount === 0) {
      // All dropdowns closed - restore z-index
      this.classList.remove("dropdown-open");
      logDebug("DROPDOWN", "Restored z-index - all dropdowns closed");
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

    // ENHANCED: If we're still building, return a stable estimated size
    // This helps layout-card calculate layout correctly during initial load
    if (this.building) {
      // Try to get size from config height if available
      if (this._config.min_height) {
        const estimatedSize = Math.ceil(parseInt(this._config.min_height) / 50);
        logDebug(
          "CONFIG",
          "Building - estimated card size from min_height:",
          estimatedSize,
        );
        return estimatedSize;
      }

      // Return a reasonable default to prevent layout-card miscalculation
      logDebug("CONFIG", "Building - using default estimated size: 5");
      return 5;
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
