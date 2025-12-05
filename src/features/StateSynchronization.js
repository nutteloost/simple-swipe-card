/**
 * State synchronization functionality for Simple Swipe Card
 * Provides two-way binding with Home Assistant input_select and input_number entities
 */

import { logDebug } from "../utils/Debug.js";

/**
 * State synchronization manager class
 */
export class StateSynchronization {
  constructor(cardInstance) {
    this.card = cardInstance;

    // State management
    this._stateEntity = null;
    this._entityType = null; // 'input_select' or 'input_number'
    this._lastEntityState = null;
    this._updatingFromCard = false; // Prevent infinite loops
    this._updateTimeout = null;

    // Bind event handlers for proper cleanup
    this._boundHandleEntityChange = this._handleEntityChange.bind(this);
  }

  /**
   * Manages the state synchronization based on configuration
   */
  manage() {
    if (!this.card.initialized || !this.card.isConnected) return;

    // Stop any existing synchronization
    this.stop();

    // Only enable if state_entity is configured and we have a valid hass object
    if (this.card._config.state_entity && this.card._hass) {
      // Check if state_entity is a template and evaluate it
      const rawStateEntity = this.card._config.state_entity;
      if (this.card.templateEvaluator?.isTemplate(rawStateEntity)) {
        this._stateEntity = this.card.templateEvaluator.getEvaluatedValue(
          "state_entity",
          this.card._hass,
        );
        logDebug(
          "STATE",
          `Evaluated state_entity template: "${rawStateEntity}" => "${this._stateEntity}"`,
        );
      } else {
        this._stateEntity = rawStateEntity;
      }

      // Validate entity exists and get its type
      if (this._stateEntity && this._validateEntity()) {
        logDebug(
          "STATE",
          "State synchronization enabled for entity:",
          this._stateEntity,
        );
        this._initializeSync();
      } else {
        logDebug("STATE", "Invalid or missing entity:", this._stateEntity);
        this._stateEntity = null;
      }
    } else {
      logDebug("STATE", "State synchronization disabled", {
        hasEntity: !!this.card._config.state_entity,
        hasHass: !!this.card._hass,
      });
    }
  }

  /**
   * Stops state synchronization
   */
  stop() {
    if (this._updateTimeout) {
      clearTimeout(this._updateTimeout);
      this._updateTimeout = null;
    }
    this._stateEntity = null;
    this._entityType = null;
    this._lastEntityState = null;
    this._updatingFromCard = false;
  }

  /**
   * Called when the card navigates to a new slide
   * Updates the entity state to match the card position
   * @param {number} visibleIndex - The visible card index (0-based)
   */
  onCardNavigate(visibleIndex) {
    if (!this._stateEntity || !this.card._hass || this._updatingFromCard) {
      return;
    }

    // Convert visible index to entity value
    const entityValue = this._mapCardIndexToEntityValue(visibleIndex);
    if (entityValue === null) return;

    // Check if the entity state is already correct
    const currentEntity = this.card._hass.states[this._stateEntity];
    if (currentEntity && currentEntity.state === entityValue) {
      logDebug("STATE", "Entity already at correct state:", entityValue);
      return;
    }

    logDebug("STATE", `Updating entity ${this._stateEntity} to:`, entityValue);

    // Set flag to prevent loop
    this._updatingFromCard = true;

    // Update the entity
    try {
      if (this._entityType === "input_select") {
        this.card._hass.callService("input_select", "select_option", {
          entity_id: this._stateEntity,
          option: entityValue,
        });
      } else if (this._entityType === "input_number") {
        this.card._hass.callService("input_number", "set_value", {
          entity_id: this._stateEntity,
          value: entityValue,
        });
      }

      // Store the expected state
      this._lastEntityState = entityValue;

      // Clear the flag after a short delay
      setTimeout(() => {
        this._updatingFromCard = false;
      }, 500);
    } catch (error) {
      logDebug("ERROR", "Failed to update entity:", error);
      this._updatingFromCard = false;
    }
  }

  /**
   * Validates that the configured entity exists and is compatible
   * @returns {boolean} True if entity is valid
   * @private
   */
  _validateEntity() {
    if (!this.card._hass || !this._stateEntity) return false;

    const entity = this.card._hass.states[this._stateEntity];
    if (!entity) {
      logDebug("STATE", "Entity not found:", this._stateEntity);
      return false;
    }

    // Determine entity type
    if (this._stateEntity.startsWith("input_select.")) {
      this._entityType = "input_select";

      // Validate that it has options
      if (
        !entity.attributes.options ||
        !Array.isArray(entity.attributes.options)
      ) {
        logDebug(
          "STATE",
          "input_select entity has no options:",
          this._stateEntity,
        );
        return false;
      }
    } else if (this._stateEntity.startsWith("input_number.")) {
      this._entityType = "input_number";
    } else {
      logDebug(
        "STATE",
        "Entity is not input_select or input_number:",
        this._stateEntity,
      );
      return false;
    }

    return true;
  }

