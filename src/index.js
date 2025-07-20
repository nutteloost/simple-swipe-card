import { ensureDependencies, getHelpers } from "./core/Dependencies.js";
import { SimpleSwipeCard } from "./core/SimpleSwipeCard.js";
import { SimpleSwipeCardEditor } from "./core/SimpleSwipeCardEditor.js";
import { CARD_VERSION } from "./utils/Constants.js";
import { logDebug } from "./utils/Debug.js";

/**
 * Initialize the card after dependencies are loaded
 */
async function initializeCard() {
  try {
    // Ensure all dependencies are loaded
    await ensureDependencies();

    logDebug("SYSTEM", "Dependencies loaded, registering components");

    // Register the custom elements
    if (!customElements.get("simple-swipe-card")) {
      customElements.define("simple-swipe-card", SimpleSwipeCard);
      logDebug("SYSTEM", "SimpleSwipeCard component registered");
    }

    if (!customElements.get("simple-swipe-card-editor")) {
      customElements.define("simple-swipe-card-editor", SimpleSwipeCardEditor);
      logDebug("SYSTEM", "SimpleSwipeCardEditor component registered");
    }

    // Register with Home Assistant
    registerWithHomeAssistant();

    // Display version information
    displayVersionInfo();
  } catch (error) {
    console.error("SimpleSwipeCard: Failed to initialize:", error);
  }
}

/**
 * Registers the card with Home Assistant
 */
function registerWithHomeAssistant() {
  const cardInfo = {
    type: "simple-swipe-card",
    name: "Simple Swipe Card",
    preview: true,
    description:
      "A swipeable container for multiple cards with touch and mouse gesture support, visibility conditions, and reset after timeout.",
  };

  if (
    window.customCards &&
    !window.customCards.some((card) => card.type === "simple-swipe-card")
  ) {
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
 * Initialize based on loading state
 */
function initialize() {
  if (getHelpers()) {
    // Card helpers are available, initialize with them
    getHelpers()
      .then(() => {
        registerWithHomeAssistant();
        initializeCard();
      })
      .catch((e) => {
        console.error("SimpleSwipeCard: Error waiting for Card Helpers:", e);
        // Fallback initialization
        initializeCard();
      });
  } else if (window.customCards) {
    // customCards registry exists, register and initialize
    registerWithHomeAssistant();
    initializeCard();
  } else {
    // Wait for window load event as fallback
    if (document.readyState === "loading") {
      window.addEventListener(
        "load",
        () => {
          registerWithHomeAssistant();
          initializeCard();
        },
        { once: true },
      );
    } else {
      // Document already loaded
      setTimeout(() => {
        registerWithHomeAssistant();
        initializeCard();
      }, 100);
    }
  }
}

// Start initialization
initialize();

// Export components for potential external use
export { SimpleSwipeCard, SimpleSwipeCardEditor };
