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
   * Updates the pagination dots to reflect current state
   */
  update() {
    // Update pagination dots - based on visible cards
    if (this.paginationElement) {
      const dots = this.paginationElement.querySelectorAll(".pagination-dot");
      dots.forEach((dot, i) => {
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
