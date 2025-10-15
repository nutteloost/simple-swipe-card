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

    // Dropdown overflow management (added for v2.5.6 fix)
    this._dropdownFixApplied = false;
    this._dropdownListenerAdded = false;
    this._boundRestoreLayout = null;
    this._lastDropdownTrigger = null;

    // Initialize global dialog stack for picture-elements card support
    initializeGlobalDialogStack();

    // Bind event handlers
    this._handleConfigChanged = this._handleConfigChanged.bind(this);

    logDebug("INIT", "SimpleSwipeCard Constructor completed successfully.");
  }

  /**
   * LitElement lifecycle - called after first render
   * Handle one-time initialization for the wrapper card
   */
  firstUpdated() {
    logDebug("LIFECYCLE", "firstUpdated called for wrapper card");

    // Move the initial build logic here from connectedCallback
    if (!this.initialized && this._config?.cards) {
      logDebug("INIT", "firstUpdated: Initializing build.");

      // Use .then() to ensure the dropdown handler is attached only after the build is complete
      this.cardBuilder
        .build()
        .then(() => {
          // Check if the card is still connected to the DOM before attaching listeners
          if (this.isConnected) {
            logDebug(
              "LIFECYCLE",
              "Build finished in firstUpdated, setting up features",
            );
            this._handleDropdownOverflow();
          }
        })
        .catch((error) => {
          console.error(
            "SimpleSwipeCard: Build failed in firstUpdated:",
            error,
          );
          logDebug("ERROR", "Build failed, card may not function properly");
        });
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

    // PREVENT rebuilds during initial setup when building is in progress
    if (this.building) {
      logDebug(
        "VISIBILITY",
        "Skipping visibility update during build to prevent rebuild flicker",
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
   * Called when element is connected to DOM - simplified for proper lifecycle
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
            this._handleDropdownOverflow();
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

      logDebug(
        "LIFECYCLE",
        "About to call _handleDropdownOverflow (reconnection)",
      );
      this._handleDropdownOverflow();
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

    // Clean up dropdown restore timeout and listener
    if (this._dropdownRestoreTimeout) {
      clearTimeout(this._dropdownRestoreTimeout);
      this._dropdownRestoreTimeout = null;
    }

    if (this._clickRestoreListener && this.cardContainer) {
      this.cardContainer.removeEventListener(
        "click",
        this._clickRestoreListener,
        { capture: true },
      );
      this._clickRestoreListener = null;
    }

    // Clean up delay timeout
    if (this._dropdownDelayTimeout) {
      clearTimeout(this._dropdownDelayTimeout);
      this._dropdownDelayTimeout = null;
    }

    // If the card is removed while the fix is active, restore the layout.
    if (this._dropdownFixApplied) {
      this._restoreLayout();
    }
    // Remove the global event listener to prevent memory leaks.
    if (this._boundRestoreLayout) {
      window.removeEventListener("pointerdown", this._boundRestoreLayout, {
        capture: true,
      });
    }
    // Reset the flag so the listener can be re-added if the card reconnects.
    this._dropdownListenerAdded = false;

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
      () => this.recalculateLayout(), // ← Updated to use the new method
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

  /**
   * Click-controlled dropdown overflow fix.
   * Restores layout immediately after any user click (with micro-delay for selection processing).
   * @private
   */
  _handleDropdownOverflow() {
    if (!this.cardContainer || this._dropdownListenerAdded) return;
    this._dropdownListenerAdded = true;
    this._boundRestoreLayout = this._restoreLayout.bind(this);

    this.cardContainer.addEventListener(
      "pointerdown",
      (e) => {
        // DEBOUNCING: Prevent rapid successive triggers
        if (this._dropdownFixApplied) return;

        // Add a small debounce to prevent double-triggering
        const now = Date.now();
        if (
          this._lastDropdownTrigger &&
          now - this._lastDropdownTrigger < 100
        ) {
          return;
        }
        this._lastDropdownTrigger = now;

        const target = this._getActualEventTarget(e);
        if (!this._isDropdownTrigger(target)) return;

        logDebug(
          "SYSTEM",
          "Dropdown trigger detected. Applying layout fix with click-controlled restoration.",
        );
        this._dropdownFixApplied = true;

        // Clear any existing timeout
        if (this._dropdownRestoreTimeout) {
          clearTimeout(this._dropdownRestoreTimeout);
          this._dropdownRestoreTimeout = null;
        }

        // 1. Disable swipe gestures to prevent interaction conflicts.
        this.swipeGestures.removeGestures();

        // 2. Apply the layout fix
        if (this.sliderElement && this.cardContainer) {
          // Store original dimensions to prevent container collapse.
          const containerRect = this.cardContainer.getBoundingClientRect();
          const sliderRect = this.sliderElement.getBoundingClientRect();
          this._originalDimensions = {
            containerHeight: containerRect.height,
            sliderWidth: sliderRect.width,
          };
          // Explicitly set container height to prevent it from collapsing.
          this.cardContainer.style.height = `${this._originalDimensions.containerHeight}px`;

          // Store the original transform for later restoration.
          this._originalTransform = this.sliderElement.style.transform;

          // Calculate the current card position BEFORE applying any changes
          const currentCardIndex = this.currentIndex;

          let domPosition = currentCardIndex;

          if (
            this._config.loop_mode === "infinite" &&
            this.visibleCardIndices.length > 1
          ) {
            const duplicateCount = this.loopMode.getDuplicateCount();
            domPosition = currentCardIndex + duplicateCount;
          }

          // Apply CSS classes to hide adjacent cards
          this.sliderElement.classList.add("dropdown-fix-active");
          this.sliderElement.classList.add("dropdown-fix-active-hide-adjacent");

          // IMMEDIATELY clear the transform to prevent double-offset issue
          this.sliderElement.style.transform = "none";

          // Mark the correct slide as active and hide others
          const slides = this.sliderElement.querySelectorAll(".slide");

          slides.forEach((slide, index) => {
            if (index === domPosition) {
              slide.classList.add("current-active");
            } else {
              slide.classList.remove("current-active");
            }
          });

          // Apply absolute positioning to show the current card in the correct position
          // Since we cleared the transform, we need to position at 0,0 to show the current card
          this.sliderElement.style.position = "absolute";
          this.sliderElement.style.width = `${this._originalDimensions.sliderWidth}px`;
          this.sliderElement.style.left = "0px";
          this.sliderElement.style.top = "0px";
        }

        // 3. Allow overflow so the dropdown is visible outside the card's bounds.
        this.shadowRoot.host.style.overflow = "visible";
        this.cardContainer.style.overflow = "visible";

        // 4. Find and store the combobox element NOW (before shadow DOM makes it hard to find)
        const clickedElement = this._getActualEventTarget(e);
        let comboboxElement = null;

        // Walk up from the clicked element to find the combobox
        let current = clickedElement;
        for (
          let i = 0;
          i < 10 && current && current !== this.cardContainer;
          i++
        ) {
          if (
            current.getAttribute &&
            current.getAttribute("role") === "combobox"
          ) {
            comboboxElement = current;
            logDebug(
              "SYSTEM",
              "Found and stored combobox element for monitoring",
            );
            break;
          }
          current = current.parentElement;
        }

        // Store the combobox reference for the observer to use
        this._monitoredCombobox = comboboxElement;

        // 5. Add click-controlled restoration with delay to avoid catching the opening click
        // Store the timeout for cleanup
        this._dropdownDelayTimeout = setTimeout(() => {
          if (this._dropdownFixApplied && this.isConnected) {
            // Add isConnected check
            this._addClickRestoreListener();
            logDebug(
              "SYSTEM",
              "Click restoration listener added. Will restore after next click.",
            );
          }
        }, 300);

        logDebug(
          "SYSTEM",
          "Layout fix applied. Click listener will be added in 300ms.",
        );
      },
      { capture: true },
    );
  }

  /**
   * Monitors the dropdown state and restores when it closes
   * @private
   */
  _addClickRestoreListener() {
    if (!this.cardContainer) return;

    // Use the stored combobox element
    const combobox = this._monitoredCombobox;

    if (!combobox) {
      logDebug("SYSTEM", "No combobox stored, using fallback click listener");
      this._addFallbackClickListener();
      return;
    }

    logDebug(
      "SYSTEM",
      "Monitoring dropdown state via aria-expanded attribute on stored combobox",
    );

    // Use MutationObserver to watch for aria-expanded changes
    this._dropdownObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "aria-expanded") {
          const isExpanded = combobox.getAttribute("aria-expanded") === "true";

          if (!isExpanded) {
            logDebug(
              "SYSTEM",
              "Dropdown closed detected via aria-expanded=false, restoring layout",
            );

            // Cleanup observer
            if (this._dropdownObserver) {
              this._dropdownObserver.disconnect();
              this._dropdownObserver = null;
            }

            // Small delay to allow any final updates
            this._dropdownRestoreTimeout = setTimeout(() => {
              this._restoreLayout();
            }, 100);
          }
        }
      }
    });

    // Start observing
    this._dropdownObserver.observe(combobox, {
      attributes: true,
      attributeFilter: ["aria-expanded"],
    });
  }

  /**
   * Fallback click listener for dropdowns without combobox role
   * @private
   */
  _addFallbackClickListener() {
    if (!this.cardContainer) return;

    const restoreAfterClick = (e) => {
      logDebug(
        "SYSTEM",
        "Click detected (fallback), restoring layout in 200ms",
      );

      this.cardContainer.removeEventListener("click", restoreAfterClick, {
        capture: true,
      });

      this._dropdownRestoreTimeout = setTimeout(() => {
        this._restoreLayout();
      }, 200);
    };

    this.cardContainer.addEventListener("click", restoreAfterClick, {
      capture: true,
    });

    this._clickRestoreListener = restoreAfterClick;
  }

  /**
   * Restores the layout by removing all temporary styles, making all cards
   * visible again, and re-enabling gestures.
   * @private
   */
  _restoreLayout() {
    if (!this._dropdownFixApplied) return;

    // Prevent double restoration
    this._dropdownFixApplied = false;

    logDebug("SYSTEM", "Restoring layout and card visibility.");

    // Clean up timeout
    if (this._dropdownRestoreTimeout) {
      clearTimeout(this._dropdownRestoreTimeout);
      this._dropdownRestoreTimeout = null;
    }

    // Clean up click restore listener
    if (this._clickRestoreListener && this.cardContainer) {
      this.cardContainer.removeEventListener(
        "click",
        this._clickRestoreListener,
        { capture: true },
      );
      this._clickRestoreListener = null;
    }

    // Clean up dropdown observer
    if (this._dropdownObserver) {
      this._dropdownObserver.disconnect();
      this._dropdownObserver = null;
    }

    // Clear stored combobox reference
    this._monitoredCombobox = null;

    // 1. Restore the original layout styles.
    if (this.sliderElement && this.cardContainer) {
      // STEP 1: Disable transitions
      const originalTransition = this.sliderElement.style.transition;
      this.sliderElement.style.transition = "none";

      // STEP 2: Calculate and apply CORRECT transform (while still position: absolute)
      if (this._originalTransform !== undefined) {
        this._originalTransform = undefined;

        // Calculate the correct DOM position
        const totalVisibleCards = this.visibleCardIndices.length;
        const loopMode = this._config.loop_mode || "none";
        let domPosition = this.currentIndex;

        if (loopMode === "infinite" && totalVisibleCards > 1) {
          const duplicateCount = this.loopMode.getDuplicateCount();
          domPosition = this.currentIndex + duplicateCount;
        }

        // Calculate transform based on slide dimensions and spacing
        const cardSpacing = this._config.card_spacing || 0;
        const isHorizontal =
          (this._config.swipe_direction || "horizontal") === "horizontal";
        let translateAmount = 0;

        if (isHorizontal) {
          translateAmount = domPosition * (this.slideWidth + cardSpacing);
        } else {
          translateAmount = domPosition * (this.slideHeight + cardSpacing);
        }

        const axis = isHorizontal ? "X" : "Y";
        this.sliderElement.style.transform = `translate${axis}(-${translateAmount}px)`;

        logDebug(
          "SYSTEM",
          `Set correct transform: translate${axis}(-${translateAmount}px) for index ${this.currentIndex}`,
        );
      }

      // STEP 3: Clear positioning styles (transform is already correct)
      this.sliderElement.style.position = "";
      this.sliderElement.style.left = "";
      this.sliderElement.style.top = "";
      this.sliderElement.style.width = "";

      // STEP 4: Force reflow to ensure transform is applied
      this.sliderElement.offsetHeight;

      // STEP 5: NOW it's safe to make other cards visible
      this.sliderElement.classList.remove("dropdown-fix-active");
      this.sliderElement.classList.remove("dropdown-fix-active-hide-adjacent");

      // Remove current-active class from all slides
      const slides = this.sliderElement.querySelectorAll(".slide");
      slides.forEach((slide) => {
        slide.classList.remove("current-active");
      });

      // Clear container height
      this.cardContainer.style.height = "";
      this._originalDimensions = null;

      // STEP 6: Re-enable transitions after everything is in place
      requestAnimationFrame(() => {
        if (this.sliderElement) {
          this.sliderElement.style.transition = originalTransition || "";
        }
      });
    }

    // 2. Restore the original overflow clipping.
    this.shadowRoot.host.style.overflow = "";
    if (this.cardContainer) {
      this.cardContainer.style.overflow = "";
    }

    // 3. Re-enable swipe gestures after a brief delay.
    setTimeout(() => {
      if (this.isConnected) {
        if (this.visibleCardIndices.length > 1) {
          this.swipeGestures.addGestures();
          logDebug("SWIPE", "Swipe gestures re-enabled after dropdown restore");
        }
      }
      // Reset the debounce timer
      this._lastDropdownTrigger = null;
    }, 150);
  }

  /**
   * A more precise helper to determine if a clicked element is part of a dropdown menu.
   * Enhanced to properly detect mushroom-select-card components
   * @param {HTMLElement} element The element that was clicked.
   * @returns {boolean} True if the element is a dropdown trigger.
   * @private
   */
  _isDropdownTrigger(element) {
    if (!element) return false;

    // Check the element and its parents (increased depth for mushroom cards)
    let current = element;
    for (let i = 0; i < 8 && current && current !== this.cardContainer; i++) {
      const tagName = current.tagName?.toLowerCase();
      const className = current.className || "";
      const role = current.getAttribute && current.getAttribute("role");

      // Check for specific dropdown component tag names
      if (
        tagName === "ha-select" ||
        tagName === "mwc-select" ||
        tagName === "mushroom-select" ||
        tagName === "mushroom-select-card"
      ) {
        console.log("DROPDOWN_FIX: 🎯 Found dropdown tag:", tagName);
        return true;
      }

      // The 'combobox' role is a very reliable indicator of a dropdown activator
      if (role === "combobox") {
        console.log("DROPDOWN_FIX: 🎯 Found combobox role");
        return true;
      }

      // Check for Material Web Components classes
      if (current.classList?.contains("mdc-select")) {
        console.log("DROPDOWN_FIX: 🎯 Found mdc-select class");
        return true;
      }

      // Enhanced mushroom card detection
      if (typeof className === "string") {
        // Check for mushroom card classes
        if (
          className.includes("mushroom-select") ||
          className.includes("mushroom-card") ||
          className.includes("mdc-menu") ||
          className.includes("mdc-list-item") ||
          className.includes("mdc-select__anchor") ||
          className.includes("mdc-select__selected-text")
        ) {
          console.log("DROPDOWN_FIX: 🎯 Found mushroom/mdc class:", className);
          return true;
        }
      }

      // Check if current element has data attributes that suggest it's a select
      if (
        current.hasAttribute &&
        (current.hasAttribute("data-mdc-select") ||
          current.hasAttribute("aria-haspopup"))
      ) {
        console.log("DROPDOWN_FIX: 🎯 Found dropdown data attributes");
        return true;
      }

      current = current.parentElement;
    }

    // Additional check: look for mushroom-select-card ancestor
    let mushroomCard = element;
    while (mushroomCard && mushroomCard !== this.cardContainer) {
      if (mushroomCard.tagName?.toLowerCase() === "mushroom-select-card") {
        console.log("DROPDOWN_FIX: 🎯 Found mushroom-select-card ancestor");
        return true;
      }
      mushroomCard = mushroomCard.parentElement;
    }

    console.log(
      "DROPDOWN_FIX: ❌ No dropdown trigger detected for:",
      element.tagName,
      element.className,
    );
    return false;
  }

  /**
   * Gets the actual event target, accounting for Shadow DOM.
   * @param {Event} e The event object.
   * @returns {Element} The actual target element.
   * @private
   */
  _getActualEventTarget(e) {
    if (e.composedPath && e.composedPath().length) return e.composedPath()[0];
    return e.target;
  }
}