  /**
   * Initializes synchronization by setting initial state
   * @private
   */
  _initializeSync() {
    if (!this.card._hass || !this._stateEntity) return;

    const entity = this.card._hass.states[this._stateEntity];
    if (!entity) return;

    // Store initial state
    this._lastEntityState = entity.state;

    // Check if card is already at the correct position (set during build)
    const targetIndex = this._mapEntityValueToCardIndex(entity.state);
    if (targetIndex !== null && targetIndex === this.card.currentIndex) {
      logDebug(
        "STATE",
        `Initial sync: card already at correct position ${targetIndex}, skipping initial positioning`,
      );
      return;
    }

    // Sync card to entity's current state if position is different
    if (targetIndex !== null && targetIndex !== this.card.currentIndex) {
      logDebug(
        "STATE",
        `Initial sync: setting card to index ${targetIndex} from entity state:`,
        entity.state,
      );

      // Temporarily pause auto-swipe during initial sync
      if (this.card._config.enable_auto_swipe) {
        this.card.autoSwipe?.pause(2000);
      }

      // Skip animation for initial sync to prevent scroll animation on load
      this.card.goToSlide(targetIndex, 1, false);
    }
  }

  /**
   * Handles entity state changes from Home Assistant
   * @private
   */
  _handleEntityChange() {
    if (!this.card._hass || !this._stateEntity || this._updatingFromCard) {
      return;
    }

    const entity = this.card._hass.states[this._stateEntity];
    if (!entity) return;

    const newState = entity.state;

    // Only process if state actually changed
    if (newState === this._lastEntityState) {
      return;
    }

    logDebug(
      "STATE",
      `Entity ${this._stateEntity} changed from "${this._lastEntityState}" to "${newState}"`,
    );
    this._lastEntityState = newState;

    // Convert entity state to card index
    const targetIndex = this._mapEntityValueToCardIndex(newState);
    if (targetIndex !== null && targetIndex !== this.card.currentIndex) {
      logDebug(
        "STATE",
        `Navigating to card index ${targetIndex} from entity change`,
      );

      // Pause auto-swipe during external navigation
      if (this.card._config.enable_auto_swipe) {
        this.card.autoSwipe?.pause(5000);
      }

      this.card.goToSlide(targetIndex);
    }
  }

  /**
   * Maps entity value to visible card index
   * @param {string|number} entityValue - The entity's current state
   * @returns {number|null} Visible card index (0-based) or null if invalid
   * @private
   */
  _mapEntityValueToCardIndex(entityValue) {
    if (this._entityType === "input_select") {
      const entity = this.card._hass.states[this._stateEntity];
      if (!entity || !entity.attributes.options) return null;

      const options = entity.attributes.options;
      const optionIndex = options.indexOf(entityValue);

      if (optionIndex === -1) {
        logDebug(
          "STATE",
          `Option "${entityValue}" not found in input_select options:`,
          options,
        );
        return null;
      }

      // Check if this index is within visible cards range
      if (optionIndex >= this.card.visibleCardIndices.length) {
        logDebug(
          "STATE",
          `Option index ${optionIndex} exceeds visible cards count ${this.card.visibleCardIndices.length}`,
        );
        return null;
      }

      return optionIndex;
    } else if (this._entityType === "input_number") {
      const numValue = parseInt(entityValue);
      if (isNaN(numValue)) return null;

      // Convert from 1-based to 0-based index
      const cardIndex = numValue - 1;

      // Check if index is within visible cards range
      if (cardIndex < 0 || cardIndex >= this.card.visibleCardIndices.length) {
        logDebug(
          "STATE",
          `Index ${cardIndex} is outside visible cards range [0, ${this.card.visibleCardIndices.length - 1}]`,
        );
        return null;
      }

      return cardIndex;
    }

    return null;
  }

  /**
   * Maps visible card index to entity value
   * @param {number} visibleIndex - Visible card index (0-based)
   * @returns {string|number|null} Entity value or null if invalid
   * @private
   */
  _mapCardIndexToEntityValue(visibleIndex) {
    if (
      visibleIndex < 0 ||
      visibleIndex >= this.card.visibleCardIndices.length
    ) {
      return null;
    }

    if (this._entityType === "input_select") {
      const entity = this.card._hass.states[this._stateEntity];
      if (!entity || !entity.attributes.options) return null;

      const options = entity.attributes.options;

      // Check if we have enough options
      if (visibleIndex >= options.length) {
        logDebug(
          "STATE",
          `Card index ${visibleIndex} exceeds input_select options count ${options.length}`,
        );
        return null;
      }

      return options[visibleIndex];
    } else if (this._entityType === "input_number") {
      // Convert from 0-based to 1-based index
      return visibleIndex + 1;
    }

    return null;
  }

  /**
   * Called when hass object changes to detect entity state changes
   * @param {Object} oldHass - Previous hass object
   * @param {Object} newHass - New hass object
   */
  onHassChange(oldHass, newHass) {
    if (!this._stateEntity || !newHass) return;

    // Check if our entity's state changed
    const oldEntity = oldHass?.states[this._stateEntity];
    const newEntity = newHass.states[this._stateEntity];

    if (!newEntity) {
      logDebug(
        "STATE",
        "Configured entity no longer exists:",
        this._stateEntity,
      );
      this.stop();
      return;
    }

    // If entity state changed, handle it
    if (!oldEntity || oldEntity.state !== newEntity.state) {
      // Use a small delay to debounce rapid changes
      if (this._updateTimeout) {
        clearTimeout(this._updateTimeout);
      }

      this._updateTimeout = setTimeout(() => {
        this._handleEntityChange();
        this._updateTimeout = null;
      }, 100);
    }
  }
}
