/**
 * Configuration management utilities for Simple Swipe Card Editor
 */

import { logDebug } from "../utils/Debug.js";
import { fireConfigChanged } from "../utils/EventHelpers.js";

/**
 * Handles configuration processing and validation
 */
export class EditorConfigManager {
  constructor(editor) {
    this.editor = editor;
  }

  /**
   * Sets and validates the editor configuration
   * @param {Object} config - Configuration object
   */
  setConfig(config) {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    logDebug("EDITOR", "Editor setConfig received:", JSON.stringify(config));

    this.editor._config = JSON.parse(JSON.stringify(config));
    if (!Array.isArray(this.editor._config.cards))
      this.editor._config.cards = [];
    if (this.editor._config.show_pagination === undefined)
      this.editor._config.show_pagination = true;
    if (this.editor._config.card_spacing === undefined) {
      this.editor._config.card_spacing = 15;
    } else {
      const spacing = parseInt(this.editor._config.card_spacing);
      this.editor._config.card_spacing =
        isNaN(spacing) || spacing < 0 ? 15 : spacing;
    }

    // Migrate enable_loopback to loop_mode
    if (
      this.editor._config.enable_loopback !== undefined &&
      this.editor._config.loop_mode === undefined
    ) {
      this.editor._config.loop_mode = this.editor._config.enable_loopback
        ? "loopback"
        : "none";
      delete this.editor._config.enable_loopback;
      logDebug(
        "CONFIG",
        "Migrated enable_loopback to loop_mode:",
        this.editor._config.loop_mode,
      );
    }

    // Set default for loop_mode
    if (this.editor._config.loop_mode === undefined) {
      this.editor._config.loop_mode = "none";
    }

    // Validate loop_mode
    if (
      !["none", "loopback", "infinite"].includes(this.editor._config.loop_mode)
    ) {
      logDebug(
        "CONFIG",
        "Invalid loop_mode, defaulting to 'none':",
        this.editor._config.loop_mode,
      );
      this.editor._config.loop_mode = "none";
    }

    // Set default for swipe_direction
    if (
      this.editor._config.swipe_direction === undefined ||
      !["horizontal", "vertical"].includes(this.editor._config.swipe_direction)
    ) {
      this.editor._config.swipe_direction = "horizontal";
    }

    // Set defaults for auto-swipe options
    if (this.editor._config.enable_auto_swipe === undefined)
      this.editor._config.enable_auto_swipe = false;
    if (this.editor._config.auto_swipe_interval === undefined) {
      this.editor._config.auto_swipe_interval = 2000;
    } else {
      this.editor._config.auto_swipe_interval = parseInt(
        this.editor._config.auto_swipe_interval,
      );
      if (
        isNaN(this.editor._config.auto_swipe_interval) ||
        this.editor._config.auto_swipe_interval < 500
      ) {
        this.editor._config.auto_swipe_interval = 2000;
      }
    }

    // Set defaults for reset-after options
    if (this.editor._config.enable_reset_after === undefined)
      this.editor._config.enable_reset_after = false;
    if (this.editor._config.reset_after_timeout === undefined) {
      this.editor._config.reset_after_timeout = 30000; // 30 seconds default
    } else {
      // Ensure reset_after_timeout is a positive number (minimum 5 seconds)
      this.editor._config.reset_after_timeout = parseInt(
        this.editor._config.reset_after_timeout,
      );
      if (
        isNaN(this.editor._config.reset_after_timeout) ||
        this.editor._config.reset_after_timeout < 5000
      ) {
        this.editor._config.reset_after_timeout = 30000;
      }
    }
    if (this.editor._config.reset_target_card === undefined) {
      this.editor._config.reset_target_card = 1; // Default to first card (1-based)
    } else {
      // Ensure it's a valid 1-based number
      this.editor._config.reset_target_card = Math.max(
        1,
        parseInt(this.editor._config.reset_target_card),
      );
    }

    // Set defaults for view mode options
    if (this.editor._config.view_mode === undefined) {
      this.editor._config.view_mode = "single";
    }

    // Validate view_mode
    if (!["single", "carousel"].includes(this.editor._config.view_mode)) {
      this.editor._config.view_mode = "single";
    }

    // Handle both card_min_width and cards_visible for backwards compatibility
    if (this.editor._config.view_mode === "carousel") {
      // Set default for card_min_width (new responsive approach)
      if (this.editor._config.card_min_width === undefined) {
        this.editor._config.card_min_width = 200;
      } else {
        const minWidth = parseInt(this.editor._config.card_min_width);
        if (isNaN(minWidth) || minWidth < 50 || minWidth > 500) {
          this.editor._config.card_min_width = 200;
        }
      }

      // Handle legacy cards_visible for backwards compatibility
      if (this.editor._config.cards_visible !== undefined) {
        // Validate cards_visible with better bounds
        const cardsVisible = parseFloat(this.editor._config.cards_visible);
        if (isNaN(cardsVisible) || cardsVisible < 1.1 || cardsVisible > 8.0) {
          this.editor._config.cards_visible = 2.5;
        } else {
          // Round to 1 decimal place to avoid precision issues
          this.editor._config.cards_visible =
            Math.round(cardsVisible * 10) / 10;
        }
      }
      // If cards_visible is undefined, we'll use the responsive approach
    }

    delete this.editor._config.title;

    // Ensure card picker is loaded after config is set
    setTimeout(() => this.editor.uiManager.ensureCardPickerLoaded(), 50);
  }

