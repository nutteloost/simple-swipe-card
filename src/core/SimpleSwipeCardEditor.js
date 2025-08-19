/**
 * Editor class for the Simple Swipe Card with Visibility Support and Reset After
 * REFACTORED VERSION - Now uses manager classes for better separation of concerns
 */

import { LitElement, html } from "./Dependencies.js";
import { logDebug } from "../utils/Debug.js";
import { getEditorStyles } from "../ui/Styles.js";
import { getGlobalRegistry } from "../utils/EventHelpers.js";
import { GLOBAL_STATE } from "../utils/Constants.js";

// Import the manager classes
import { EditorUIManager } from "../ui/EditorUIManager.js";
import { EditorConfigManager } from "../ui/EditorConfigManager.js";
import { EditorCardManagement } from "../ui/EditorCardManagement.js";
import { EditorEventHandling } from "../ui/EditorEventHandling.js";

// Import rendering functions
import {
  renderInfoPanel,
  renderViewModeOptions,
  renderDisplayOptions,
  renderAdvancedOptions,
  renderCardsSection,
  renderCardPicker,
  renderVersionDisplay,
} from "../ui/EditorRenderers.js";

/**
 * Editor class for the Simple Swipe Card with Visibility Support and Reset After
 * @extends LitElement
 */
