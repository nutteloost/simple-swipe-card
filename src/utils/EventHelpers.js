/**
 * Event handling utilities for Simple Swipe Card
 */

import { logDebug } from "./Debug.js";
import { fireEvent } from "../core/Dependencies.js";

/**
 * Fires a config-changed event with proper identification
 * @param {HTMLElement} element - Element to fire event from
 * @param {Object} config - Configuration object
 * @param {Object} [extraData] - Additional data to include in the event
 */
export function fireConfigChanged(element, config, extraData = {}) {
  if (!config) return;

  // Determine if the event should bubble based on maintainEditorState
  const shouldBubble = !extraData.maintainEditorState;

  // Create a custom event
  const event = new CustomEvent("config-changed", {
    detail: {
      config: config,
      ...extraData,
    },
    bubbles: shouldBubble, // Set bubbles based on maintainEditorState
    composed: true, // Cross shadow DOM boundary
  });

  logDebug("EVENT", "Firing config-changed event", {
    bubble: shouldBubble,
    ...extraData,
  });
  element.dispatchEvent(event);
}

/**
 * Safely fires a Home Assistant event using fireEvent
 * @param {HTMLElement} element - Element to fire event from
 * @param {string} type - Event type
 * @param {Object} detail - Event detail object
 */
export function fireHAEvent(element, type, detail = {}) {
  try {
    fireEvent(element, type, detail);
  } catch (error) {
    logDebug("ERROR", "Failed to fire HA event:", type, error);
    // Fallback to standard CustomEvent
    const event = new CustomEvent(type, {
      detail,
      bubbles: true,
      composed: true,
    });
    element.dispatchEvent(event);
  }
}

/**
 * Gets transition CSS properties with fallbacks
 * @param {boolean} animate - Whether to apply animation
 * @param {HTMLElement} [element] - Element to get computed styles from
 * @param {string} [customEasing] - Optional custom easing function to override default
 * @returns {string} - Transition style value
 */
export function getTransitionStyle(
  animate,
  element = null,
  customEasing = null,
) {
  if (!animate) return "none";

  // Check if user prefers reduced motion
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    return "none";
  }

  // Get computed values if connected to DOM
  let speed = "0.3s";
  let easing = customEasing || "ease-out";

  if (element && element.isConnected) {
    const computedStyle = getComputedStyle(element);
    const speedValue = computedStyle
      .getPropertyValue("--simple-swipe-card-transition-speed")
      .trim();
    const easingValue = computedStyle
      .getPropertyValue("--simple-swipe-card-transition-easing")
      .trim();

    if (speedValue) speed = speedValue;
    // Only use CSS easing if no custom easing was provided
    if (!customEasing && easingValue) easing = easingValue;
  }

  return `transform ${speed} ${easing}`;
}

/**
 * Handles edit button click in preview mode
 * @param {Event} e - Click event
 * @param {HTMLElement} element - Element to fire event from
 */
export function handleEditClick(e, element) {
  e.stopPropagation();
  logDebug("EDITOR", "Edit button clicked, firing show-edit-card event");
  fireHAEvent(element, "show-edit-card", { element: element });
}

/**
 * Sets up global dialog stack if not exists
 */
export function initializeGlobalDialogStack() {
  if (!window._simpleSwipeDialogStack) {
    window._simpleSwipeDialogStack = [];
  }
}

/**
 * Gets or creates a global registry
 * @param {string} registryName - Name of the registry
 * @returns {Map|Set} The registry object
 */
export function getGlobalRegistry(registryName, type = "Map") {
  if (!window[registryName]) {
    window[registryName] = type === "Set" ? new Set() : new Map();
  }
  return window[registryName];
}