  /**
   * Handles value changes from UI components
   * @param {Event} ev - Change event
   */
  handleValueChanged(ev) {
    if (!this.editor._config || !ev.target) return;
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
      value = parseFloat(target.value); // Use parseFloat for cards_visible
      if (isNaN(value) || value < 0) {
        // Set default values based on option
        if (finalOption === "card_spacing") {
          value = 15;
        } else if (finalOption === "auto_swipe_interval") {
          value = 2000;
        } else if (finalOption === "reset_after_timeout") {
          value = 30000;
        } else if (finalOption === "cards_visible") {
          value = 2.5;
        } else {
          value = 0;
        }
      }
    } else {
      value = target.value;
    }

    // Handle view mode switching with cleanup
    if (
      finalOption === "view_mode" &&
      this.editor._config[finalOption] !== value
    ) {
      logDebug(
        "EDITOR",
        `View mode changing from ${this.editor._config[finalOption]} to ${value}`,
      );

      // Create new config with cleaned options
      const newConfig = { ...this.editor._config, [finalOption]: value };

      if (value === "carousel") {
        // Switching TO carousel mode - remove single-mode-only options
        delete newConfig.swipe_direction; // Carousel only supports horizontal
        delete newConfig.enable_auto_swipe;
        delete newConfig.auto_swipe_interval;
        delete newConfig.enable_reset_after;
        delete newConfig.reset_after_timeout;
        delete newConfig.reset_target_card;
        delete newConfig.state_entity;

        // FIXED: Set responsive defaults for new users, preserve existing cards_visible for legacy
        if (!newConfig.cards_visible && !newConfig.card_min_width) {
          // New user - use responsive approach
          newConfig.card_min_width = 200;
        }
        // If they already have cards_visible, keep it (backwards compatibility)
        // If they already have card_min_width, keep it

        logDebug(
          "EDITOR",
          "Cleaned config for carousel mode:",
          Object.keys(newConfig),
        );
      } else if (value === "single") {
        // Switching TO single mode - remove carousel-mode-only options
        delete newConfig.cards_visible;
        delete newConfig.card_min_width; // Remove both carousel options

        // Restore single mode defaults if needed
        if (!newConfig.swipe_direction) {
          newConfig.swipe_direction = "horizontal";
        }

        logDebug(
          "EDITOR",
          "Cleaned config for single mode:",
          Object.keys(newConfig),
        );
      }

      this.editor._config = newConfig;
      this.fireConfigChanged();
      this.editor.requestUpdate();
      return;
    }

