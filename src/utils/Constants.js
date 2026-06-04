/**
 * Constants for Simple Swipe Card
 */

// Version management
export const CARD_VERSION = "3.0.0";

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
  swipe_effect: "slide",
  scroll_strategy: "js",
  enable_auto_swipe: false,
  auto_swipe_interval: 2000,
  enable_reset_after: false,
  reset_after_timeout: 30000,
  reset_target_card: 1,
  view_mode: "single",
  carousel_alignment: "start",
  cards_visible: 2.5,
  card_min_width: 200,
  auto_height: false,
  enable_backdrop_filter: false,
};

// Swipe gesture constants
export const SWIPE_CONSTANTS = {
  gestureThreshold: 8,
  clickBlockDuration: 300,
  swipeVelocityThreshold: 0.3,
};

// Interactive form-control host elements. Tapping these must operate the control,
// never start a swipe and never have its click blocked. Covers Web Awesome
// (`wa-*`, the target of HA's ongoing 2026.5+ migration), legacy Material
// (`mwc-*`), and Home Assistant wrappers (`ha-*`). The host element reliably
// appears in the event composedPath even when an inner part (thumb/control/label
// span) is the actual tap target - which is precisely why per-element role/tag
// checks alone missed the migrated controls (see #112). New `ha-*`/`wa-*` form
// controls should be added here as HA migrates them.
export const INTERACTIVE_CONTROL_TAGS = [
  // Switches / checkboxes (migrated to Web Awesome in HA 2026.5)
  "ha-switch",
  "wa-switch",
  "mwc-switch",
  "ha-checkbox",
  "wa-checkbox",
  "mwc-checkbox",
  // Radios (HA 2026.6 removed ha-radio in favour of ha-radio-group/ha-radio-option)
  "ha-radio",
  "wa-radio",
  "mwc-radio",
  "ha-radio-group",
  "ha-radio-option",
  "wa-radio-group",
  // Dropdowns / pickers (opening these must not swipe)
  "ha-select",
  "wa-select",
  "mwc-select",
  "ha-combo-box",
  "wa-combobox",
  "ha-entity-picker",
  // Text inputs (the native input/textarea is usually the tap target and is
  // already detected, but list the hosts so detection never depends on that)
  "ha-textfield",
  "wa-textfield",
  "mwc-textfield",
  "ha-textarea",
  "wa-textarea",
  "mwc-textarea",
  // Entity toggle wrapper used by HA entity rows
  "ha-entity-toggle",
];

// Button host elements - never start a swipe, always allow the click/tap.
export const BUTTON_CONTROL_TAGS = [
  "button",
  "ha-button",
  "wa-button",
  "mwc-button",
  "paper-button",
  "ha-icon-button",
  "wa-icon-button",
  "mwc-icon-button",
];

// Slider host elements. Matched by tag (in addition to the existing role/class
// checks) so a migrated slider whose visible thumb is a non-semantic span - the
// same shape as the #112 switch bug - is still recognised as interactive.
export const SLIDER_CONTROL_TAGS = [
  "ha-slider",
  "wa-slider",
  "md-slider",
  "mwc-slider",
  "paper-slider",
];

// Global state management
export const GLOBAL_STATE = {
  dialogStack: "_simpleSwipeDialogStack",
  editorRegistry: "_simpleSwipeEditorRegistry",
  cardEditors: "_simpleSwipeCardEditors",
};