export class SimpleSwipeCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object, state: true },
      lovelace: { type: Object },
    };
  }

  static get styles() {
    return getEditorStyles();
  }

  constructor() {
    super();
    logDebug("EDITOR", "SimpleSwipeCardEditor Constructor invoked.");
    logDebug(
      "EDITOR",
      "Editor styles method available:",
      !!this.constructor.styles,
    );

    // Initialize manager instances
    this.uiManager = new EditorUIManager(this);
    this.configManager = new EditorConfigManager(this);
    this.cardManagement = new EditorCardManagement(this);
    this.eventHandling = new EditorEventHandling(this);

    // Initialize the editor UI
    this.uiManager.initializeEditor();
  }

  /**
   * Comprehensive event detection for element editors
   * Addresses inconsistent behavior with nested element editing
   * @param {Event} e - The event to check
   * @returns {boolean} True if the event is from an element editor
   * @private
   */
  _isElementEditorEvent(e) {
    return this.eventHandling._isElementEditorEvent(e);
  }

  /**
   * Checks if a dialog is related to an Actions Card being edited
   * @param {HTMLElement} dialog - Dialog element to check
   * @returns {boolean} True if it's an Actions Card dialog
   * @private
   */
  _isActionsCardDialog(dialog) {
    return this.eventHandling._isActionsCardDialog(dialog);
  }

  /**
   * Checks if a card config is a picture-elements card
   * @param {Object} config - Card configuration
   * @returns {boolean} True if it's a picture-elements card
   * @private
   */
  _isPictureElementsCard(config) {
    return this.cardManagement.isPictureElementsCard(config);
  }

  /**
   * Checks if a card has visibility conditions
   * @param {Object} config - Card configuration
   * @returns {boolean} True if the card has visibility conditions
   * @private
   */
  _hasVisibilityConditions(config) {
    return this.cardManagement.hasVisibilityConditions(config);
  }

  /**
   * Toggles a collapsible section
   * @param {string} section - Section name to toggle
   * @private
   */
  _toggleSection(section) {
    this.uiManager.toggleSection(section);
  }

  /**
   * Checks if a card configuration contains nested cards
   * @param {Object} cardConfig - The card configuration to check
   * @returns {boolean} True if the card has nested cards
   * @private
   */
  _hasNestedCards(cardConfig) {
    return this.cardManagement.hasNestedCards(cardConfig);
  }

  /**
   * Gets the nested cards from a card configuration
   * @param {Object} cardConfig - The card configuration
   * @returns {Array} Array of nested card configurations
   * @private
   */
  _getNestedCards(cardConfig) {
    return this.cardManagement.getNestedCards(cardConfig);
  }

  /**
   * Moves a nested card in the list
   * @param {number} parentIndex - The index of the parent card
   * @param {number} nestedIndex - The index of the nested card
   * @param {number} direction - The direction to move (-1 for up, 1 for down)
   * @private
   */
  _moveNestedCard(parentIndex, nestedIndex, direction) {
    this.cardManagement.moveNestedCard(parentIndex, nestedIndex, direction);
  }

  /**
   * Removes a nested card from the list
   * @param {number} parentIndex - The index of the parent card
   * @param {number} nestedIndex - The index of the nested card to remove
   * @private
   */
  _removeNestedCard(parentIndex, nestedIndex) {
    this.cardManagement.removeNestedCard(parentIndex, nestedIndex);
  }

  /**
   * Opens the edit dialog for a nested card
   * @param {number} parentIndex - The index of the parent card
   * @param {number} nestedIndex - The index of the nested card to edit
   * @private
   */
  async _editNestedCard(parentIndex, nestedIndex) {
    await this.cardManagement.editNestedCard(parentIndex, nestedIndex);
  }

  /**
   * Opens the edit dialog for a card
   * @param {number} index - The index of the card to edit
   * @private
   */
  async _editCard(index) {
    await this.cardManagement.editCard(index);
  }

  /**
   * Handles card selection from the picker
   * @param {Event} ev - The selection event
   * @private
   */
  _handleCardPicked(ev) {
    this.cardManagement.handleCardPicked(ev);
  }

  /**
   * Gets a descriptive name for a card configuration
   * @param {Object} cardConfig - The card configuration
   * @returns {Object} An object with type name and card name
   * @private
   */
  _getCardDescriptor(cardConfig) {
    return this.cardManagement.getCardDescriptor(cardConfig);
  }

  /**
   * Moves a card in the list
   * @param {number} index - The index of the card to move
   * @param {number} direction - The direction to move (-1 for up, 1 for down)
   * @private
   */
  _moveCard(index, direction) {
    this.cardManagement.moveCard(index, direction);
  }

  /**
   * Removes a card from the list
   * @param {number} index - The index of the card to remove
   * @private
   */
  _removeCard(index) {
    this.cardManagement.removeCard(index);
  }

  /**
   * Safely adds a card to the configuration without triggering editor replacement
   * @param {Object} cardConfig - Card configuration to add
   * @private
   */
  _safelyAddCard(cardConfig) {
    this.cardManagement.safelyAddCard(cardConfig);
  }

  /**
   * Ensures the card picker is loaded and visible
   * @private
   */
  _ensureCardPickerLoaded() {
    this.uiManager.ensureCardPickerLoaded();
  }

  setConfig(config) {
    this.configManager.setConfig(config);
  }

  _valueChanged(ev) {
    this.configManager.handleValueChanged(ev);
  }

  /**
   * Fires the config-changed event with proper identification
   * @param {Object} [extraData] - Additional data to include in the event
   * @private
   */
  _fireConfigChanged(extraData = {}) {
    this.configManager.fireConfigChanged(extraData);
  }

  /**
   * Renders the editor UI with extracted rendering functions
   * @returns {TemplateResult} The template to render
   */
  render() {
    if (!this.hass || !this._config) {
      return html`<ha-circular-progress
        active
        alt="Loading editor"
      ></ha-circular-progress>`;
    }

    // Safety check: if managers are null (during disconnection), show loading
    if (!this.uiManager || !this.configManager || !this.cardManagement) {
      return html`<ha-circular-progress
        active
        alt="Loading editor"
      ></ha-circular-progress>`;
    }

    const cards = this._config.cards || [];

    try {
      return html`
        <div class="card-config">
          ${renderInfoPanel()}
          ${renderViewModeOptions(this._config, this._valueChanged.bind(this))}
          ${renderDisplayOptions(this._config, this._valueChanged.bind(this))}
          ${renderAdvancedOptions(
            this._config,
            this.uiManager.getCollapsibleState(),
            this._valueChanged.bind(this),
            this._toggleSection.bind(this),
            cards,
            this._handleTimeoutChange.bind(this),
            this._handleTargetChange.bind(this),
            this.hass,
          )}
          ${renderCardsSection(
            cards,
            this.hass,
            this._moveCard.bind(this),
            this._editCard.bind(this),
            this._removeCard.bind(this),
            this._getCardDescriptor.bind(this),
            this._hasNestedCards.bind(this),
            this._getNestedCards.bind(this),
            this._hasVisibilityConditions.bind(this),
            this._moveNestedCard.bind(this),
            this._editNestedCard.bind(this),
            this._removeNestedCard.bind(this),
          )}
          ${renderCardPicker(
            this.hass,
            this.lovelace,
            this._boundHandleCardPicked,
          )}
          ${renderVersionDisplay()}
        </div>
      `;
    } catch (error) {
      console.error("Simple Swipe Card Editor render error:", error);
      return html`<div style="color: red; padding: 16px;">
        <strong>Editor Error:</strong> ${error.message} <br /><br />
        <small
          >Please refresh the page or restart Home Assistant if this
          persists.</small
        >
      </div>`;
    }
  }

  /**
   * Handles reset timeout changes
   * @param {Event} ev - The change event
   * @private
   */
  _handleTimeoutChange(ev) {
    this.configManager.handleTimeoutChange(ev);
  }

  /**
   * Handles reset target card changes
   * @param {Event} ev - The change event
   * @private
   */
  _handleTargetChange(ev) {
    this.configManager.handleTargetChange(ev);
  }

  /**
   * Handles auto-hide slider value changes
   * @param {Event} ev - Slider change event
   * @private
   */
  _autoHideSliderChanged(ev) {
    const value = parseFloat(ev.target.value) * 1000; // Convert to milliseconds
    this._config = {
      ...this._config,
      auto_hide_pagination: value,
    };
    this._configChanged();
  }

  // Ensure card picker is properly loaded
  async connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    logDebug("EDITOR", "SimpleSwipeCardEditor connectedCallback");

    try {
      // Ensure managers are initialized (they might be null after disconnectedCallback)
      if (!this.uiManager) {
        logDebug("EDITOR", "Reinitializing managers after reconnection");

        this.uiManager = new EditorUIManager(this);
        this.configManager = new EditorConfigManager(this);
        this.cardManagement = new EditorCardManagement(this);
        this.eventHandling = new EditorEventHandling(this);

        // Initialize the editor UI after manager creation
        this.uiManager.initializeEditor();
      }

      // Register this editor instance globally for state sharing
      const cardEditors = getGlobalRegistry(GLOBAL_STATE.cardEditors, "Set");
      cardEditors.add(this);

      // Try to load components, but don't fail if card picker isn't available
      try {
        await this.uiManager.ensureComponentsLoaded();
      } catch (error) {
        // Component loading failed, but editor can still function
        logDebug("EDITOR", "Warning: Could not load all components");
      }

      // Set up event handling with null check
      if (this.eventHandling?.setupEventListeners) {
        this.eventHandling.setupEventListeners();
      }

      // Load card picker with delay and null check
      setTimeout(() => {
        if (this.uiManager?.ensureCardPickerLoaded) {
          this.uiManager.ensureCardPickerLoaded();
        }
      }, 50);

      // Request a single render update
      this.requestUpdate();
    } catch (error) {
      console.error("Error during editor setup:", error);
      // Try to render anyway
      this.requestUpdate();
    }
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    logDebug("EDITOR", "SimpleSwipeCardEditor disconnectedCallback");

    try {
      // Clean up manager instances
      if (this.uiManager) {
        this.uiManager.cleanup();
        this.uiManager = null;
      }

      if (this.configManager) {
        this.configManager.cleanup();
        this.configManager = null;
      }

      // Clear other manager references
      this.cardManagement = null;
      this.eventHandling = null;

      // Clean up event listeners
      this.eventHandling?.removeEventListeners();

      // Clear editor-specific state
      if (this._activeChildEditors) {
        this._activeChildEditors.clear();
        this._activeChildEditors = null;
      }

      // Clear editor ID reference
      this._editorId = null;

      // DO NOT clear config reference - this is needed for reconnection
      // this._config = null; // <-- REMOVED this line

      // DO NOT clear hass reference - this might be needed for reconnection
      // this.hass = null; // <-- Don't clear this either
    } catch (error) {
      console.warn("Error during editor cleanup:", error);
    }

    // Unregister this editor from global registries
    try {
      const cardEditors = getGlobalRegistry(GLOBAL_STATE.cardEditors, "Set");
      cardEditors.delete(this);

      const editorRegistry = getGlobalRegistry(GLOBAL_STATE.editorRegistry);
      if (this._editorId) {
        editorRegistry.delete(this._editorId);
      }
    } catch (error) {
      console.warn("Error unregistering editor:", error);
    }

    logDebug("EDITOR", "SimpleSwipeCardEditor cleanup completed");
  }
}
