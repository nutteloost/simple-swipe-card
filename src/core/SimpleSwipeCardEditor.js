/**
 * Editor class for the Simple Swipe Card with Visibility Support and Reset After
 */

import { LitElement, html } from "./Dependencies.js";
import { DEBUG } from "../utils/Constants.js";
import { logDebug } from "../utils/Debug.js";
import { GLOBAL_STATE } from "../utils/Constants.js";
import { getEditorStyles } from "../ui/Styles.js";
import {
  fireConfigChanged,
  fireHAEvent,
  getGlobalRegistry,
} from "../utils/EventHelpers.js";
import {
  renderInfoPanel,
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
export class SimpleSwipeCardEditor extends (LitElement || HTMLElement) {
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

    // Only manually attach shadow if not using LitElement
    if (!this.shadowRoot && this.constructor === HTMLElement) {
      this.attachShadow({ mode: "open" });
    }

    logDebug("EDITOR", "SimpleSwipeCardEditor Constructor invoked.");
    logDebug(
      "EDITOR",
      "Editor styles method available:",
      !!this.constructor.styles,
    );

    // Generate a unique ID for this editor instance
    this._editorId = `swipe-card-editor-${Math.random().toString(36).substring(2, 15)}`;
    this._boundHandleCardPicked = this._handleCardPicked.bind(this);
    this._boundHandleNestedCardEvents = this._handleNestedCardEvents.bind(this);

    // Track active child editor dialogs
    this._activeChildEditors = new Set();

    // Track if we've detected a card-picker selection
    this._lastCardPickerSelection = null;
    this._ignoreNextCardPicker = false;

    // Track element editor state
    this._elementEditSession = {
      active: false,
      parentDialogId: null,
      elementId: null,
      timestamp: null,
      savedState: null,
    };

    // Collapsible sections state
    this._collapsibleState = {
      advanced: false, // Advanced options collapsed by default
      cards: true, // Cards section expanded by default
    };

    // Create a registry of all editors and dialogs
    const editorRegistry = getGlobalRegistry(GLOBAL_STATE.editorRegistry);
    editorRegistry.set(this._editorId, this);
  }

  /**
   * Comprehensive event detection for element editors
   * Addresses inconsistent behavior with nested element editing
   * @param {Event} e - The event to check
   * @returns {boolean} True if the event is from an element editor
   * @private
   */
  _isElementEditorEvent(e) {
    // First check: Look for obvious markers in the event
    if (e.detail) {
      if (
        e.detail.fromElementEditor ||
        e.detail.elementConfig ||
        e.detail.elementToEdit ||
        e.detail.element
      ) {
        logDebug("ELEMENT", "Element editor detected through event detail");
        return true;
      }
    }

    // Second check: Examine event path for element editor components
    const path = e.composedPath ? e.composedPath() : [];
    for (const node of path) {
      if (!node || !node.localName) continue;

      // Direct tag name checks
      if (
        node.localName === "hui-element-editor" ||
        node.localName === "hui-dialog-edit-element" ||
        node.localName.includes("element-editor")
      ) {
        logDebug(
          "ELEMENT",
          "Element editor detected through path node localName:",
          node.localName,
        );
        return true;
      }

      // Check for specialized attributes or properties
      if (
        node._elementEditor ||
        node._isElementEditor ||
        (node.getAttribute &&
          (node.getAttribute("element-id") ||
            node.getAttribute("data-element-id"))) ||
        (node.classList && node.classList.contains("element-editor"))
      ) {
        logDebug(
          "ELEMENT",
          "Element editor detected through specialized attributes",
        );
        return true;
      }

      // Look for picture-elements specific dialogs
      if (
        node.tagName === "HUI-DIALOG" &&
        (node.querySelector(".element-editor") ||
          (node._title &&
            typeof node._title === "string" &&
            node._title.toLowerCase().includes("element")))
      ) {
        logDebug(
          "ELEMENT",
          "Element editor detected through hui-dialog with element editor content",
        );
        return true;
      }
    }

    // Third check: Examine the event characteristics
    if (
      e.type === "element-updated" ||
      (e.type === "config-changed" &&
        e.target &&
        (e.target.localName === "hui-element-editor" ||
          e.target.closest("hui-element-editor")))
    ) {
      logDebug(
        "ELEMENT",
        "Element editor detected through event characteristics",
      );
      return true;
    }

    // Check if this event happens during an active element editing session
    if (
      this._elementEditSession.active &&
      Date.now() - this._elementEditSession.timestamp < 5000
    ) {
      // 5 second window
      logDebug(
        "ELEMENT",
        "Element editor event detected through active editing session",
      );
      return true;
    }

    return false;
  }

  /**
   * Checks if a dialog is related to an Actions Card being edited
   * @param {HTMLElement} dialog - Dialog element to check
   * @returns {boolean} True if it's an Actions Card dialog
   * @private
   */
  _isActionsCardDialog(dialog) {
    if (!dialog) return false;

    // Check if this dialog has our marker
    if (dialog._editingActionsCard) return true;

    // Check the card type being edited
    try {
      const cardConfig = dialog.cardConfig;
      return cardConfig && cardConfig.type === "custom:actions-card";
    } catch (e) {
      return false;
    }
  }

  /**
   * Checks if a card config is a picture-elements card
   * @param {Object} config - Card configuration
   * @returns {boolean} True if it's a picture-elements card
   * @private
   */
  _isPictureElementsCard(config) {
    return config && config.type === "picture-elements";
  }

  /**
   * Checks if a card has visibility conditions
   * @param {Object} config - Card configuration
   * @returns {boolean} True if the card has visibility conditions
   * @private
   */
  _hasVisibilityConditions(config) {
    return (
      config && Array.isArray(config.visibility) && config.visibility.length > 0
    );
  }

  /**
   * Toggles a collapsible section
   * @param {string} section - Section name to toggle
   * @private
   */
  _toggleSection(section) {
    this._collapsibleState[section] = !this._collapsibleState[section];
    this.requestUpdate();
  }

  /**
   * Checks if a card configuration contains nested cards
   * @param {Object} cardConfig - The card configuration to check
   * @returns {boolean} True if the card has nested cards
   * @private
   */
  _hasNestedCards(cardConfig) {
    // Check for action-card with card property
    if (cardConfig.type === "custom:actions-card" && cardConfig.card) {
      return Array.isArray(cardConfig.card)
        ? cardConfig.card.length > 0
        : !!cardConfig.card;
    }
    return false;
  }

  /**
   * Gets the nested cards from a card configuration
   * @param {Object} cardConfig - The card configuration
   * @returns {Array} Array of nested card configurations
   * @private
   */
  _getNestedCards(cardConfig) {
    if (!this._hasNestedCards(cardConfig)) return [];
    return Array.isArray(cardConfig.card) ? cardConfig.card : [cardConfig.card];
  }

  /**
   * Moves a nested card in the list
   * @param {number} parentIndex - The index of the parent card
   * @param {number} nestedIndex - The index of the nested card
   * @param {number} direction - The direction to move (-1 for up, 1 for down)
   * @private
   */
  _moveNestedCard(parentIndex, nestedIndex, direction) {
    if (!this._config?.cards || !this._config.cards[parentIndex]) return;

    const parentCard = this._config.cards[parentIndex];
    if (!this._hasNestedCards(parentCard)) return;

    const nestedCards = this._getNestedCards(parentCard);
    const newNestedIndex = nestedIndex + direction;

    if (newNestedIndex < 0 || newNestedIndex >= nestedCards.length) return;

    logDebug(
      "EDITOR",
      `Moving nested card ${parentIndex}.${nestedIndex} to position ${parentIndex}.${newNestedIndex}`,
    );

    // Swap the cards
    [nestedCards[nestedIndex], nestedCards[newNestedIndex]] = [
      nestedCards[newNestedIndex],
      nestedCards[nestedIndex],
    ];

    // Update the configuration
    const updatedCards = [...this._config.cards];
    updatedCards[parentIndex] = { ...parentCard, card: nestedCards };
    this._config = { ...this._config, cards: updatedCards };

    this._fireConfigChanged();
    this.requestUpdate();
  }

  /**
   * Removes a nested card from the list
   * @param {number} parentIndex - The index of the parent card
   * @param {number} nestedIndex - The index of the nested card to remove
   * @private
   */
  _removeNestedCard(parentIndex, nestedIndex) {
    if (!this._config?.cards || !this._config.cards[parentIndex]) return;

    const parentCard = this._config.cards[parentIndex];
    if (!this._hasNestedCards(parentCard)) return;

    let nestedCards = this._getNestedCards(parentCard);
    if (nestedIndex < 0 || nestedIndex >= nestedCards.length) return;

    logDebug("EDITOR", `Removing nested card ${parentIndex}.${nestedIndex}`);

    // Remove the card
    nestedCards = nestedCards.filter((_, i) => i !== nestedIndex);

    // Update the configuration
    const updatedCards = [...this._config.cards];
    updatedCards[parentIndex] = { ...parentCard, card: nestedCards };
    this._config = { ...this._config, cards: updatedCards };

    this._fireConfigChanged();
    this.requestUpdate();
  }

  /**
   * Opens the edit dialog for a nested card
   * @param {number} parentIndex - The index of the parent card
   * @param {number} nestedIndex - The index of the nested card to edit
   * @private
   */
  async _editNestedCard(parentIndex, nestedIndex) {
    logDebug(
      "EDITOR",
      `_editNestedCard called for parent ${parentIndex}, nested ${nestedIndex}`,
    );
    if (
      !this._config?.cards ||
      !this._config.cards[parentIndex] ||
      !this._hasNestedCards(this._config.cards[parentIndex])
    ) {
      logDebug(
        "ERROR",
        "SimpleSwipeCardEditor: Invalid indices for nested card editing:",
        parentIndex,
        nestedIndex,
      );
      return;
    }

    const parentCard = this._config.cards[parentIndex];
    const nestedCards = this._getNestedCards(parentCard);
    if (nestedIndex < 0 || nestedIndex >= nestedCards.length) return;

    const cardConfig = nestedCards[nestedIndex];
    const hass = this.hass;
    const mainApp = document.querySelector("home-assistant");

    if (!hass || !mainApp) {
      logDebug(
        "ERROR",
        "SimpleSwipeCardEditor: Cannot find Home Assistant instance",
      );
      return;
    }

    try {
      await customElements.whenDefined("hui-dialog-edit-card");

      const dialog = document.createElement("hui-dialog-edit-card");
      dialog.hass = hass;

      document.body.appendChild(dialog);
      this._activeChildEditors.add(dialog);
      dialog._parentEditorId = this._editorId;

      // Add special attributes for picture-elements cards to enhance tracking
      if (this._isPictureElementsCard(cardConfig)) {
        dialog.setAttribute("data-editing-picture-elements", "true");
        dialog._editingPictureElements = true;
      }

      // Add element editor detection
      dialog.addEventListener(
        "config-changed",
        (e) => {
          // Check if this is from an element editor
          if (this._isElementEditorEvent(e)) {
            logDebug(
              "ELEMENT",
              `Nested card: Detected element editor event, allowing natural propagation`,
            );

            // Mark the dialog as handling an element edit session
            dialog._handlingElementEdit = true;

            // Update element edit session state
            this._elementEditSession.active = true;
            this._elementEditSession.timestamp = Date.now();

            // Track the event for state restoration if needed
            if (e.detail && e.detail.config) {
              dialog._lastElementConfig = JSON.parse(
                JSON.stringify(e.detail.config),
              );
              dialog._savingFromElementEditor = true;
            }

            // Critical: Do NOT stop propagation for element editor events
            return;
          }

          if (
            e.detail?.fromExternalEditor ||
            e.detail?.fromActionCardEditor ||
            e.detail?.fromSwipeCardEditor
          ) {
            logDebug(
              "EDITOR",
              "Marking nested event as already handled in _editNestedCard's dialog",
            );
            e._handledByParentEditor = true;
          }
        },
        true,
      );

      const handleDialogClose = () => {
        dialog.removeEventListener("dialog-closed", handleDialogClose);

        // End element editing session if this was the parent dialog
        if (dialog._handlingElementEdit) {
          logDebug(
            "ELEMENT",
            "Dialog handling element edit is closing, ending element edit session",
          );
          this._elementEditSession.active = false;
        }

        this._activeChildEditors.delete(dialog);
        if (dialog.parentNode === document.body) {
          try {
            document.body.removeChild(dialog);
          } catch (error) {
            console.warn("Error removing nested card dialog:", error);
          }
        }
        setTimeout(() => this._ensureCardPickerLoaded(), 100);
      };
      dialog.addEventListener("dialog-closed", handleDialogClose);

      const dialogParams = {
        cardConfig: cardConfig,
        lovelaceConfig: this.lovelace || mainApp.lovelace,
        saveCardConfig: async (savedCardConfig) => {
          // Check if this save is coming from an element editor
          if (dialog._savingFromElementEditor || dialog._handlingElementEdit) {
            logDebug(
              "ELEMENT",
              `Nested card: Save detected from element editor, preserving dialog state`,
            );
            dialog._savingFromElementEditor = false;

            // Keep the element edit session active for a short time to catch any related events
            this._elementEditSession.timestamp = Date.now();

            // If we have a savedCardConfig, update it silently in our configuration
            if (savedCardConfig) {
              logDebug(
                "ELEMENT",
                "Silently updating nested card config with element changes",
              );
              const updatedNestedCards = [...nestedCards];
              updatedNestedCards[nestedIndex] = savedCardConfig;
              const updatedParentCard = {
                ...parentCard,
                card: updatedNestedCards,
              };
              const updatedCards = [...this._config.cards];
              updatedCards[parentIndex] = updatedParentCard;
              this._config = { ...this._config, cards: updatedCards };

              // Fire a non-bubbling config change to update parent without closing
              this._fireConfigChanged({
                maintainEditorState: true,
                fromElementEditor: true,
                updatedCardIndex: parentIndex,
                nestedCardIndex: nestedIndex,
              });
            }

            // Return the config to prevent dialog from closing
            return savedCardConfig;
          }

          // Handle dialog closing during element edit
          if (dialog._lastElementConfig && !savedCardConfig) {
            logDebug(
              "ELEMENT",
              `Nested card: Element editor cancel detected, restoring previous config`,
            );
            dialog._lastElementConfig = null;
            return;
          }

          if (!savedCardConfig) return;

          logDebug(
            "EDITOR",
            `Saving nested card ${parentIndex}.${nestedIndex} with new config`,
          );
          const updatedNestedCards = [...nestedCards];
          updatedNestedCards[nestedIndex] = savedCardConfig;
          const updatedParentCard = { ...parentCard, card: updatedNestedCards };
          const updatedCards = [...this._config.cards];
          updatedCards[parentIndex] = updatedParentCard;
          this._config = { ...this._config, cards: updatedCards };
          this._fireConfigChanged();
          this.requestUpdate();
          setTimeout(() => this._ensureCardPickerLoaded(), 100);
        },
      };
      await dialog.showDialog(dialogParams);
    } catch (err) {
      logDebug(
        "ERROR",
        "SimpleSwipeCardEditor: Error opening edit dialog for nested card:",
        err,
      );
      fireHAEvent(this, "ll-show-dialog", {
        dialogTag: "hui-dialog-edit-card",
        dialogImport: () => import("hui-dialog-edit-card"),
        dialogParams: {
          cardConfig: cardConfig,
          lovelaceConfig: this.lovelace || mainApp.lovelace,
          saveCardConfig: async (savedCardConfig) => {
            if (!savedCardConfig) return;
            const updatedNestedCards = [...nestedCards];
            updatedNestedCards[nestedIndex] = savedCardConfig;
            const updatedParentCard = {
              ...parentCard,
              card: updatedNestedCards,
            };
            const updatedCards = [...this._config.cards];
            updatedCards[parentIndex] = updatedParentCard;
            this._config = { ...this._config, cards: updatedCards };
            this._fireConfigChanged();
            this.requestUpdate();
            setTimeout(() => this._ensureCardPickerLoaded(), 100);
          },
        },
      });
    }
  }

  /**
   * Opens the edit dialog for a card
   * @param {number} index - The index of the card to edit
   * @private
   */
  async _editCard(index) {
    logDebug("EDITOR", `_editCard called for index ${index}`);
    if (
      !this._config ||
      !this._config.cards ||
      index < 0 ||
      index >= this._config.cards.length
    ) {
      logDebug(
        "ERROR",
        "SimpleSwipeCardEditor: Invalid index for card editing:",
        index,
      );
      return;
    }

    const cardConfig = this._config.cards[index];
    const hass = this.hass;
    const mainApp = document.querySelector("home-assistant");

    if (!hass || !mainApp) {
      logDebug(
        "ERROR",
        "SimpleSwipeCardEditor: Cannot find Home Assistant instance",
      );
      return;
    }

    try {
      await customElements.whenDefined("hui-dialog-edit-card");

      const dialog = document.createElement("hui-dialog-edit-card");
      dialog.hass = hass;

      document.body.appendChild(dialog); // Add to body FIRST
      this._activeChildEditors.add(dialog);
      dialog._parentEditorId = this._editorId;

      // Add special attributes for picture-elements cards to enhance tracking
      if (this._isPictureElementsCard(cardConfig)) {
        dialog.setAttribute("data-editing-picture-elements", "true");
        dialog._editingPictureElements = true;
      }

      logDebug(
        "EDITOR",
        `[CARD INDEX ${index}] hui-dialog-edit-card created and added to body. Tracking it.`,
      );

      // --- Listener Setup ---
      // Store bound functions for removal
      const boundHandleDialogConfigChanged =
        this._handleDialogConfigChanged.bind(this, index, dialog);
      const boundHandleDialogShowDialog = this._handleDialogShowDialog.bind(
        this,
        index,
      );

      dialog.addEventListener(
        "config-changed",
        boundHandleDialogConfigChanged,
        { capture: true },
      );
      dialog.addEventListener("show-dialog", boundHandleDialogShowDialog, {
        capture: true,
      });
      dialog.addEventListener("ll-show-dialog", boundHandleDialogShowDialog, {
        capture: true,
      });

      // For picture-elements, listen to element editor events
      if (this._isPictureElementsCard(cardConfig)) {
        dialog.addEventListener(
          "element-updated",
          (e) => {
            logDebug("ELEMENT", "Element updated event on dialog", e.detail);
            dialog._handlingElementEdit = true;
            this._elementEditSession.active = true;
            this._elementEditSession.timestamp = Date.now();
          },
          { capture: true },
        );

        dialog.addEventListener(
          "show-edit-element",
          (e) => {
            logDebug("ELEMENT", "Show edit element event on dialog", e.detail);
            dialog._handlingElementEdit = true;
            this._elementEditSession.active = true;
            this._elementEditSession.timestamp = Date.now();
          },
          { capture: true },
        );
      }

      if (cardConfig.type === "custom:actions-card") {
        dialog._editingActionsCard = true;
      }

      const handleDialogClose = () => {
        logDebug(
          "EDITOR",
          `[CARD INDEX ${index}] hui-dialog-edit-card closed event received.`,
        );
        // Remove listeners using the stored bound functions
        dialog.removeEventListener("dialog-closed", handleDialogClose);
        dialog.removeEventListener(
          "config-changed",
          boundHandleDialogConfigChanged,
          { capture: true },
        );
        dialog.removeEventListener("show-dialog", boundHandleDialogShowDialog, {
          capture: true,
        });
        dialog.removeEventListener(
          "ll-show-dialog",
          boundHandleDialogShowDialog,
          { capture: true },
        );

        if (this._isPictureElementsCard(cardConfig)) {
          dialog.removeEventListener("element-updated", handleElementUpdated, {
            capture: true,
          });
          dialog.removeEventListener(
            "show-edit-element",
            handleShowEditElement,
            { capture: true },
          );
        }

        this._activeChildEditors.delete(dialog);
        logDebug(
          "EDITOR",
          `[CARD INDEX ${index}] hui-dialog-edit-card removed from tracking. Active child editors: ${this._activeChildEditors.size}`,
        );

        // Reset element edit session if it's from this dialog
        if (dialog._handlingElementEdit) {
          logDebug("ELEMENT", "Element edit session reset due to dialog close");
          setTimeout(() => {
            // Only clear if no new element edit session has started
            if (
              this._elementEditSession.active &&
              Date.now() - this._elementEditSession.timestamp > 500
            ) {
              this._elementEditSession.active = false;
            }
          }, 500);
        }

        if (dialog.parentNode === document.body) {
          try {
            document.body.removeChild(dialog);
            logDebug(
              "EDITOR",
              `[CARD INDEX ${index}] hui-dialog-edit-card removed from body.`,
            );
          } catch (error) {
            console.warn(
              `[CARD INDEX ${index}] Error removing dialog from body:`,
              error,
            );
          }
        }
        setTimeout(() => this._ensureCardPickerLoaded(), 100);
      };
      dialog.addEventListener("dialog-closed", handleDialogClose);

      // Additional handlers for picture-elements cards
      const handleElementUpdated = (e) => {
        logDebug("ELEMENT", "Element updated event on dialog", e.detail);
        dialog._handlingElementEdit = true;
        this._elementEditSession.active = true;
        this._elementEditSession.timestamp = Date.now();
      };

      const handleShowEditElement = (e) => {
        logDebug("ELEMENT", "Show edit element event on dialog", e.detail);
        dialog._handlingElementEdit = true;
        this._elementEditSession.active = true;
        this._elementEditSession.timestamp = Date.now();
      };

      if (this._isPictureElementsCard(cardConfig)) {
        dialog.addEventListener("element-updated", handleElementUpdated, {
          capture: true,
        });
        dialog.addEventListener("show-edit-element", handleShowEditElement, {
          capture: true,
        });
      }
      // --- End Listener Setup ---

      const dialogParams = {
        cardConfig: cardConfig,
        lovelaceConfig: this.lovelace || mainApp.lovelace,
        // This is the FINAL save from hui-dialog-edit-card
        saveCardConfig: async (savedCardConfig) => {
          logDebug(
            "EDITOR",
            `[CARD INDEX ${index}] saveCardConfig callback in hui-dialog-edit-card invoked.`,
          );

          // Check if this save is coming from an element editor
          if (dialog._savingFromElementEditor || dialog._handlingElementEdit) {
            logDebug(
              "ELEMENT",
              `[CARD INDEX ${index}] Save detected from element editor, preserving dialog state`,
            );
            dialog._savingFromElementEditor = false;

            // Keep the element edit session active for a short time to catch any related events
            this._elementEditSession.timestamp = Date.now();

            // If we have a savedCardConfig, update it silently in our configuration
            // This keeps picture-elements changes without closing the editor
            if (savedCardConfig) {
              logDebug(
                "ELEMENT",
                "Silently updating config with element changes",
              );
              const updatedCards = [...this._config.cards];
              updatedCards[index] = savedCardConfig;
              this._config = { ...this._config, cards: updatedCards };

              // Fire a non-bubbling config change to update parent without closing
              this._fireConfigChanged({
                maintainEditorState: true,
                fromElementEditor: true,
                updatedCardIndex: index,
              });
            }

            // Return the config to prevent dialog from closing
            return savedCardConfig;
          }

          // Handle dialog closing during element edit
          if (dialog._lastElementConfig && !savedCardConfig) {
            logDebug(
              "ELEMENT",
              `[CARD INDEX ${index}] Element editor cancel detected, restoring previous config`,
            );
            dialog._lastElementConfig = null;
            // Don't return anything to allow dialog close
            return;
          }

          if (!savedCardConfig) return;
          const updatedCards = [...this._config.cards];
          updatedCards[index] = savedCardConfig;
          this._config = { ...this._config, cards: updatedCards };
          // Fire a BUBBLING event here, as the edit session for this card IS finished.
          this._fireConfigChanged({ reason: "child_dialog_saved" });
          this.requestUpdate();
          // Dialog will close itself, handleDialogClose will manage cleanup
          setTimeout(() => this._ensureCardPickerLoaded(), 100); // Also ensure here
        },
      };

      logDebug(
        "EDITOR",
        `[CARD INDEX ${index}] About to call dialog.showDialog()`,
      );
      await dialog.showDialog(dialogParams);
      logDebug("EDITOR", `[CARD INDEX ${index}] dialog.showDialog() finished.`);
    } catch (err) {
      logDebug(
        "ERROR",
        "SimpleSwipeCardEditor: Error opening edit dialog:",
        err,
      );
      // Fallback method
      fireHAEvent(this, "ll-show-dialog", {
        dialogTag: "hui-dialog-edit-card",
        dialogImport: () => import("hui-dialog-edit-card"),
        dialogParams: {
          cardConfig: cardConfig,
          lovelaceConfig: this.lovelace || mainApp.lovelace,
          saveCardConfig: async (savedCardConfig) => {
            if (!savedCardConfig) return;
            const updatedCards = [...this._config.cards];
            updatedCards[index] = savedCardConfig;
            this._config = { ...this._config, cards: updatedCards };
            this._fireConfigChanged({ reason: "child_dialog_saved_fallback" });
            this.requestUpdate();
            setTimeout(() => this._ensureCardPickerLoaded(), 100);
          },
        },
      });
    }
  }

  /**
   * Handles config-changed events originating from within the hui-dialog-edit-card.
   * @param {number} index - The index of the card being edited.
   * @param {HTMLElement} dialog - The hui-dialog-edit-card element.
   * @param {Event} e - The config-changed event.
   * @private
   */
  _handleDialogConfigChanged(index, dialog, e) {
    // Log detailed information when in debug mode
    if (DEBUG) {
      // Always log in debug for now
      const path = e.composedPath
        ? e
            .composedPath()
            .map((n) => n.localName || n.nodeName)
            .join(" > ")
        : "No path";
      const detailString = e.detail ? JSON.stringify(e.detail, null, 2) : "{}";
      logDebug("EVENT", `Config change event details:`, {
        target: e.target.localName,
        path: path,
        detail: JSON.parse(detailString),
        rawDetail: detailString,
        currentTarget: e.currentTarget.localName,
      });
    }

    // Use our robust element editor detection
    if (this._isElementEditorEvent(e)) {
      logDebug(
        "ELEMENT",
        `[CARD INDEX ${index}] Element editor event detected, preserving and allowing propagation`,
      );

      // Mark the dialog as handling an element edit session
      dialog._handlingElementEdit = true;

      // Refresh element edit session time
      this._elementEditSession.active = true;
      this._elementEditSession.timestamp = Date.now();

      // Track the event for state restoration if needed
      if (e.detail && e.detail.config) {
        dialog._lastElementConfig = JSON.parse(JSON.stringify(e.detail.config));
        dialog._savingFromElementEditor = true;

        // Silently update the configuration to keep changes without closing dialogs
        if (dialog._editingPictureElements) {
          try {
            logDebug("ELEMENT", "Silently updating picture-elements config");
            const updatedCards = [...this._config.cards];
            updatedCards[index] = e.detail.config;
            this._config = { ...this._config, cards: updatedCards };

            // Fire silent update
            this._fireConfigChanged({
              maintainEditorState: true,
              fromElementEditor: true,
              elementEditorEvent: true,
              updatedCardIndex: index,
            });
          } catch (err) {
            logDebug("ERROR", "Error silently updating config:", err);
          }
        }
      }

      // Critical: Do NOT stop propagation for element editor events
      return;
    }

    // Check if the event originated from within the dialog's content editor
    if (e.target !== dialog && e.detail && e.detail.config) {
      // Stop the event from bubbling OUTSIDE hui-dialog-edit-card
      // but allow propagation *within* it.
      e.stopPropagation();

      const newCardConfig = e.detail.config;
      logDebug(
        "EDITOR",
        `[CARD INDEX ${index}] Config received in handler: ${JSON.stringify(newCardConfig.type)}`,
      );

      const updatedCards = [...this._config.cards];
      updatedCards[index] = newCardConfig;
      this._config = { ...this._config, cards: updatedCards };

      // Fire our own config-changed event, with maintainEditorState: true.
      this._fireConfigChanged({
        maintainEditorState: true,
        updatedCardIndex: index,
        reason: `child_dialog_update_${e.detail.fromActionCardEditor ? "action_card" : "generic"}`,
      });
      this.requestUpdate(); // Update SimpleSwipeCardEditor's own UI if necessary

      logDebug(
        "EDITOR",
        `[CARD INDEX ${index}] Processed config-changed from content, stopped propagation OUTSIDE dialog.`,
      );
    } else {
      logDebug(
        "EDITOR",
        `[CARD INDEX ${index}] config-changed ignored or allowed to bubble (no config or event target is the dialog itself)`,
      );
    }
  }

  /**
   * Handles show-dialog events originating from within the hui-dialog-edit-card.
   * Re-fires the event from the SimpleSwipeCardEditor context.
   * @param {number} index - The index of the card being edited.
   * @param {Event} ev - The show-dialog or ll-show-dialog event.
   * @private
   */
  _handleDialogShowDialog(index, ev) {
    // Check if this is for an element editor
    const isElementEditorDialog =
      ev.detail &&
      ((ev.detail.dialogTag &&
        (ev.detail.dialogTag === "hui-dialog-edit-element" ||
          ev.detail.dialogTag.includes("element-editor"))) ||
        ev.detail.elementToEdit);

    if (isElementEditorDialog) {
      logDebug(
        "ELEMENT",
        `[CARD INDEX ${index}] Element editor dialog detected, allowing normal event flow`,
      );

      // Mark parent dialog as handling element edit
      const dialog = ev.currentTarget;
      if (dialog) {
        dialog._handlingElementEdit = true;
      }

      // Update element edit session state
      this._elementEditSession.active = true;
      this._elementEditSession.timestamp = Date.now();
      if (ev.detail && ev.detail.elementId) {
        this._elementEditSession.elementId = ev.detail.elementId;
      }

      // Don't interfere with element editor dialogs
      return;
    }

    const detailString = ev.detail ? JSON.stringify(ev.detail) : "{}";
    logDebug(
      "EDITOR",
      `[CARD INDEX ${index}] INTERCEPTED "${ev.type}" event from hui-dialog-edit-card OR ITS CONTENT`,
      {
        detail: JSON.parse(detailString),
        target: ev.target.localName,
      },
    );

    // For non-element editor dialogs, stop propagation and re-fire from our level
    ev.stopPropagation();
    if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
    if (ev.cancelable) ev.preventDefault();

    // Re-fire the event from SimpleSwipeCardEditor itself
    logDebug(
      "EDITOR",
      `[CARD INDEX ${index}] Re-firing "${ev.type}" event from SimpleSwipeCardEditor.`,
    );
    fireHAEvent(this, ev.type, ev.detail);
  }

  // Ensure card picker is properly loaded
  async connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    logDebug("EDITOR", "SimpleSwipeCardEditor connectedCallback");

    // Register this editor instance globally for state sharing
    const cardEditors = getGlobalRegistry(GLOBAL_STATE.cardEditors, "Set");
    cardEditors.add(this);

    // Ensure card picker is loaded before proceeding
    await this._ensureComponentsLoaded();

    // Call _ensureCardPickerLoaded after a short delay to ensure shadowRoot is ready
    setTimeout(() => this._ensureCardPickerLoaded(), 50);

    // Add enhanced event handling for nested card editors
    document.addEventListener(
      "config-changed",
      this._boundHandleNestedCardEvents,
      { capture: true },
    );

    // Global handler for editor card picker selections
    this._cardPickerHandler = (e) => {
      // Check for element editor events first to avoid interference
      if (this._isElementEditorEvent(e)) {
        logDebug(
          "ELEMENT",
          "Config-changed event from element editor, allowing propagation",
        );

        // Mark this dialog as handling an element edit
        if (e.target && e.target.closest("hui-dialog-edit-card")) {
          const dialog = e.target.closest("hui-dialog-edit-card");
          if (dialog) {
            dialog._handlingElementEdit = true;

            // Track element edit session
            this._elementEditSession.active = true;
            this._elementEditSession.parentDialogId =
              dialog._parentEditorId || null;
            this._elementEditSession.timestamp = Date.now();
          }
        }

        return;
      }

      // Only process events potentially from card pickers
      if (e.type === "config-changed" && e.detail?.config) {
        // Special handling for actions-card or other problematic cards
        const isActionCard = e.detail?.config?.type === "custom:actions-card";

        // If this is a hui-card-picker event, capture it
        if (e.target?.tagName?.toLowerCase() === "hui-card-picker") {
          // Get the path of the event to see if it's related to our editor
          const path = e.composedPath ? e.composedPath() : [];

          if (
            path.some(
              (node) =>
                node === this ||
                (node.shadowRoot && node.shadowRoot.contains(this)) ||
                (this.shadowRoot && this.shadowRoot.contains(node)),
            )
          ) {
            // This is from our editor's card picker
            logDebug(
              "EDITOR",
              "Card picker selection captured by global handler:",
              e.detail.config.type,
            );

            // If this is an Actions Card, we need special handling
            if (isActionCard && !this._ignoreNextCardPicker) {
              // Store the information before stopping propagation
              this._lastCardPickerSelection = {
                time: Date.now(),
                config: e.detail.config,
              };

              // Flag to ignore the next event, process ourselves
              this._ignoreNextCardPicker = true;

              // Process this ourselves without the event
              this._safelyAddCard(e.detail.config);

              // Stop propagation to prevent editor replacement
              if (e.stopImmediatePropagation) e.stopImmediatePropagation();
              e.stopPropagation();
              return;
            }
          }
        }
      }
    };

    // Capture phase is important to intercept before default handling
    document.addEventListener("config-changed", this._cardPickerHandler, {
      capture: true,
    });

    // Listen for iron-select events to handle tabs
    this._tabSwitchHandler = (e) => {
      // Check if the event has already been processed by an actions card editor
      if (e._processedByActionsCardEditor) {
        logDebug(
          "EVENT",
          "Intercepted iron-select event already processed by actions card editor",
        );
        e.stopPropagation();
        return;
      }
    };

    document.addEventListener("iron-select", this._tabSwitchHandler, {
      capture: true,
    });

    // Add handler for dialog-closed events
    this._dialogClosedHandler = (e) => {
      if (e.target && e.target.tagName === "HUI-DIALOG-EDIT-CARD") {
        const dialog = e.target;
        logDebug("EDITOR", "A HUI-DIALOG-EDIT-CARD closed", {
          tracked: this._activeChildEditors.has(dialog),
          isActions: this._isActionsCardDialog(dialog),
          handlingElementEdit: dialog._handlingElementEdit,
        });

        // End element editing session if this was the parent dialog
        if (dialog._handlingElementEdit) {
          logDebug(
            "ELEMENT",
            "Dialog handling element edit is closing, ending element edit session",
          );
          this._elementEditSession.active = false;

          // Important: If dialog was handling element edit and has stored element config,
          // ensure it's not lost on dialog close
          if (dialog._lastElementConfig) {
            logDebug("ELEMENT", "Preserving element config on dialog close");
            this._elementEditSession.savedState = dialog._lastElementConfig;
            dialog._lastElementConfig = null;
          }
        }

        if (this._activeChildEditors.has(dialog)) {
          // Check if it's one we are tracking
          this._activeChildEditors.delete(dialog);
          this.requestUpdate(); // Update our own UI
          setTimeout(() => this._ensureCardPickerLoaded(), 100); // Ensure picker is good after dialog closes
        }
      }

      // Also handle element editor dialog close
      if (
        e.target &&
        (e.target.tagName === "HUI-DIALOG-EDIT-ELEMENT" ||
          (e.target.tagName === "HUI-DIALOG" && this._isElementEditorEvent(e)))
      ) {
        logDebug("ELEMENT", "Element editor dialog closed");
        // Keep the active session for a short time after dialog close
        setTimeout(() => {
          // Only reset if no new element edit session has started
          if (
            this._elementEditSession.active &&
            Date.now() - this._elementEditSession.timestamp > 500
          ) {
            logDebug("ELEMENT", "Resetting element edit session after timeout");
            this._elementEditSession.active = false;
          }
        }, 500);
      }
    };
    document.addEventListener("dialog-closed", this._dialogClosedHandler, {
      capture: true,
    });

    // Add handler for element editor specific events
    this._elementEditorHandler = (e) => {
      if (
        (e.type === "element-updated" || e.type === "show-edit-element") &&
        !this._elementEditSession.active
      ) {
        logDebug(
          "ELEMENT",
          `Capturing ${e.type} event, starting element edit session`,
        );
        this._elementEditSession.active = true;
        this._elementEditSession.timestamp = Date.now();
        if (e.detail && e.detail.elementId) {
          this._elementEditSession.elementId = e.detail.elementId;
        }
      }
    };

    document.addEventListener("element-updated", this._elementEditorHandler, {
      capture: true,
    });
    document.addEventListener("show-edit-element", this._elementEditorHandler, {
      capture: true,
    });
  }

  async _ensureComponentsLoaded() {
    const maxAttempts = 50; // 5 seconds max wait
    let attempts = 0;

    while (!customElements.get("hui-card-picker") && attempts < maxAttempts) {
      await this._loadCustomElements();
      if (!customElements.get("hui-card-picker")) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }
    }

    if (!customElements.get("hui-card-picker")) {
      console.error("Failed to load hui-card-picker after multiple attempts");
    }
  }

  async _loadCustomElements() {
    if (!customElements.get("hui-card-picker")) {
      try {
        const attempts = [
          () => customElements.get("hui-entities-card")?.getConfigElement?.(),
          () =>
            customElements.get("hui-conditional-card")?.getConfigElement?.(),
          () =>
            customElements.get("hui-vertical-stack-card")?.getConfigElement?.(),
          () =>
            customElements
              .get("hui-horizontal-stack-card")
              ?.getConfigElement?.(),
        ];

        for (const attempt of attempts) {
          try {
            await attempt();
            if (customElements.get("hui-card-picker")) {
              break;
            }
          } catch (e) {
            console.debug("Card picker load attempt failed:", e);
          }
        }
      } catch (e) {
        console.warn("Could not load hui-card-picker", e);
      }
    }
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    logDebug("EDITOR", "SimpleSwipeCardEditor disconnectedCallback");

    // Clean up all event listeners
    document.removeEventListener("config-changed", this._cardPickerHandler, {
      capture: true,
    });
    document.removeEventListener("iron-select", this._tabSwitchHandler, {
      capture: true,
    });
    document.removeEventListener(
      "config-changed",
      this._boundHandleNestedCardEvents,
      { capture: true },
    );
    document.removeEventListener("dialog-closed", this._dialogClosedHandler, {
      capture: true,
    });
    document.removeEventListener(
      "element-updated",
      this._elementEditorHandler,
      { capture: true },
    );
    document.removeEventListener(
      "show-edit-element",
      this._elementEditorHandler,
      { capture: true },
    );

    // ENHANCED: Force cleanup of all tracked dialogs
    this._activeChildEditors.forEach((dialog) => {
      try {
        // Remove all listeners from dialog
        dialog.removeEventListener(
          "config-changed",
          this._boundHandleDialogConfigChanged,
        );
        dialog.removeEventListener(
          "show-dialog",
          this._boundHandleDialogShowDialog,
        );
        dialog.removeEventListener(
          "ll-show-dialog",
          this._boundHandleDialogShowDialog,
        );

        // Close dialog if still open
        if (dialog.close && typeof dialog.close === "function") {
          dialog.close();
        }

        // Remove from DOM
        if (dialog.parentNode) {
          dialog.parentNode.removeChild(dialog);
        }
      } catch (error) {
        console.warn("Error cleaning up dialog:", error);
      }
    });
    this._activeChildEditors.clear();

    // ENHANCED: Clear all references
    this._boundHandleCardPicked = null;
    this._boundHandleNestedCardEvents = null;
    this._cardPickerHandler = null;
    this._tabSwitchHandler = null;
    this._dialogClosedHandler = null;
    this._elementEditorHandler = null;

    // Unregister this editor
    const cardEditors = getGlobalRegistry(GLOBAL_STATE.cardEditors, "Set");
    cardEditors.delete(this);

    const editorRegistry = getGlobalRegistry(GLOBAL_STATE.editorRegistry);
    editorRegistry.delete(this._editorId);
  }

  /**
   * Enhanced handler for nested card editor events
   * Specifically targets events from action cards
   * @param {Event} e - The event to handle
   * @private
   */
  _handleNestedCardEvents(e) {
    // Check for element editor events first to prioritize them
    if (this._isElementEditorEvent(e)) {
      logDebug(
        "ELEMENT",
        "Detected element editor event in _handleNestedCardEvents",
      );

      // Determine if this is related to our card stack
      const isRelatedToOurStack =
        e.composedPath &&
        e.composedPath().some((node) => {
          return (
            this._activeChildEditors.has(node) ||
            (node._parentEditorId && node._parentEditorId === this._editorId)
          );
        });

      if (isRelatedToOurStack) {
        logDebug(
          "ELEMENT",
          "Element editor event is related to our dialog stack, handling specially",
        );
        // Don't interfere with element editor events from our own dialog stack
        return;
      }
    }

    // Already handled or not relevant
    if (e._handledBySwipeCard || !e.detail?.fromActionCardEditor) return;

    // Find if this event is related to our editor's cards
    const cardElement = e.target.closest("[data-index]");
    if (!cardElement || !this._config?.cards) return;

    const cardIndex = parseInt(cardElement.getAttribute("data-index"));
    if (
      isNaN(cardIndex) ||
      cardIndex < 0 ||
      cardIndex >= this._config.cards.length
    )
      return;

    logDebug(
      "EVENT",
      `Handling nested card event from actions card at index ${cardIndex}`,
      e.detail,
    );

    // Prevent default behavior and stopPropagation
    e.stopPropagation();
    if (e.preventDefault) e.preventDefault();

    // Check if we should maintain editor state (prevent dialog close)
    if (e.detail.maintainEditorState) {
      logDebug(
        "EVENT",
        "Event marked to maintain editor state, preventing propagation",
      );

      // Update the configuration without firing normal event
      const updatedCards = [...this._config.cards];
      updatedCards[cardIndex] = e.detail.config;

      this._config = {
        ...this._config,
        cards: updatedCards,
      };

      // Fire our own config-changed event with special flag
      this._fireConfigChanged({
        nestedCardUpdate: true,
        updatedCardIndex: cardIndex,
        nestedCardType: e.detail.config.type,
        maintainEditorState: true,
      });
    } else {
      // Standard handling
      const updatedCards = [...this._config.cards];
      updatedCards[cardIndex] = e.detail.config;

      this._config = {
        ...this._config,
        cards: updatedCards,
      };

      // Fire our own config-changed event
      this._fireConfigChanged({
        nestedCardUpdate: true,
        updatedCardIndex: cardIndex,
        nestedCardType: e.detail.config.type,
      });
    }

    // Mark as handled
    e._handledBySwipeCard = true;

    // Trigger UI update
    this.requestUpdate();
  }

  /**
   * Safely adds a card to the configuration without triggering editor replacement
   * @param {Object} cardConfig - Card configuration to add
   * @private
   */
  _safelyAddCard(cardConfig) {
    if (!cardConfig || !this._config) return;

    try {
      // Add to the configuration
      const currentCards = Array.isArray(this._config.cards)
        ? [...this._config.cards]
        : [];
      const updatedConfig = {
        ...this._config,
        cards: [...currentCards, cardConfig],
      };

      // Update our config
      this._config = updatedConfig;

      // Fire config changed event with special flag
      this._fireConfigChanged({
        isSafeCardAddition: true,
        addedCardType: cardConfig.type,
      });

      // Force a visual update
      this.requestUpdate();
      setTimeout(() => this._ensureCardPickerLoaded(), 50); // Ensure picker is fine after adding

      // Log success
      logDebug("EDITOR", "Safely added card:", cardConfig.type);
    } catch (err) {
      logDebug("ERROR", "Failed to safely add card:", err);
    }
  }

  /**
   * Ensures the card picker is loaded and visible
   * @private
   */
  _ensureCardPickerLoaded() {
    if (!this.shadowRoot) {
      logDebug("EDITOR", "_ensureCardPickerLoaded: No shadowRoot, returning.");
      return;
    }
    logDebug("EDITOR", "_ensureCardPickerLoaded called");

    const container = this.shadowRoot.querySelector("#card-picker-container");
    if (container) {
      container.style.display = "block";

      if (!container.hasAttribute("event-barrier-applied")) {
        container.setAttribute("event-barrier-applied", "true");

        // Add a comprehensive event barrier for all config-changed events
        container.addEventListener(
          "config-changed",
          (e) => {
            // Stop ALL config-changed events at the container level
            logDebug(
              "EDITOR",
              "Intercepted config-changed at container level:",
              e.detail?.config?.type,
            );

            // Process the card selection here directly
            if (
              e.target &&
              e.target.tagName &&
              e.target.tagName.toLowerCase() === "hui-card-picker" &&
              e.detail &&
              e.detail.config
            ) {
              const cardConfig = e.detail.config;
              logDebug("EDITOR", "Processing card selection:", cardConfig.type);

              // Add the card to our config
              if (this._config) {
                const cards = Array.isArray(this._config.cards)
                  ? [...this._config.cards]
                  : [];
                cards.push(cardConfig);

                this._config = {
                  ...this._config,
                  cards,
                };

                // Fire our own config-changed event
                this._fireConfigChanged({
                  cardAdded: true,
                  cardType: cardConfig.type,
                });

                this.requestUpdate();
              }
            }

            // Always stop propagation
            e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            return false;
          },
          { capture: true },
        );
      }

      const picker = container.querySelector("hui-card-picker");
      if (picker) {
        picker.style.display = "block";

        // If picker has no content, try to refresh it
        if (picker.requestUpdate) {
          picker.requestUpdate();
        }
      }
    }

    this.requestUpdate();
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

    delete this._config.title;

    // Ensure card picker is loaded after config is set
    setTimeout(() => this._ensureCardPickerLoaded(), 50);
  }

  _valueChanged(ev) {
    if (!this._config || !ev.target) return;
    const target = ev.target;
    const option = target.configValue || target.getAttribute("data-option");
    const parentOption =
      target.parentElement?.configValue ||
      target.parentElement?.getAttribute("data-option");
    const finalOption = option || parentOption;
    if (!finalOption) return;

    let value;

    // Handle ha-entity-picker value-changed events
    if (
      target.localName === "ha-entity-picker" &&
      ev.type === "value-changed"
    ) {
      value = ev.detail.value || null;
    } else if (target.localName === "ha-switch") {
      value = target.checked;
    } else if (
      target.localName === "ha-textfield" &&
      target.type === "number"
    ) {
      value = parseInt(target.value);
      if (isNaN(value) || value < 0) {
        // Set default values based on option
        if (finalOption === "card_spacing") {
          value = 15;
        } else if (finalOption === "auto_swipe_interval") {
          value = 2000;
        } else if (finalOption === "reset_after_timeout") {
          value = 30000;
        } else {
          value = 0;
        }
      }
    } else {
      value = target.value;
    }

    // Guard against redundant updates to prevent loops
    if (this._config[finalOption] !== value) {
      logDebug("EDITOR", `Value changed for ${finalOption}:`, value);

      // Create a new config object to ensure reactivity
      this._config = { ...this._config, [finalOption]: value };

      // Fire config changed without requesting an update
      this._fireConfigChanged();

      // Don't call requestUpdate() here as it may cause update loops
    }
  }

  /**
   * Fires the config-changed event with proper identification
   * @param {Object} [extraData] - Additional data to include in the event
   * @private
   */
  _fireConfigChanged(extraData = {}) {
    const cleanConfig = this._getCleanConfig(this._config);
    fireConfigChanged(this, cleanConfig, {
      editorId: this._editorId,
      fromSwipeCardEditor: true,
      ...extraData,
    });
  }

  /**
   * Handles card selection from the picker
   * @param {Event} ev - The selection event
   * @private
   */
  _handleCardPicked(ev) {
    // This is a fallback - all events should be caught by the container listener
    logDebug(
      "EDITOR",
      "Fallback _handleCardPicked called:",
      ev.detail?.config?.type,
    );

    // Stop propagation to prevent editor replacement
    ev.stopPropagation();
    if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();

    if (!ev.detail?.config) return;

    // Add the card to our config
    const newCardConfig = ev.detail.config;
    logDebug("EDITOR", "Adding card in fallback handler:", newCardConfig.type);

    const currentCards = Array.isArray(this._config.cards)
      ? [...this._config.cards]
      : [];
    const updatedConfig = {
      ...this._config,
      cards: [...currentCards, newCardConfig],
    };

    this._config = updatedConfig;
    this._fireConfigChanged();
    this.requestUpdate();
  }

  /**
   * Gets a descriptive name for a card configuration
   * @param {Object} cardConfig - The card configuration
   * @returns {Object} An object with type name and card name
   * @private
   */
  _getCardDescriptor(cardConfig) {
    if (!cardConfig?.type)
      return { typeName: "Unknown", name: "", isPictureElements: false };
    const type = cardConfig.type.startsWith("custom:")
      ? cardConfig.type.substring(7)
      : cardConfig.type;
    const typeName = type
      .split(/[-_]/)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
    const name = cardConfig.title || cardConfig.name || "";
    const isPictureElements = type === "picture-elements";
    return { typeName, name, isPictureElements };
  }

  /**
   * Moves a card in the list
   * @param {number} index - The index of the card to move
   * @param {number} direction - The direction to move (-1 for up, 1 for down)
   * @private
   */
  _moveCard(index, direction) {
    if (!this._config?.cards) return;
    const cards = [...this._config.cards];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= cards.length) return;

    // Swap the cards
    logDebug("EDITOR", `Moving card ${index} to position ${newIndex}`);
    [cards[index], cards[newIndex]] = [cards[newIndex], cards[index]];

    this._config = { ...this._config, cards };
    this._fireConfigChanged();
    this.requestUpdate();
  }

  /**
   * Removes a card from the list
   * @param {number} index - The index of the card to remove
   * @private
   */
  _removeCard(index) {
    if (!this._config?.cards || index < 0 || index >= this._config.cards.length)
      return;

    logDebug("EDITOR", `Removing card at index ${index}`);
    const cards = this._config.cards.filter((_, i) => i !== index);
    this._config = { ...this._config, cards };
    this._fireConfigChanged();
    this.requestUpdate();
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

    const cards = this._config.cards || [];

    return html`
      <div class="card-config">
        ${renderInfoPanel()}
        ${renderDisplayOptions(this._config, this._valueChanged.bind(this))}
        ${renderAdvancedOptions(
          this._config,
          this._collapsibleState,
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
  }

  /**
   * Handles reset timeout changes
   * @param {Event} ev - The change event
   * @private
   */
  _handleTimeoutChange(ev) {
    const seconds = parseInt(ev.target.value);
    if (!isNaN(seconds) && seconds >= 5) {
      const milliseconds = seconds * 1000;
      this._config = { ...this._config, reset_after_timeout: milliseconds };
      this._fireConfigChanged();
    }
  }

  /**
   * Handles reset target card changes
   * @param {Event} ev - The change event
   * @private
   */
  _handleTargetChange(ev) {
    const oneBasedIndex = parseInt(ev.target.value);
    if (!isNaN(oneBasedIndex) && oneBasedIndex >= 1) {
      this._config = { ...this._config, reset_target_card: oneBasedIndex };
      this._fireConfigChanged();
    }
  }

  /**
   * Creates a clean configuration object with only non-default values in UI order
   * @param {Object} config - The full configuration object
   * @returns {Object} Clean configuration with only non-default values in proper order
   * @private
   */
  _getCleanConfig(config) {
    if (!config) return {};

    const cleanConfig = { type: config.type };

    // Always include cards array if it exists
    if (Array.isArray(config.cards)) {
      cleanConfig.cards = config.cards;
    }

    // Define the desired order matching the UI sections
    const displayOptions = [
      "card_spacing",
      "swipe_direction",
      "show_pagination",
    ];

    const advancedOptions = [
      "enable_loopback",
      "enable_auto_swipe",
      "auto_swipe_interval",
      "enable_reset_after",
      "reset_after_timeout",
      "reset_target_card",
      "state_entity",
    ];

    // Defaults for comparison
    const defaults = {
      show_pagination: true,
      card_spacing: 15,
      enable_loopback: false,
      swipe_direction: "horizontal",
      enable_auto_swipe: false,
      auto_swipe_interval: 2000,
      enable_reset_after: false,
      reset_after_timeout: 30000,
      reset_target_card: 1,
    };

    // Add display options in UI order
    displayOptions.forEach((key) => {
      if (config[key] !== undefined && config[key] !== defaults[key]) {
        cleanConfig[key] = config[key];
      }
    });

    // Add advanced options in UI order
    advancedOptions.forEach((key) => {
      if (key === "state_entity") {
        // Handle state_entity separately - only include if it has a meaningful value
        if (
          config.state_entity &&
          config.state_entity !== null &&
          config.state_entity !== ""
        ) {
          cleanConfig.state_entity = config.state_entity;
        }
      } else if (config[key] !== undefined && config[key] !== defaults[key]) {
        cleanConfig[key] = config[key];
      }
    });

    // Add Home Assistant layout properties at the end (before card_mod)
    const layoutProperties = ["grid_options", "layout_options", "view_layout"];
    layoutProperties.forEach((prop) => {
      if (config[prop] !== undefined) {
        cleanConfig[prop] = config[prop];
      }
    });

    // Add card_mod at the very end if it exists
    if (config.card_mod !== undefined) {
      cleanConfig.card_mod = config.card_mod;
    }

    return cleanConfig;
  }
}
