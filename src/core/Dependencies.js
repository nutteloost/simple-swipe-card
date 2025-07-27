/**
 * SIMPLE DEPENDENCY LOADING - STATIC IMPORTS ONLY
 *
 * Uses only standard static ES6 imports that Rollup bundles into the final file.
 * No dynamic imports, no runtime detection - just simple, reliable imports.
 */

import { logDebug } from "../utils/Debug.js";

// Static imports - Rollup will bundle these into the final file
import { LitElement, html, css } from "lit";

// Simple fireEvent implementation (no external dependencies)
export const fireEvent = (node, type, detail = {}) => {
  const event = new CustomEvent(type, {
    detail,
    bubbles: true,
    composed: true,
  });
  node.dispatchEvent(event);
};

/**
 * Ensures all dependencies are properly loaded
 * @returns {Promise<boolean>} True when dependencies are ready
 */
export async function ensureDependencies() {
  logDebug("SYSTEM", "Using bundled LitElement dependencies");
  return true;
}

/**
 * Gets the card helpers
 * @returns {Promise<Object>} Card helpers object
 */
export function getHelpers() {
  // Try HA's built-in card helpers first
  if (window.loadCardHelpers && typeof window.loadCardHelpers === "function") {
    return window.loadCardHelpers();
  }

  // Simple fallback that works offline
  return Promise.resolve({
    createCardElement: async (config) => {
      try {
        // Try to create custom cards
        if (
          config.type &&
          window.customElements &&
          window.customElements.get(config.type)
        ) {
          const element = document.createElement(config.type);
          if (element.setConfig) {
            element.setConfig(config);
          }
          return element;
        }

        // Try built-in cards with hui- prefix
        if (config.type && !config.type.startsWith("custom:")) {
          const huiType = `hui-${config.type}-card`;
          if (window.customElements && window.customElements.get(huiType)) {
            const element = document.createElement(huiType);
            if (element.setConfig) {
              element.setConfig(config);
            }
            return element;
          }
        }

        // Simple placeholder for unknown cards
        const element = document.createElement("div");
        element.innerHTML = `
          <ha-card>
            <div style="padding: 16px; text-align: center; color: var(--secondary-text-color);">
              <ha-icon icon="mdi:card-outline" style="font-size: 48px; margin-bottom: 8px; opacity: 0.5;"></ha-icon>
              <div style="font-weight: 500;">${config.type}</div>
              <div style="font-size: 12px; opacity: 0.7;">Card type not available</div>
            </div>
          </ha-card>
        `;
        return element.firstElementChild;
      } catch (error) {
        // Error card
        const element = document.createElement("div");
        element.innerHTML = `
          <ha-card>
            <div style="padding: 16px; text-align: center; color: var(--error-color, #f44336);">
              <ha-icon icon="mdi:alert-circle" style="font-size: 24px; margin-bottom: 8px;"></ha-icon>
              <div style="font-weight: 500;">Card Error</div>
              <div style="font-size: 12px;">${config.type}</div>
              <div style="font-size: 11px; margin-top: 4px; opacity: 0.6;">${error.message}</div>
            </div>
          </ha-card>
        `;
        return element.firstElementChild;
      }
    },

    createErrorCardElement: (config, error) => {
      const element = document.createElement("div");
      element.innerHTML = `
        <ha-card>
          <div style="padding: 16px; text-align: center; color: var(--error-color, #f44336);">
            <ha-icon icon="mdi:alert-circle" style="font-size: 24px; margin-bottom: 8px;"></ha-icon>
            <div style="font-weight: 500;">Card Error</div>
            <div style="font-size: 12px; opacity: 0.8;">${config.type}</div>
            <div style="font-size: 11px; margin-top: 4px; opacity: 0.6;">${error}</div>
          </div>
        </ha-card>
      `;
      return element.firstElementChild;
    },
  });
}

// Export the dependencies
export { LitElement, html, css };
