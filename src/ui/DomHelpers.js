/**
 * DOM manipulation utilities for Simple Swipe Card
 */

import { logDebug } from "../utils/Debug.js";

/**
 * Sets up a ResizeObserver to handle container resizing
 * @param {HTMLElement} cardContainer - Container element to observe
 * @param {Function} callback - Callback function when resize occurs
 * @returns {Object} Observer object with cleanup function
 */
export function setupResizeObserver(cardContainer, callback) {
  if (!cardContainer) return null;

  logDebug("INIT", "Setting up resize observer.");

  let resizeTimeout = null;

  const observer = new ResizeObserver((entries) => {
    window.requestAnimationFrame(() => {
      if (!cardContainer.isConnected) return;

      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;

        if (resizeTimeout) clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => {
          if (
            cardContainer &&
            ((newWidth > 0 && newWidth !== entry.previousWidth) ||
              (newHeight > 0 && newHeight !== entry.previousHeight))
          ) {
            logDebug("INIT", "Resize detected, recalculating layout.", {
              oldWidth: entry.previousWidth,
              newWidth,
              oldHeight: entry.previousHeight,
              newHeight,
            });
            callback(newWidth, newHeight);
          }
        }, 50);

        // Store previous dimensions for comparison
        entry.previousWidth = newWidth;
        entry.previousHeight = newHeight;
      }
    });
  });

  observer.observe(cardContainer);

  return {
    observer,
    cleanup: () => {
      logDebug("INIT", "Removing resize observer.");
      if (observer) {
        observer.disconnect();
      }
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
        resizeTimeout = null;
      }
    },
  };
}

/**
 * Creates the preview container for empty state
 * @param {string} swipeDirection - The swipe direction (horizontal/vertical)
 * @param {Function} editClickHandler - Handler for edit button click
 * @returns {HTMLElement} The preview container element
 */
export function createPreviewContainer(swipeDirection, editClickHandler) {
  const previewContainer = document.createElement("div");
  previewContainer.className = "preview-container";

  const iconContainer = document.createElement("div");
  iconContainer.className = "preview-icon-container";
  const icon = document.createElement("ha-icon");
  // Use appropriate icon based on swipe direction
  icon.icon =
    swipeDirection === "horizontal"
      ? "mdi:gesture-swipe-horizontal"
      : "mdi:gesture-swipe-vertical";
  iconContainer.appendChild(icon);

  const textContainer = document.createElement("div");
  textContainer.className = "preview-text-container";
  const title = document.createElement("div");
  title.className = "preview-title";
  title.textContent = "Simple Swipe Card";
  const description = document.createElement("div");
  description.className = "preview-description";
  description.textContent = `Create a swipeable container with multiple cards. Swipe ${swipeDirection === "horizontal" ? "horizontally" : "vertically"} between cards. Open the editor to add your first card.`;
  textContainer.appendChild(title);
  textContainer.appendChild(description);

  const actionsContainer = document.createElement("div");
  actionsContainer.className = "preview-actions";
  const addButton = document.createElement("ha-button");
  addButton.raised = true;
  addButton.textContent = "EDIT CARD";
  addButton.setAttribute("aria-label", "Edit Card");
  addButton.addEventListener("click", editClickHandler);
  actionsContainer.appendChild(addButton);

  previewContainer.appendChild(iconContainer);
  previewContainer.appendChild(textContainer);
  previewContainer.appendChild(actionsContainer);

  return previewContainer;
}

/**
 * Creates the empty state container for no visible cards
 * @returns {HTMLElement} The empty container element
 */
export function createEmptyContainer() {
  const emptyContainer = document.createElement("div");
  emptyContainer.className = "preview-container";
  emptyContainer.innerHTML = `
        <div class="preview-icon-container">
            <ha-icon icon="mdi:eye-off" style="color: var(--secondary-text-color); font-size: 48px; width: 48px; height: 48px;"></ha-icon>
        </div>
        <div class="preview-text-container">
            <div class="preview-title">No Visible Cards</div>
            <div class="preview-description">All cards in this swipe card are currently hidden due to their visibility conditions.</div>
        </div>
    `;
  return emptyContainer;
}

/**
 * Creates a slide element
 * @returns {HTMLElement} The slide element
 */
export function createSlide() {
  const slideDiv = document.createElement("div");
  slideDiv.className = "slide";
  return slideDiv;
}

/**
 * Applies border radius to slides to match container
 * @param {Array} cards - Array of card data objects
 * @param {HTMLElement} cardContainer - The card container element
 */
