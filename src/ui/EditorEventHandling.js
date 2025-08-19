/**
 * Event handling utilities for Simple Swipe Card Editor
 */

import { logDebug } from "../utils/Debug.js";
import { DEBUG } from "../utils/Constants.js";
import { fireHAEvent } from "../utils/EventHelpers.js";

/**
 * Handles complex event management for the editor
 */
export class EditorEventHandling {
  constructor(editor) {
    this.editor = editor;

    // Bind event handlers
    this._boundHandleNestedCardEvents = this._handleNestedCardEvents.bind(this);

    // Element editor detection
    this._elementEditSession = {
      active: false,
      parentDialogId: null,
      elementId: null,
      timestamp: null,
      savedState: null,
    };
  }

  /**
   * Sets up all event listeners for the editor
   */
  setupEventListeners() {
    // Enhanced event handling for nested card editors
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
                node === this.editor ||
                (node.shadowRoot && node.shadowRoot.contains(this.editor)) ||
                (this.editor.shadowRoot &&
                  this.editor.shadowRoot.contains(node)),
            )
          ) {
            // This is from our editor's card picker
            logDebug(
              "EDITOR",
              "Card picker selection captured by global handler:",
              e.detail.config.type,
            );

            // If this is an Actions Card, we need special handling
            if (isActionCard && !this.editor._ignoreNextCardPicker) {
              // Store the information before stopping propagation
              this.editor._lastCardPickerSelection = {
                time: Date.now(),
                config: e.detail.config,
              };

              // Flag to ignore the next event, process ourselves
              this.editor._ignoreNextCardPicker = true;

              // Process this ourselves without the event
              this.editor._safelyAddCard(e.detail.config);

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
          tracked: this.editor._activeChildEditors.has(dialog),
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

        if (this.editor._activeChildEditors.has(dialog)) {
          // Check if it's one we are tracking
          this.editor._activeChildEditors.delete(dialog);
          this.editor.requestUpdate(); // Update our own UI
          setTimeout(() => this.editor.uiManager.ensureCardPickerLoaded(), 100); // Ensure picker is good after dialog closes
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

  /**
   * Removes all event listeners
   */
  removeEventListeners() {
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
  }

  /**
   * Comprehensive event detection for element editors
   * @param {Event} e - The event to check
   * @returns {boolean} True if the event is from an element editor
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
   * Enhanced handler for nested card editor events
   * @param {Event} e - The event to handle
   */
  _handleNestedCardEvents(extraData, e) {
    if (extraData && extraData.option === "auto_hide_pagination") {
      return; // Don't process auto-hide events as nested card events
    }

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
            this.editor._activeChildEditors.has(node) ||
            (node._parentEditorId &&
              node._parentEditorId === this.editor._editorId)
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
    if (!cardElement || !this.editor._config?.cards) return;

    const cardIndex = parseInt(cardElement.getAttribute("data-index"));
    if (
      isNaN(cardIndex) ||
      cardIndex < 0 ||
      cardIndex >= this.editor._config.cards.length
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
      const updatedCards = [...this.editor._config.cards];
      updatedCards[cardIndex] = e.detail.config;

      this.editor._config = {
        ...this.editor._config,
        cards: updatedCards,
      };

      // Fire our own config-changed event with special flag
      this.editor.configManager.fireConfigChanged({
        nestedCardUpdate: true,
        updatedCardIndex: cardIndex,
        nestedCardType: e.detail.config.type,
        maintainEditorState: true,
      });
    } else {
      // Standard handling
      const updatedCards = [...this.editor._config.cards];
      updatedCards[cardIndex] = e.detail.config;

      this.editor._config = {
        ...this.editor._config,
        cards: updatedCards,
      };

      // Fire our own config-changed event
      this.editor.configManager.fireConfigChanged({
        nestedCardUpdate: true,
        updatedCardIndex: cardIndex,
        nestedCardType: e.detail.config.type,
      });
    }

    // Mark as handled
    e._handledBySwipeCard = true;

    // Trigger UI update
    this.editor.requestUpdate();
  }

  /**
   * Handles config-changed events originating from within the hui-dialog-edit-card.
   * @param {number} index - The index of the card being edited.
   * @param {HTMLElement} dialog - The hui-dialog-edit-card element.
   * @param {Event} e - The config-changed event.
   */
  handleDialogConfigChanged(index, dialog, e) {
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
            const updatedCards = [...this.editor._config.cards];
            updatedCards[index] = e.detail.config;
            this.editor._config = {
              ...this.editor._config,
              cards: updatedCards,
            };

            // Fire silent update
            this.editor.configManager.fireConfigChanged({
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

      const updatedCards = [...this.editor._config.cards];
      updatedCards[index] = newCardConfig;
      this.editor._config = { ...this.editor._config, cards: updatedCards };

      // Fire our own config-changed event, with maintainEditorState: true.
      this.editor.configManager.fireConfigChanged({
        maintainEditorState: true,
        updatedCardIndex: index,
        reason: `child_dialog_update_${e.detail.fromActionCardEditor ? "action_card" : "generic"}`,
      });
      this.editor.requestUpdate(); // Update SimpleSwipeCardEditor's own UI if necessary

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
   * @param {number} index - The index of the card being edited.
   * @param {Event} ev - The show-dialog or ll-show-dialog event.
   */
  handleDialogShowDialog(index, ev) {
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
    fireHAEvent(this.editor, ev.type, ev.detail);
  }
}
