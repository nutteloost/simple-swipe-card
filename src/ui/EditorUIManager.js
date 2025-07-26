/**
 * UI management utilities for Simple Swipe Card Editor
 */

import { logDebug } from "../utils/Debug.js";
import { getGlobalRegistry } from "../utils/EventHelpers.js";
import { GLOBAL_STATE } from "../utils/Constants.js";

/**
 * Handles editor UI initialization and state management
 */
export class EditorUIManager {
  constructor(editor) {
    this.editor = editor;

    // UI state management
    this.collapsibleState = {
      advanced: false, // Advanced options collapsed by default
      cards: true, // Cards section expanded by default
    };
  }

  /**
   * Initializes the editor UI and sets up component loading
   */
  async initializeEditor() {
    // Generate unique ID for this editor instance
    this.editor._editorId = `swipe-card-editor-${Math.random().toString(36).substring(2, 15)}`;

    // Bind event handlers
    this.editor._boundHandleCardPicked =
      this.editor.cardManagement.handleCardPicked.bind(
        this.editor.cardManagement,
      );
    this.editor._boundHandleNestedCardEvents =
      this.editor.eventHandling._handleNestedCardEvents.bind(
        this.editor.eventHandling,
      );

    // Initialize tracking sets
    this.editor._activeChildEditors = new Set();

    // Initialize state tracking
    this.editor._lastCardPickerSelection = null;
    this.editor._ignoreNextCardPicker = false;

    // Initialize element editor state
    this.editor._elementEditSession = {
      active: false,
      parentDialogId: null,
      elementId: null,
      timestamp: null,
      savedState: null,
    };

    // Create a registry of all editors and dialogs
    const editorRegistry = getGlobalRegistry(GLOBAL_STATE.editorRegistry);
    editorRegistry.set(this.editor._editorId, this);
  }

  /**
   * Toggles a collapsible section
   * @param {string} section - Section name to toggle
   */
  toggleSection(section) {
    this.collapsibleState[section] = !this.collapsibleState[section];
    this.editor.requestUpdate();
  }

  /**
   * Gets the current collapsible state
   * @returns {Object} Current collapsible state
   */
  getCollapsibleState() {
    return this.collapsibleState;
  }

  /**
   * Ensures required components are loaded
   */
  async ensureComponentsLoaded() {
    const maxAttempts = 50; // 5 seconds max wait
    let attempts = 0;

    while (!customElements.get("hui-card-picker") && attempts < maxAttempts) {
      await this.loadCustomElements();
      if (!customElements.get("hui-card-picker")) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }
    }

    if (!customElements.get("hui-card-picker")) {
      console.error("Failed to load hui-card-picker after multiple attempts");
    }
  }

  /**
   * Attempts to load custom elements
   */
  async loadCustomElements() {
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

  /**
   * Ensures the card picker is loaded and visible
   */
  ensureCardPickerLoaded() {
    if (!this.editor.shadowRoot) {
      logDebug("EDITOR", "_ensureCardPickerLoaded: No shadowRoot, returning.");
      return;
    }
    logDebug("EDITOR", "_ensureCardPickerLoaded called");

    const container = this.editor.shadowRoot.querySelector(
      "#card-picker-container",
    );
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
              if (this.editor._config) {
                const cards = Array.isArray(this.editor._config.cards)
                  ? [...this.editor._config.cards]
                  : [];
                cards.push(cardConfig);

                this.editor._config = {
                  ...this.editor._config,
                  cards,
                };

                // Fire our own config-changed event
                this.editor.configManager.fireConfigChanged({
                  cardAdded: true,
                  cardType: cardConfig.type,
                });

                this.editor.requestUpdate();
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

    this.editor.requestUpdate();
  }
}
