/**
 * Constants for Simple Swipe Card
 */

// Version management
export const CARD_VERSION = "2.5.1";

// Debug configuration - set to false for production
export const DEBUG = true;

// Debug level configuration (can be modified for development)
export const DEBUG_LEVEL = {
  MINIMAL: 1, // Only errors and critical messages
  NORMAL: 2, // Standard debugging (default)
  VERBOSE: 3, // All debug messages including frequent ones
};

// Current debug level (change this to adjust verbosity)
export const CURRENT_DEBUG_LEVEL = DEBUG_LEVEL.NORMAL;

// Default configuration values
export const DEFAULT_CONFIG = {
  cards: [],
  show_pagination: true,
  card_spacing: 15,
  loop_mode: "none",
  swipe_direction: "horizontal",
  swipe_behavior: "single",
  enable_auto_swipe: false,
  auto_swipe_interval: 2000,
  enable_reset_after: false,
  reset_after_timeout: 30000,
  reset_target_card: 1,
  view_mode: "single",
  cards_visible: 2.5,
  card_min_width: 200,
};

// Swipe gesture constants
export const SWIPE_CONSTANTS = {
  gestureThreshold: 8,
  clickBlockDuration: 300,
  swipeVelocityThreshold: 0.3,
};

// Global state management
export const GLOBAL_STATE = {
  dialogStack: "_simpleSwipeDialogStack",
  editorRegistry: "_simpleSwipeEditorRegistry",
  cardEditors: "_simpleSwipeCardEditors",
};
