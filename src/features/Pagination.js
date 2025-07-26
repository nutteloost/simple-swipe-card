/**
 * Pagination dots management for Simple Swipe Card
 */

import { logDebug } from "../utils/Debug.js";

/**
 * Pagination manager class
 */
export class Pagination {
  constructor(cardInstance) {
    this.card = cardInstance;
    this.paginationElement = null;
  }

  /**
   * Creates the pagination dots
   */
  create() {
    this.remove();
    const showPagination = this.card._config.show_pagination !== false;

    if (showPagination && this.card.visibleCardIndices.length > 1) {
      logDebug(
        "INIT",
        "Creating pagination for",
        this.card.visibleCardIndices.length,
        "visible cards",
      );
      this.paginationElement = document.createElement("div");
      this.paginationElement.className = `pagination ${this.card._swipeDirection}`;

      // Calculate and set fixed container dimensions based on configured dot sizes
      this._setFixedPaginationDimensions();

      // Use visible cards count for pagination
      for (let i = 0; i < this.card.visibleCardIndices.length; i++) {
        const dot = document.createElement("div");
        dot.className = "pagination-dot";
        if (i === this.card.currentIndex) dot.classList.add("active");
        dot.addEventListener("click", (e) => {
          e.stopPropagation();
          this.card.goToSlide(i);
        });
        this.paginationElement.appendChild(dot);
      }
      this.card.shadowRoot.appendChild(this.paginationElement);

      if (this.card._cardModConfig) {
        this.card._applyCardModStyles();
      }
    }
  }

  /**
   * Sets fixed pagination container dimensions to prevent layout shifts during animations
   * @private
   */
  _setFixedPaginationDimensions() {
    if (!this.paginationElement) return;

    // Wait for next frame to ensure styles are applied
    requestAnimationFrame(() => {
      // Read CSS custom properties from multiple potential sources
      const hostElement = this.card.shadowRoot?.host || this.card;
      const paginationStyle = getComputedStyle(this.paginationElement);
      const hostStyle = getComputedStyle(hostElement);

      // Helper function to parse CSS values
      const parseCSSValue = (value) => {
        if (!value || value === "") return null;
        const trimmed = value.trim();
        const parsed = parseInt(trimmed.replace(/px|rem|em/, ""));
        return isNaN(parsed) ? null : parsed;
      };

      // Try to read from pagination element first, then host
      const getCustomProperty = (property) => {
        return (
          parseCSSValue(paginationStyle.getPropertyValue(property)) ||
          parseCSSValue(hostStyle.getPropertyValue(property))
        );
      };

      // Read dot sizes with proper fallbacks
      const activeDotSize =
        getCustomProperty("--simple-swipe-card-pagination-dot-active-size") ||
        getCustomProperty("--simple-swipe-card-pagination-dot-size") ||
        8;
      const inactiveDotSize =
        getCustomProperty("--simple-swipe-card-pagination-dot-size") || 8;

      // Use the larger of the two sizes
      const maxDotSize = Math.max(activeDotSize, inactiveDotSize);

      // Read actual padding from CSS (default is "4px 8px")
      const paddingValue =
        paginationStyle
          .getPropertyValue("--simple-swipe-card-pagination-padding")
          .trim() || "4px 8px";
      const paddingParts = paddingValue.split(" ");
      const verticalPadding = parseCSSValue(paddingParts[0]) || 4;
      const totalVerticalPadding = verticalPadding * 2; // top + bottom

      const fixedDimension = maxDotSize + totalVerticalPadding;

      // Set FIXED dimensions based on direction
      if (this.card._swipeDirection === "horizontal") {
        this.paginationElement.style.height = `${fixedDimension}px`;
        this.paginationElement.style.minHeight = "unset";
      } else {
        const horizontalPadding =
          parseCSSValue(paddingParts[1] || paddingParts[0]) || 8;
        const totalHorizontalPadding = horizontalPadding * 2; // left + right
        const fixedWidth = maxDotSize + totalHorizontalPadding;
        this.paginationElement.style.width = `${fixedWidth}px`;
        this.paginationElement.style.minWidth = "unset";
      }

      logDebug("INIT", "Set FIXED pagination dimensions:", {
        activeDotSize,
        inactiveDotSize,
        maxDotSize,
        totalVerticalPadding,
        fixedDimension: `${fixedDimension}px`,
        direction: this.card._swipeDirection,
        paddingValue,
      });
    });
  }

  /**
   * Updates the pagination dots to reflect current state
   */
  update() {
    // Update pagination dots - always based on visible cards, never duplicates
    if (this.paginationElement) {
      const dots = this.paginationElement.querySelectorAll(".pagination-dot");
      dots.forEach((dot, i) => {
        // Always use currentIndex (which represents the virtual position)
        dot.classList.toggle("active", i === this.card.currentIndex);
      });
    }
  }

  /**
   * Updates pagination visibility and layout
   */
  updateLayout() {
    const showPagination = this.card._config.show_pagination !== false;

    // Update pagination visibility - use visible cards count
    if (showPagination && this.card.visibleCardIndices.length > 1) {
      if (!this.paginationElement) {
        this.create();
      } else {
        this.paginationElement.style.display = "flex";
      }
    } else if (this.paginationElement) {
      this.paginationElement.style.display = "none";
    }
  }

  /**
   * Removes the pagination element
   */
  remove() {
    if (this.paginationElement) {
      this.paginationElement.remove();
      this.paginationElement = null;
    }
  }
}
