/**
 * Debug utilities for Simple Swipe Card
 */

import { DEBUG } from "./Constants.js";

// Configure which categories to show (can be modified for selective debugging)
const DEBUG_CATEGORIES = {
  EDITOR: true,
  EVENT: true,
  CONFIG: true,
  SWIPE: true,
  ERROR: true,
  INIT: true,
  SYSTEM: true,
  ELEMENT: true,
  AUTO: false, // Reduced by default due to frequency
  CARD_MOD: true,
  VISIBILITY: true,
  RESET: true,
};

// Rate limiting for frequent messages
const MESSAGE_THROTTLE = new Map();
const THROTTLE_DURATION = 5000; // 5 seconds

/**
 * Enhanced debugging function that categorizes log messages
 * @param {string} category - Category of the log message
 * @param {...any} args - Arguments to log
 */
export const logDebug = (category, ...args) => {
  if (!DEBUG) return;

  // Check if this category is enabled
  if (DEBUG_CATEGORIES[category] === false) return;

  // Create a message key for throttling
  const messageKey = `${category}:${args[0]}`;
  const now = Date.now();

  // Check if this message should be throttled
  if (MESSAGE_THROTTLE.has(messageKey)) {
    const lastTime = MESSAGE_THROTTLE.get(messageKey);
    if (now - lastTime < THROTTLE_DURATION) {
      return; // Skip this message
    }
  }

  // Update throttle time for messages that might be frequent
  const frequentCategories = ["AUTO", "SWIPE", "VISIBILITY"];
  const frequentMessages = [
    "Setting hass",
    "Visible cards updated",
    "Auto-swipe",
    "Updating slider",
  ];

  if (
    frequentCategories.includes(category) ||
    frequentMessages.some((msg) => args[0] && args[0].toString().includes(msg))
  ) {
    MESSAGE_THROTTLE.set(messageKey, now);
  }

  const categoryColors = {
    EDITOR: "color: #4caf50; font-weight: bold",
    EVENT: "color: #2196f3; font-weight: bold",
    CONFIG: "color: #ff9800; font-weight: bold",
    SWIPE: "color: #9c27b0; font-weight: bold",
    ERROR: "color: #f44336; font-weight: bold",
    INIT: "color: #795548; font-weight: bold",
    SYSTEM: "color: #00bcd4; font-weight: bold",
    DEFAULT: "color: #607d8b; font-weight: bold",
    ELEMENT: "color: #e91e63; font-weight: bold",
    AUTO: "color: #3f51b5; font-weight: bold",
    CARD_MOD: "color: #9932cc; font-weight: bold",
    VISIBILITY: "color: #ff5722; font-weight: bold",
    RESET: "color: #8bc34a; font-weight: bold",
  };

  const style = categoryColors[category] || categoryColors.DEFAULT;
  console.debug(`%cSimpleSwipeCard [${category}]:`, style, ...args);
};

/**
 * Enable/disable logging for specific categories
 * @param {string} category - Category to toggle
 * @param {boolean} enabled - Whether to enable logging for this category
 */
export const setDebugCategory = (category, enabled) => {
  DEBUG_CATEGORIES[category] = enabled;
  console.log(
    `SimpleSwipeCard: Debug category '${category}' ${enabled ? "enabled" : "disabled"}`,
  );
};

/**
 * Clear the message throttle cache
 */
export const clearDebugThrottle = () => {
  MESSAGE_THROTTLE.clear();
  console.log("SimpleSwipeCard: Debug throttle cache cleared");
};

/**
 * Show current debug configuration
 */
export const showDebugConfig = () => {
  console.log("SimpleSwipeCard Debug Configuration:", DEBUG_CATEGORIES);
};
