/**
 * Dependency loading and fallback handling for Simple Swipe Card
 * FIXED: Using synchronous loading pattern from working todo-swipe-card
 */

import { logDebug } from "../utils/Debug.js";

/**
 * DEPENDENCY LOADING STRATEGY:
 *
 * This file handles loading LitElement and related dependencies with multiple fallback layers
 * to ensure the card works in various Home Assistant environments:
 *
 * 1. PRIMARY: Use Home Assistant's built-in LitElement (most common case)
 * 2. FALLBACK: Load from CDN (for older HA versions or custom setups)
 * 3. EMERGENCY: Use basic HTMLElement with polyfills (for extreme cases)
 *
 * This approach ensures maximum compatibility across HA versions and network conditions.
 */

// Initialize variables that will hold our dependencies
let LitElement, html, css, fireEvent;

/**
 * ATTEMPT 1: Use Home Assistant's built-in LitElement
 *
 * Modern HA versions include LitElement globally, which is the most reliable
 * and performant option since it's already loaded and matches HA's version.
 */
try {
  if (window.customElements && window.customElements.get("ha-card")) {
    // Extract LitElement from an existing HA component's prototype chain
    const litModule =
      customElements.get("ha-card").__proto__.constructor.__proto__.constructor;
    LitElement = litModule;

    // Get html and css template functions from global lit namespace
    html = window.lit?.html || window.LitElement?.html;
    css = window.lit?.css || window.LitElement?.css;

    logDebug("SYSTEM", "Using Home Assistant built-in LitElement");
  }
} catch (e) {
  logDebug(
    "SYSTEM",
    "Could not use built-in LitElement, will try CDN fallback:",
    e.message,
  );
}

/**
 * ATTEMPT 2: CDN Fallback for missing or incompatible built-in LitElement
 *
 * If built-in LitElement isn't available or doesn't work, dynamically import
 * from multiple CDN sources with fallback chain for reliability.
 */
if (!LitElement || !html || !css) {
  const loadDependencies = async () => {
    try {
      // Multiple CDN sources for redundancy (in order of preference)
      const cdnSources = [
        "https://cdn.jsdelivr.net/npm/lit-element@2.5.1/+esm", // Primary CDN
        "https://unpkg.com/lit-element@2.5.1/lit-element.js?module", // Alternative CDN
        "https://cdn.skypack.dev/lit-element@2.5.1", // Backup CDN
      ];

      let litLoaded = false;

      // Try each CDN source until one succeeds
      for (const source of cdnSources) {
        try {
          logDebug("SYSTEM", `Attempting to load LitElement from: ${source}`);
          const module = await import(source);

          LitElement = module.LitElement;
          html = module.html;
          css = module.css;
          litLoaded = true;

          logDebug("SYSTEM", `Successfully loaded LitElement from: ${source}`);
          break;
        } catch (e) {
          console.warn(
            `SimpleSwipeCard: Failed to load from ${source}:`,
            e.message,
          );
          // Continue to next CDN source
        }
      }

      if (!litLoaded) {
        throw new Error("Could not load LitElement from any CDN source");
      }
    } catch (error) {
      console.error(
        "SimpleSwipeCard: All LitElement loading attempts failed:",
        error,
      );

      /**
       * ATTEMPT 3: Emergency Fallback - Basic HTMLElement with Polyfills
       *
       * If both built-in and CDN loading fail (offline mode, network issues, etc.),
       * fall back to basic HTMLElement with minimal template function polyfills.
       * This provides degraded functionality but keeps the card operational.
       */
      logDebug("SYSTEM", "Using emergency HTMLElement fallback with polyfills");

      LitElement = HTMLElement;

      // Basic template literal function that concatenates strings
      html = (strings, ...values) => {
        return strings.reduce((result, string, i) => {
          return result + string + (values[i] || "");
        }, "");
      };

      // CSS function that just returns the first template string
      css = (strings) => strings[0];
    }
  };

  // CRITICAL: Use top-level await to ensure dependencies are loaded before module exports
  try {
    await loadDependencies();
  } catch (e) {
    // If even the emergency fallback fails, use the most basic implementation
    logDebug(
      "SYSTEM",
      "Emergency fallback initialization failed, using minimal polyfills",
    );

    LitElement = HTMLElement;
    html = (strings, ...values) => {
      return strings.reduce((result, string, i) => {
        return result + string + (values[i] || "");
      }, "");
    };
    css = (strings) => strings[0];
  }
}

/**
 * FIREEEVENT FUNCTION LOADING
 *
 * FireEvent is used for dispatching custom events to Home Assistant.
 * Try multiple sources with fallback to basic CustomEvent implementation.
 */
try {
  // First try: Use HA's global fireEvent if available
  if (window.customCards && window.fireEvent) {
    fireEvent = window.fireEvent;
    logDebug("SYSTEM", "Using Home Assistant global fireEvent");
  } else {
    // Second try: Import from custom-card-helpers
    const helpersModule = await import(
      "https://unpkg.com/custom-card-helpers@^1?module"
    );
    fireEvent = helpersModule.fireEvent;
    logDebug("SYSTEM", "Loaded fireEvent from custom-card-helpers");
  }
} catch (error) {
  logDebug("SYSTEM", "Using fallback fireEvent implementation");

  /**
   * Fallback fireEvent Implementation
   *
   * Creates and dispatches CustomEvents with proper bubbling and composition
   * for communication with Home Assistant's event system.
   */
  fireEvent = (node, type, detail = {}) => {
    const event = new CustomEvent(type, {
      detail,
      bubbles: true, // Allow event to bubble up DOM tree
      composed: true, // Allow event to cross shadow DOM boundaries
    });
    node.dispatchEvent(event);
  };
}

/**
 * Ensures all dependencies are properly loaded (for compatibility)
 * @returns {Promise<boolean>} True when dependencies are ready
 */
export async function ensureDependencies() {
  // Dependencies are already loaded synchronously above
  return true;
}

/**
 * Gets the card helpers with fallback
 * @returns {Promise<Object>} Card helpers object
 */
export function getHelpers() {
  return window.loadCardHelpers
    ? window.loadCardHelpers()
    : Promise.resolve({
        createCardElement: async (config) => {
          // Fallback card creation for offline mode
          const element = document.createElement("div");
          element.innerHTML = `
        <ha-card>
          <div style="padding: 16px; text-align: center;">
            <ha-icon icon="mdi:alert-circle" style="color: var(--warning-color); margin-bottom: 8px;"></ha-icon>
            <div>Card type "${config.type}" not available offline</div>
            <div style="font-size: 12px; color: var(--secondary-text-color); margin-top: 8px;">
              This card requires an internet connection to load properly.
            </div>
          </ha-card>
        </div>
      `;
          return element.firstElementChild;
        },
        createErrorCardElement: (config, error) => {
          const element = document.createElement("div");
          element.innerHTML = `
        <ha-card>
          <div style="padding: 16px; text-align: center; color: var(--error-color);">
            <ha-icon icon="mdi:alert" style="margin-bottom: 8px;"></ha-icon>
            <div>Error: ${error}</div>
          </div>
        </ha-card>
      `;
          return element.firstElementChild;
        },
      });
}

// Export the loaded dependencies
export { LitElement, html, css, fireEvent };