export function applyBorderRadiusToSlides(cards, cardContainer) {
  const cardBorderRadius = getComputedStyle(cardContainer).borderRadius;
  cards.forEach((cardData) => {
    if (cardData && cardData.slide) {
      cardData.slide.style.borderRadius = cardBorderRadius;
    }
  });
}

/**
 * Removes all margins from card slides to maintain transparency
 * @param {Array} cards - Array of card data objects
 */
export function removeCardMargins(cards) {
  cards.forEach((cardData) => {
    if (cardData && cardData.slide) {
      cardData.slide.style.marginRight = "0px";
      cardData.slide.style.marginLeft = "0px";
      cardData.slide.style.marginTop = "0px";
      cardData.slide.style.marginBottom = "0px";
    }
  });
}

/**
 * Sets up card-mod styles application
 * @param {Object} cardModConfig - Card-mod configuration
 * @param {ShadowRoot} shadowRoot - Shadow root to apply styles to
 * @param {HTMLElement} host - Host element
 * @param {HTMLElement} sliderElement - Slider element
 * @param {HTMLElement} paginationElement - Pagination element
 */
export function applyCardModStyles(
  cardModConfig,
  shadowRoot,
  host,
  sliderElement,
  paginationElement,
) {
  if (!cardModConfig || !shadowRoot) {
    logDebug(
      "CARD_MOD",
      "No card-mod config or shadow root, skipping style application",
    );
    return;
  }

  // Handle card-mod style string
  if (cardModConfig.style) {
    logDebug("CARD_MOD", "Applying card-mod styles");

    // Create a style element for card-mod styles
    const cardModStyle = document.createElement("style");
    cardModStyle.setAttribute("id", "card-mod-styles");

    // Add the style content
    cardModStyle.textContent = cardModConfig.style;

    // Remove any existing card-mod styles first
    const existingStyle = shadowRoot.querySelector("#card-mod-styles");
    if (existingStyle) {
      shadowRoot.removeChild(existingStyle);
    }

    // Add the new style element
    shadowRoot.appendChild(cardModStyle);

    // Forward CSS variables from host to shadow root for pagination styling
    if (host) {
      logDebug("CARD_MOD", "Forwarding CSS variables from host to shadow DOM");
      const hostStyles = window.getComputedStyle(host);
      const shadowElements = [
        shadowRoot.querySelector(".card-container"),
        sliderElement,
        paginationElement,
      ].filter(Boolean);

      // List of specific variables we want to forward
      const variablesToForward = [
        "--simple-swipe-card-pagination-dot-inactive-color",
        "--simple-swipe-card-pagination-dot-active-color",
        "--simple-swipe-card-pagination-dot-inactive-opacity",
        "--simple-swipe-card-pagination-dot-active-opacity",
        "--simple-swipe-card-pagination-dot-size",
        "--simple-swipe-card-pagination-dot-active-size",
        "--simple-swipe-card-pagination-border-radius",
        "--simple-swipe-card-pagination-dot-spacing",
        "--simple-swipe-card-pagination-background",
        "--simple-swipe-card-pagination-padding",
        "--simple-swipe-card-pagination-bottom",
        "--simple-swipe-card-pagination-right",
      ];

      shadowElements.forEach((element) => {
        if (!element) return;

        // Forward all matching CSS variables
        variablesToForward.forEach((variable) => {
          const value = hostStyles.getPropertyValue(variable);
          if (value) {
            logDebug("CARD_MOD", `Forwarding ${variable}: ${value}`);
            element.style.setProperty(variable, value);
          }
        });
      });
    }
  }
}

/**
 * Sets up a MutationObserver for card-mod style changes
 * @param {ShadowRoot} shadowRoot - Shadow root
 * @param {Function} reapplyCallback - Callback to reapply styles
 * @returns {MutationObserver} The observer instance
 */
export function setupCardModObserver(shadowRoot, reapplyCallback) {
  // Create observer to watch for style changes on the host element
  const observer = new MutationObserver((mutations) => {
    const styleChanged = mutations.some(
      (mutation) =>
        mutation.type === "attributes" &&
        (mutation.attributeName === "style" ||
          mutation.attributeName.includes("style")),
    );

    if (styleChanged) {
      logDebug(
        "CARD_MOD",
        "Host style attribute changed, reapplying card-mod styles",
      );
      reapplyCallback();
    }
  });

  if (shadowRoot && shadowRoot.host) {
    observer.observe(shadowRoot.host, {
      attributes: true,
      attributeFilter: ["style"],
    });
    logDebug("CARD_MOD", "Set up mutation observer for style changes");
  }

  return observer;
}
