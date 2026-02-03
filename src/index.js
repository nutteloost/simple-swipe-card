import { getHelpers } from "./core/Dependencies.js";
import { SimpleSwipeCard } from "./core/SimpleSwipeCard.js";
import { SimpleSwipeCardEditor } from "./core/SimpleSwipeCardEditor.js";
import { CARD_VERSION } from "./utils/Constants.js";
import { logDebug } from "./utils/Debug.js";

/**
 * CRITICAL: Register custom elements IMMEDIATELY and SYNCHRONOUSLY
 * This prevents race conditions where auto-entities or card-mod try to create
 * a simple-swipe-card before it's registered.
 *
 * The registration MUST happen at module load time, not after any async operations.
 */
console.log(
  "SimpleSwipeCard: Module loading, registering custom elements synchronously...",
);

// Register custom elements IMMEDIATELY - no async, no promises, no waiting
try {
  if (!customElements.get("simple-swipe-card")) {
    customElements.define("simple-swipe-card", SimpleSwipeCard);
    console.log("SimpleSwipeCard: simple-swipe-card element registered");
    logDebug("SYSTEM", "SimpleSwipeCard component registered (synchronous)");
  }

  if (!customElements.get("simple-swipe-card-editor")) {
    customElements.define("simple-swipe-card-editor", SimpleSwipeCardEditor);
    console.log("SimpleSwipeCard: simple-swipe-card-editor element registered");
    logDebug(
      "SYSTEM",
      "SimpleSwipeCardEditor component registered (synchronous)",
    );
  }
} catch (error) {
  console.error("SimpleSwipeCard: Failed to register custom elements:", error);
}

/**
 * Registers the card with Home Assistant's customCards registry
 */
function registerWithHomeAssistant() {
  const cardInfo = {
    type: "simple-swipe-card",
    name: "Simple Swipe Card",
    preview: true,
    description:
      "A swipeable container for multiple cards with touch and mouse gesture support, visibility conditions, and reset after timeout.",
  };

  // Ensure window.customCards exists
  if (!window.customCards) {
    window.customCards = [];
  }

  if (!window.customCards.some((card) => card.type === "simple-swipe-card")) {
    window.customCards.push(cardInfo);
    logDebug(
      "SYSTEM",
      "Card registered with Home Assistant customCards registry",
    );
  }
}

/**
 * Display version information in console
 */
function displayVersionInfo() {
  console.info(
    `%c SIMPLE-SWIPE-CARD %c v${CARD_VERSION} `,
    "color: white; background: #4caf50; font-weight: 700;",
    "color: #4caf50; background: white; font-weight: 700;",
  );
}

/**
 * Initialize additional features after registration
 * This is called asynchronously but the critical registration is already done
 */
function initializeAsync() {
  // Register with Home Assistant's customCards registry
  registerWithHomeAssistant();

  // Display version information
  displayVersionInfo();

  // Pre-load card helpers in the background (optional, for performance)
  const helpers = getHelpers();
  if (helpers && typeof helpers.then === "function") {
    helpers
      .then(() => {
        logDebug("SYSTEM", "Card helpers pre-loaded successfully");
      })
      .catch(() => {
        // Ignore errors - helpers will be loaded on demand
      });
  }
}

// Run async initialization
// Use multiple strategies to ensure it runs
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAsync, {
    once: true,
  });
} else {
  // Document already loaded, run immediately
  initializeAsync();
}

// Also register on window load as a fallback
window.addEventListener(
  "load",
  () => {
    // Double-check registration in case something went wrong
    if (
      !window.customCards?.some((card) => card.type === "simple-swipe-card")
    ) {
      registerWithHomeAssistant();
    }
  },
  { once: true },
);

// Export components for potential external use
export { SimpleSwipeCard, SimpleSwipeCardEditor };