    // Handle card_min_width changes (with migration)
    if (
      finalOption === "card_min_width" &&
      this.editor._config[finalOption] !== value
    ) {
      logDebug(
        "EDITOR",
        `User changed card_min_width to ${value}, migrating from legacy mode`,
      );

      // If they had cards_visible, remove it (user-initiated migration)
      if (this.editor._config.cards_visible !== undefined) {
        const newConfig = { ...this.editor._config };
        delete newConfig.cards_visible;
        newConfig.card_min_width = value;
        this.editor._config = newConfig;
        logDebug("EDITOR", "Migrated from cards_visible to card_min_width");
      } else {
        this.editor._config = { ...this.editor._config, [finalOption]: value };
      }

      this.fireConfigChanged();
      this.editor.requestUpdate();
      return;
    }

    // Guard against redundant updates to prevent loops (for other options)
    if (this.editor._config[finalOption] !== value) {
      logDebug("EDITOR", `Value changed for ${finalOption}:`, value);

      // Create a new config object to ensure reactivity
      this.editor._config = { ...this.editor._config, [finalOption]: value };

      // Fire config changed without requesting an update
      this.fireConfigChanged();

      // Don't call requestUpdate() here as it may cause update loops
    }
  }

  /**
   * Handles reset timeout changes
   * @param {Event} ev - The change event
   */
  handleTimeoutChange(ev) {
    const seconds = parseInt(ev.target.value);
    if (!isNaN(seconds) && seconds >= 5) {
      const milliseconds = seconds * 1000;
      this.editor._config = {
        ...this.editor._config,
        reset_after_timeout: milliseconds,
      };
      this.fireConfigChanged();
    }
  }

  /**
   * Handles reset target card changes
   * @param {Event} ev - The change event
   */
  handleTargetChange(ev) {
    const oneBasedIndex = parseInt(ev.target.value);
    if (!isNaN(oneBasedIndex) && oneBasedIndex >= 1) {
      this.editor._config = {
        ...this.editor._config,
        reset_target_card: oneBasedIndex,
      };
      this.fireConfigChanged();
    }
  }

  /**
   * Creates a clean configuration object with only non-default values in UI order
   * @param {Object} config - The full configuration object
   * @returns {Object} Clean configuration with only non-default values in proper order
   */
  getCleanConfig(config) {
    if (!config) return {};

    const cleanConfig = { type: config.type };

    // View Mode section (matches UI order)
    // Include view mode if not default
    if (config.view_mode && config.view_mode !== "single") {
      cleanConfig.view_mode = config.view_mode;
    }

    // FIXED: Include the appropriate carousel option
    if (config.view_mode === "carousel") {
      if (config.cards_visible !== undefined) {
        // Legacy approach - include cards_visible
        cleanConfig.cards_visible = config.cards_visible;
      } else if (
        config.card_min_width !== undefined &&
        config.card_min_width !== 200
      ) {
        // New approach - include card_min_width (only if not default)
        cleanConfig.card_min_width = config.card_min_width;
      }
    }

    // Display Options section (matches UI order)
    const displayOptions = [
      "card_spacing",
      "swipe_direction",
      "show_pagination",
    ];

    // Advanced Options section (matches UI order)
    const advancedOptions = [
      "loop_mode",
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
      loop_mode: "none",
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

    // Cards section (comes after configuration options, matching UI)
    if (Array.isArray(config.cards)) {
      cleanConfig.cards = config.cards;
    }

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

  /**
   * Fires the config-changed event with proper identification
   * @param {Object} extraData - Additional data to include in the event
   */
  fireConfigChanged(extraData = {}) {
    const cleanConfig = this.getCleanConfig(this.editor._config);
    fireConfigChanged(this.editor, cleanConfig, {
      editorId: this.editor._editorId,
      fromSwipeCardEditor: true,
      ...extraData,
    });
  }
}
