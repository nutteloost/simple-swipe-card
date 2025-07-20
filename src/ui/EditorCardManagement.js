/**
 * Card management utilities for Simple Swipe Card Editor
 */

import { logDebug } from "../utils/Debug.js";
import { fireHAEvent } from "../utils/EventHelpers.js";

/**
 * Handles card CRUD operations for the editor
 */
export class EditorCardManagement {
  constructor(editor) {
    this.editor = editor;
  }

  /**
   * Gets a descriptive name for a card configuration
   * @param {Object} cardConfig - The card configuration
   * @returns {Object} An object with type name and card name
   */
  getCardDescriptor(cardConfig) {
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
   * Checks if a card configuration contains nested cards
   * @param {Object} cardConfig - The card configuration to check
   * @returns {boolean} True if the card has nested cards
   */
  hasNestedCards(cardConfig) {
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
   */
  getNestedCards(cardConfig) {
    if (!this.hasNestedCards(cardConfig)) return [];
    return Array.isArray(cardConfig.card) ? cardConfig.card : [cardConfig.card];
  }

  /**
   * Checks if a card has visibility conditions
   * @param {Object} config - Card configuration
   * @returns {boolean} True if the card has visibility conditions
   */
  hasVisibilityConditions(config) {
    return (
      config && Array.isArray(config.visibility) && config.visibility.length > 0
    );
  }

  /**
   * Checks if a card config is a picture-elements card
   * @param {Object} config - Card configuration
   * @returns {boolean} True if it's a picture-elements card
   */
  isPictureElementsCard(config) {
    return config && config.type === "picture-elements";
  }

  /**
   * Moves a card in the list
   * @param {number} index - The index of the card to move
   * @param {number} direction - The direction to move (-1 for up, 1 for down)
   */
  moveCard(index, direction) {
    if (!this.editor._config?.cards) return;
    const cards = [...this.editor._config.cards];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= cards.length) return;

    // Swap the cards
    logDebug("EDITOR", `Moving card ${index} to position ${newIndex}`);
    [cards[index], cards[newIndex]] = [cards[newIndex], cards[index]];

    this.editor._config = { ...this.editor._config, cards };
    this.editor._fireConfigChanged();
    this.editor.requestUpdate();
  }

  /**
   * Removes a card from the list
   * @param {number} index - The index of the card to remove
   */
  removeCard(index) {
    if (
      !this.editor._config?.cards ||
      index < 0 ||
      index >= this.editor._config.cards.length
    )
      return;

    logDebug("EDITOR", `Removing card at index ${index}`);
    const cards = this.editor._config.cards.filter((_, i) => i !== index);
    this.editor._config = { ...this.editor._config, cards };
    this.editor._fireConfigChanged();
    this.editor.requestUpdate();
  }

  /**
   * Moves a nested card in the list
   * @param {number} parentIndex - The index of the parent card
   * @param {number} nestedIndex - The index of the nested card
   * @param {number} direction - The direction to move (-1 for up, 1 for down)
   */
  moveNestedCard(parentIndex, nestedIndex, direction) {
    if (!this.editor._config?.cards || !this.editor._config.cards[parentIndex])
      return;

    const parentCard = this.editor._config.cards[parentIndex];
    if (!this.hasNestedCards(parentCard)) return;

    const nestedCards = this.getNestedCards(parentCard);
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
    const updatedCards = [...this.editor._config.cards];
    updatedCards[parentIndex] = { ...parentCard, card: nestedCards };
    this.editor._config = { ...this.editor._config, cards: updatedCards };

    this.editor._fireConfigChanged();
    this.editor.requestUpdate();
  }

  /**
   * Removes a nested card from the list
   * @param {number} parentIndex - The index of the parent card
   * @param {number} nestedIndex - The index of the nested card to remove
   */
  removeNestedCard(parentIndex, nestedIndex) {
    if (!this.editor._config?.cards || !this.editor._config.cards[parentIndex])
      return;

    const parentCard = this.editor._config.cards[parentIndex];
    if (!this.hasNestedCards(parentCard)) return;

    let nestedCards = this.getNestedCards(parentCard);
    if (nestedIndex < 0 || nestedIndex >= nestedCards.length) return;

    logDebug("EDITOR", `Removing nested card ${parentIndex}.${nestedIndex}`);

    // Remove the card
    nestedCards = nestedCards.filter((_, i) => i !== nestedIndex);

    // Update the configuration
    const updatedCards = [...this.editor._config.cards];
    updatedCards[parentIndex] = { ...parentCard, card: nestedCards };
    this.editor._config = { ...this.editor._config, cards: updatedCards };

    this.editor._fireConfigChanged();
    this.editor.requestUpdate();
  }

  /**
   * Opens the edit dialog for a card
   * @param {number} index - The index of the card to edit
   */
  async editCard(index) {
    logDebug("EDITOR", `_editCard called for index ${index}`);
    if (
      !this.editor._config ||
      !this.editor._config.cards ||
      index < 0 ||
      index >= this.editor._config.cards.length
    ) {
      logDebug(
        "ERROR",
        "SimpleSwipeCardEditor: Invalid index for card editing:",
        index,
      );
      return;
    }

    const cardConfig = this.editor._config.cards[index];
    const hass = this.editor.hass;
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
      this.editor._activeChildEditors.add(dialog);
      dialog._parentEditorId = this.editor._editorId;

      // Add special attributes for picture-elements cards to enhance tracking
      if (this.isPictureElementsCard(cardConfig)) {
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
        this.editor.eventHandling.handleDialogConfigChanged.bind(
          this.editor.eventHandling,
          index,
          dialog,
        );
      const boundHandleDialogShowDialog =
        this.editor.eventHandling.handleDialogShowDialog.bind(
          this.editor.eventHandling,
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
      if (this.isPictureElementsCard(cardConfig)) {
        dialog.addEventListener(
          "element-updated",
          (e) => {
            logDebug("ELEMENT", "Element updated event on dialog", e.detail);
            dialog._handlingElementEdit = true;
            this.editor.eventHandling._elementEditSession.active = true;
            this.editor.eventHandling._elementEditSession.timestamp =
              Date.now();
          },
          { capture: true },
        );

        dialog.addEventListener(
          "show-edit-element",
          (e) => {
            logDebug("ELEMENT", "Show edit element event on dialog", e.detail);
            dialog._handlingElementEdit = true;
            this.editor.eventHandling._elementEditSession.active = true;
            this.editor.eventHandling._elementEditSession.timestamp =
              Date.now();
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

        if (this.isPictureElementsCard(cardConfig)) {
          dialog.removeEventListener("element-updated", handleElementUpdated, {
            capture: true,
          });
          dialog.removeEventListener(
            "show-edit-element",
            handleShowEditElement,
            { capture: true },
          );
        }

        this.editor._activeChildEditors.delete(dialog);
        logDebug(
          "EDITOR",
          `[CARD INDEX ${index}] hui-dialog-edit-card removed from tracking. Active child editors: ${this.editor._activeChildEditors.size}`,
        );

        // Reset element edit session if it's from this dialog
        if (dialog._handlingElementEdit) {
          logDebug("ELEMENT", "Element edit session reset due to dialog close");
          setTimeout(() => {
            // Only clear if no new element edit session has started
            if (
              this.editor.eventHandling._elementEditSession.active &&
              Date.now() -
                this.editor.eventHandling._elementEditSession.timestamp >
                500
            ) {
              this.editor.eventHandling._elementEditSession.active = false;
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
        setTimeout(() => this.editor._ensureCardPickerLoaded(), 100);
      };
      dialog.addEventListener("dialog-closed", handleDialogClose);

      // Additional handlers for picture-elements cards
      const handleElementUpdated = (e) => {
        logDebug("ELEMENT", "Element updated event on dialog", e.detail);
        dialog._handlingElementEdit = true;
        this.editor.eventHandling._elementEditSession.active = true;
        this.editor.eventHandling._elementEditSession.timestamp = Date.now();
      };

      const handleShowEditElement = (e) => {
        logDebug("ELEMENT", "Show edit element event on dialog", e.detail);
        dialog._handlingElementEdit = true;
        this.editor.eventHandling._elementEditSession.active = true;
        this.editor.eventHandling._elementEditSession.timestamp = Date.now();
      };

      if (this.isPictureElementsCard(cardConfig)) {
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
        lovelaceConfig: this.editor.lovelace || mainApp.lovelace,
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
            this.editor.eventHandling._elementEditSession.timestamp =
              Date.now();

            // If we have a savedCardConfig, update it silently in our configuration
            // This keeps picture-elements changes without closing the editor
            if (savedCardConfig) {
              logDebug(
                "ELEMENT",
                "Silently updating config with element changes",
              );
              const updatedCards = [...this.editor._config.cards];
              updatedCards[index] = savedCardConfig;
              this.editor._config = {
                ...this.editor._config,
                cards: updatedCards,
              };

              // Fire a non-bubbling config change to update parent without closing
              this.editor._fireConfigChanged({
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
          const updatedCards = [...this.editor._config.cards];
          updatedCards[index] = savedCardConfig;
          this.editor._config = { ...this.editor._config, cards: updatedCards };
          // Fire a BUBBLING event here, as the edit session for this card IS finished.
          this.editor._fireConfigChanged({ reason: "child_dialog_saved" });
          this.editor.requestUpdate();
          // Dialog will close itself, handleDialogClose will manage cleanup
          setTimeout(() => this.editor._ensureCardPickerLoaded(), 100); // Also ensure here
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
      fireHAEvent(this.editor, "ll-show-dialog", {
        dialogTag: "hui-dialog-edit-card",
        dialogImport: () => import("hui-dialog-edit-card"),
        dialogParams: {
          cardConfig: cardConfig,
          lovelaceConfig: this.editor.lovelace || mainApp.lovelace,
          saveCardConfig: async (savedCardConfig) => {
            if (!savedCardConfig) return;
            const updatedCards = [...this.editor._config.cards];
            updatedCards[index] = savedCardConfig;
            this.editor._config = {
              ...this.editor._config,
              cards: updatedCards,
            };
            this.editor._fireConfigChanged({
              reason: "child_dialog_saved_fallback",
            });
            this.editor.requestUpdate();
            setTimeout(() => this.editor._ensureCardPickerLoaded(), 100);
          },
        },
      });
    }
  }

  /**
   * Opens the edit dialog for a nested card
   * @param {number} parentIndex - The index of the parent card
   * @param {number} nestedIndex - The index of the nested card to edit
   */
  async editNestedCard(parentIndex, nestedIndex) {
    logDebug(
      "EDITOR",
      `_editNestedCard called for parent ${parentIndex}, nested ${nestedIndex}`,
    );
    if (
      !this.editor._config?.cards ||
      !this.editor._config.cards[parentIndex] ||
      !this.hasNestedCards(this.editor._config.cards[parentIndex])
    ) {
      logDebug(
        "ERROR",
        "SimpleSwipeCardEditor: Invalid indices for nested card editing:",
        parentIndex,
        nestedIndex,
      );
      return;
    }

    const parentCard = this.editor._config.cards[parentIndex];
    const nestedCards = this.getNestedCards(parentCard);
    if (nestedIndex < 0 || nestedIndex >= nestedCards.length) return;

    const cardConfig = nestedCards[nestedIndex];
    const hass = this.editor.hass;
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
      this.editor._activeChildEditors.add(dialog);
      dialog._parentEditorId = this.editor._editorId;

      // Add special attributes for picture-elements cards to enhance tracking
      if (this.isPictureElementsCard(cardConfig)) {
        dialog.setAttribute("data-editing-picture-elements", "true");
        dialog._editingPictureElements = true;
      }

      // Add element editor detection
      dialog.addEventListener(
        "config-changed",
        (e) => {
          // Check if this is from an element editor
          if (this.editor.eventHandling._isElementEditorEvent(e)) {
            logDebug(
              "ELEMENT",
              `Nested card: Detected element editor event, allowing natural propagation`,
            );

            // Mark the dialog as handling an element edit session
            dialog._handlingElementEdit = true;

            // Update element edit session state
            this.editor.eventHandling._elementEditSession.active = true;
            this.editor.eventHandling._elementEditSession.timestamp =
              Date.now();

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
          this.editor.eventHandling._elementEditSession.active = false;
        }

        this.editor._activeChildEditors.delete(dialog);
        if (dialog.parentNode === document.body) {
          try {
            document.body.removeChild(dialog);
          } catch (error) {
            console.warn("Error removing nested card dialog:", error);
          }
        }
        setTimeout(() => this.editor._ensureCardPickerLoaded(), 100);
      };
      dialog.addEventListener("dialog-closed", handleDialogClose);

      const dialogParams = {
        cardConfig: cardConfig,
        lovelaceConfig: this.editor.lovelace || mainApp.lovelace,
        saveCardConfig: async (savedCardConfig) => {
          // Check if this save is coming from an element editor
          if (dialog._savingFromElementEditor || dialog._handlingElementEdit) {
            logDebug(
              "ELEMENT",
              `Nested card: Save detected from element editor, preserving dialog state`,
            );
            dialog._savingFromElementEditor = false;

            // Keep the element edit session active for a short time to catch any related events
            this.editor.eventHandling._elementEditSession.timestamp =
              Date.now();

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
              const updatedCards = [...this.editor._config.cards];
              updatedCards[parentIndex] = updatedParentCard;
              this.editor._config = {
                ...this.editor._config,
                cards: updatedCards,
              };

              // Fire a non-bubbling config change to update parent without closing
              this.editor._fireConfigChanged({
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
          const updatedCards = [...this.editor._config.cards];
          updatedCards[parentIndex] = updatedParentCard;
          this.editor._config = { ...this.editor._config, cards: updatedCards };
          this.editor._fireConfigChanged();
          this.editor.requestUpdate();
          setTimeout(() => this.editor._ensureCardPickerLoaded(), 100);
        },
      };
      await dialog.showDialog(dialogParams);
    } catch (err) {
      logDebug(
        "ERROR",
        "SimpleSwipeCardEditor: Error opening edit dialog for nested card:",
        err,
      );
      fireHAEvent(this.editor, "ll-show-dialog", {
        dialogTag: "hui-dialog-edit-card",
        dialogImport: () => import("hui-dialog-edit-card"),
        dialogParams: {
          cardConfig: cardConfig,
          lovelaceConfig: this.editor.lovelace || mainApp.lovelace,
          saveCardConfig: async (savedCardConfig) => {
            if (!savedCardConfig) return;
            const updatedNestedCards = [...nestedCards];
            updatedNestedCards[nestedIndex] = savedCardConfig;
            const updatedParentCard = {
              ...parentCard,
              card: updatedNestedCards,
            };
            const updatedCards = [...this.editor._config.cards];
            updatedCards[parentIndex] = updatedParentCard;
            this.editor._config = {
              ...this.editor._config,
              cards: updatedCards,
            };
            this.editor._fireConfigChanged();
            this.editor.requestUpdate();
            setTimeout(() => this.editor._ensureCardPickerLoaded(), 100);
          },
        },
      });
    }
  }

  /**
   * Safely adds a card to the configuration without triggering editor replacement
   * @param {Object} cardConfig - Card configuration to add
   */
  safelyAddCard(cardConfig) {
    if (!cardConfig || !this.editor._config) return;

    try {
      // Add to the configuration
      const currentCards = Array.isArray(this.editor._config.cards)
        ? [...this.editor._config.cards]
        : [];
      const updatedConfig = {
        ...this.editor._config,
        cards: [...currentCards, cardConfig],
      };

      // Update our config
      this.editor._config = updatedConfig;

      // Fire config changed event with special flag
      this.editor._fireConfigChanged({
        isSafeCardAddition: true,
        addedCardType: cardConfig.type,
      });

      // Force a visual update
      this.editor.requestUpdate();
      setTimeout(() => this.editor._ensureCardPickerLoaded(), 50); // Ensure picker is fine after adding

      // Log success
      logDebug("EDITOR", "Safely added card:", cardConfig.type);
    } catch (err) {
      logDebug("ERROR", "Failed to safely add card:", err);
    }
  }

  /**
   * Handles card selection from the picker
   * @param {Event} ev - The selection event
   */
  handleCardPicked(ev) {
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

    const currentCards = Array.isArray(this.editor._config.cards)
      ? [...this.editor._config.cards]
      : [];
    const updatedConfig = {
      ...this.editor._config,
      cards: [...currentCards, newCardConfig],
    };

    this.editor._config = updatedConfig;
    this.editor._fireConfigChanged();
    this.editor.requestUpdate();
  }
}
