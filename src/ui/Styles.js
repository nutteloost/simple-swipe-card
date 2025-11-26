/**
 * CSS styles for Simple Swipe Card
 */

import { css } from "../core/Dependencies.js";

/**
 * Gets the complete CSS styles for the Simple Swipe Card
 * @returns {string} CSS styles
 */
export function getStyles() {
  return `
     :host {
        display: block;
        /* Default: overflow hidden prevents scrollbars and works with expander-card */
        overflow: hidden;
        width: 100%;
        height: 100%;
        position: relative;
        border-radius: var(--ha-card-border-radius, 12px);
        background: transparent;
        /* Prevent horizontal scrolling on touch devices while allowing vertical scrolling */
        touch-action: pan-y pinch-zoom;
        /* Ensure dropdowns appear above cards positioned below this one */
        z-index: 1;
     }

     /* When dropdown is open: switch to visible overflow with clip-path
        to allow vertical dropdown overflow while still clipping horizontally */
     :host(.dropdown-open) {
        overflow: visible;
        z-index: 100;
     }

     :host(.dropdown-open:not([data-enable-backdrop-filter])) {
        clip-path: polygon(
          0 -100vh,
          100% -100vh,
          100% calc(100% + 100vh),
          0 calc(100% + 100vh)
        );
     }

     :host([data-vertical-no-grid]:not([data-editor-mode])) {
       height: 250px; /* Set a reasonable default height for the whole card */
     }

     :host([data-vertical-no-grid]:not([data-editor-mode])) .card-container {
       height: 100%;
       max-height: 100%;
     }

     :host([data-vertical-no-grid]:not([data-editor-mode])) .slider[data-swipe-direction="vertical"] {
       height: 100%;
       max-height: 100%;
     }

     :host([data-vertical-no-grid]:not([data-editor-mode])) .slider[data-swipe-direction="vertical"] .slide {
       height: 100%;
       min-height: 100%;
       max-height: 100%;
       flex: 0 0 100%;
     } 

     /* Auto Height Mode */
     :host([data-auto-height]:not([data-editor-mode])) .card-container {
       height: auto;
       transition: height 0.2s ease-out;
     }

     :host([data-auto-height]:not([data-editor-mode])) .slider[data-swipe-direction="horizontal"] {
       height: auto;
       align-items: flex-start; /* prevents flex from stretching children */
     }

     :host([data-auto-height]:not([data-editor-mode])) .slider[data-swipe-direction="horizontal"] .slide {
       height: auto;
       min-height: 0;
       max-height: none;
       flex-basis: auto;
     }

     /* Override child card heights */
     :host([data-auto-height]:not([data-editor-mode])) .slide > * > ha-card,
     :host([data-auto-height]:not([data-editor-mode])) .slide > * > .card-content {
       height: auto;
     } 

     /* --- START PREVIEW STYLES --- */
     .preview-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 16px;
        box-sizing: border-box;
        height: 100%;
        background: var(--ha-card-background, var(--card-background-color, white));
        border-radius: var(--ha-card-border-radius, 12px);
        border: none; /* Ensure no border */
     }
     .preview-icon-container {
        margin-bottom: 16px;
     }
     .preview-icon-container ha-icon {
        color: var(--primary-color, #03a9f4); /* Use primary color for consistency */
        font-size: 48px; /* Match Actions Card */
        width: 48px;
        height: 48px;
     }
     .preview-text-container {
        margin-bottom: 16px;
     }
     .preview-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 8px;
        color: var(--primary-text-color);
     }
     .preview-description {
        font-size: 14px;
        color: var(--secondary-text-color);
        max-width: 300px;
        line-height: 1.4;
        margin: 0 auto; /* Center description text block */
     }
     .preview-actions ha-button {
       /* Rely on default raised button styles for consistency */
     }
     /* --- END PREVIEW STYLES --- */

     .card-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: visible;
        border-radius: inherit;
        background: transparent;
        will-change: contents; /* Hint browser for optimization */
        isolation: isolate; /* Create stacking context for proper z-index behavior */
        /* Prevent horizontal scrolling while allowing vertical */
        touch-action: pan-y pinch-zoom;
     }

     /* Horizontal swipe: Clip horizontally but allow vertical overflow for dropdowns */
     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */
     :host(:not([data-enable-backdrop-filter])) .card-container:has(.slider[data-swipe-direction="horizontal"]) {
        clip-path: polygon(
          0 -100vh,                    /* top-left, extended upward */
          100% -100vh,                 /* top-right, extended upward */
          100% calc(100% + 100vh),     /* bottom-right, extended downward */
          0 calc(100% + 100vh)         /* bottom-left, extended downward */
        );
     }

     /* Vertical swipe: No container clipping by default - we apply selective clipping to inactive slides */
     /* But during animations, we temporarily enable container clipping via .animating class */
     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */
     :host(:not([data-enable-backdrop-filter])) .card-container:has(.slider[data-swipe-direction="vertical"]) {
        clip-path: none;
     }

     /* Vertical swipe DURING ANIMATION: Use container clipping to show only viewport */
     /* This prevents both slides from being visible during the transition */
     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */
     :host(:not([data-enable-backdrop-filter])) .card-container:has(.slider[data-swipe-direction="vertical"].animating) {
        clip-path: polygon(
          -100vw 0,                    /* top-left, extended leftward for dropdown overflow */
          calc(100% + 100vw) 0,        /* top-right, extended rightward */
          calc(100% + 100vw) 100%,     /* bottom-right, clip at container bottom */
          -100vw 100%                  /* bottom-left, clip at container bottom */
        );
     }

    /* Carousel mode: clip horizontally at container boundaries, allow vertical overflow */
    /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */
    :host(:not([data-enable-backdrop-filter])) .card-container:has(.slider[data-view-mode="carousel"]) {
      clip-path: polygon(
        0 -100vh,                    /* top-left, clip at edge but extend upward */
        100% -100vh,                 /* top-right, clip at edge but extend upward */
        100% calc(100% + 100vh),     /* bottom-right, clip at edge but extend downward */
        0 calc(100% + 100vh)         /* bottom-left, clip at edge but extend downward */
      );
    }

     .slider {
        position: relative;
        display: flex;
        height: 100%;
        transition: transform var(--simple-swipe-card-transition-speed, 0.3s) var(--simple-swipe-card-transition-easing, ease-out);
        will-change: transform;
        background: transparent;
        backface-visibility: hidden; /* Reduce repaints */
        z-index: 2; /* Above pagination - transform creates stacking context */
        pointer-events: none;
     }

     /* Horizontal slider (default) */
     .slider[data-swipe-direction="horizontal"] {
        flex-direction: row;
     }
     
     /* Vertical slider */
     .slider[data-swipe-direction="vertical"] {
        flex-direction: column;
        height: 100%;
        max-height: 100%;
        overflow: visible; /* Allow transforms to move content outside */
        flex-wrap: nowrap;
     }
     
     .slide {
        flex: 0 0 100%;
        width: 100%;
        min-width: 100%;
        height: 100%;
        min-height: 100%;
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: column;
        overflow: visible;
        background: transparent;
        z-index: 2; /* Above pagination (z-index: 1) */
        transform: translateZ(0); /* Force GPU acceleration for better iOS/Safari rendering */
        -webkit-transform: translateZ(0);
        pointer-events: none; /* Allow clicks to pass through to elements below/behind */
     }

     /* Vertical mode: Clip inactive slides to hide adjacent cards */
     /* BUT: During animation, disable per-slide clipping to show smooth transition */
     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */
     :host(:not([data-enable-backdrop-filter])) .slider[data-swipe-direction="vertical"]:not(.animating) .slide:not(.active-slide) {
        /* Clip to zero height - makes slide invisible while keeping it in DOM */
        clip-path: inset(0 0 100% 0);
     }

     /* Vertical mode DURING ANIMATION: All slides visible (no per-slide clipping) */
     /* Container clipping handles viewport boundaries */
     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */
     :host(:not([data-enable-backdrop-filter])) .slider[data-swipe-direction="vertical"].animating .slide {
        clip-path: none;
     }

     /* Vertical mode AFTER ANIMATION: Active slide has no clipping, allowing dropdowns to overflow */
     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */
     :host(:not([data-enable-backdrop-filter])) .slider[data-swipe-direction="vertical"]:not(.animating) .slide.active-slide {
        clip-path: none;
     }

     /* ========== BACKDROP FILTER MODE ========== */
     /* When backdrop-filter is enabled, use overflow: hidden to clip adjacent cards */
     /* Note: overflow: hidden may conflict with backdrop-filter in some browsers, */
     /* but it's the only option that doesn't completely break the functionality */

     :host([data-enable-backdrop-filter]) .card-container {
        overflow: hidden;
     }

     /* ========== END BACKDROP FILTER MODE ========== */

    .slide.carousel-mode {
      flex: 0 0 auto; /* Don't grow/shrink, use calculated width */
      width: var(--carousel-card-width); /* Will be set dynamically */
      min-width: var(--carousel-card-width);
    }

    /* Carousel container adjustments */
    .slider[data-view-mode="carousel"] {
      /* Allow overflow to show partial cards */
      overflow: visible;
    }

    .card-container[data-view-mode="carousel"] {
      /* Ensure container can handle overflow */
      overflow: visible;
      position: relative;
    }

    /* Z-INDEX HIERARCHY (within .card-container stacking context):
     * 1. pagination (z-index: 1) - Bottom layer, behind all slide content
     * 2. .slider (z-index: 2) - Above pagination (transform creates stacking context)
     *    â””â”€ .slide (z-index: 2) - Within slider's stacking context
     *       â””â”€ .slide > *:first-child (z-index: 3) - Ensures dropdowns appear above everything
     *
     * This hierarchy fixes:
     * - Android: Dropdowns now appear above pagination dots and other cards
     * - iOS: Hardware acceleration (translateZ) improves rendering
     */
    .pagination {
        position: absolute;
        display: flex;
        justify-content: center;
        z-index: 1; /* Lowest layer - behind slides and dropdowns */
        background-color: var(--simple-swipe-card-pagination-background, transparent);
        pointer-events: auto;
        transition: opacity 0.2s ease-in-out;
        padding: var(--simple-swipe-card-pagination-padding, 4px 8px);
        border-radius: 12px;
        /* Prevent container from sizing to content during animations */
        box-sizing: border-box;
    }

    /* Horizontal pagination (bottom) */
    .pagination.horizontal {
        bottom: var(--simple-swipe-card-pagination-bottom, 8px);
        left: 50%;
        transform: translateX(-50%);
        flex-direction: row;
        align-items: center;
        /* Remove any height properties - will be set by JavaScript */
    }

    /* Vertical pagination (right) */
    .pagination.vertical {
        right: var(--simple-swipe-card-pagination-right, 8px);
        top: 50%;
        transform: translateY(-50%);
        flex-direction: column;
        align-items: center;
        /* Remove any width properties - will be set by JavaScript */
    }
    
     .pagination.hide {
        opacity: 0;
        pointer-events: none;
     }

    .pagination-dot {
        width: var(--simple-swipe-card-pagination-dot-size, 8px);
        height: var(--simple-swipe-card-pagination-dot-size, 8px);
        border-radius: var(--simple-swipe-card-pagination-border-radius, 50%);
        background-color: var(--simple-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6));
        cursor: pointer;
        opacity: var(--simple-swipe-card-pagination-dot-inactive-opacity, 1);
        
        /* Border support */
        border-width: var(--simple-swipe-card-pagination-dot-border-width, 0px);
        border-color: var(--simple-swipe-card-pagination-dot-border-color, transparent);
        border-style: var(--simple-swipe-card-pagination-dot-border-style, solid);
        
        /* Box shadow support */
        box-shadow: var(--simple-swipe-card-pagination-dot-box-shadow, none);
        
        /* Updated transition to include new animatable properties */
        transition: background-color 0.2s ease, width 0.2s ease, height 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    }
    
    /* Hover effects */
    .pagination-dot:hover {
        background-color: var(--simple-swipe-card-pagination-dot-hover-color, var(--simple-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6)));
        opacity: var(--simple-swipe-card-pagination-dot-hover-opacity, var(--simple-swipe-card-pagination-dot-inactive-opacity, 1));
        border-color: var(--simple-swipe-card-pagination-dot-hover-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent));
        transform: var(--simple-swipe-card-pagination-dot-hover-transform, none);
        box-shadow: var(--simple-swipe-card-pagination-dot-hover-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none));
    }    

    /* Active hover state */
    .pagination-dot.active:hover {
        background-color: var(--simple-swipe-card-pagination-dot-active-hover-color, var(--simple-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4)));
        opacity: var(--simple-swipe-card-pagination-dot-active-hover-opacity, var(--simple-swipe-card-pagination-dot-active-opacity, 1));
        border-color: var(--simple-swipe-card-pagination-dot-active-hover-border-color, var(--simple-swipe-card-pagination-dot-active-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent)));
        transform: var(--simple-swipe-card-pagination-dot-active-hover-transform, var(--simple-swipe-card-pagination-dot-hover-transform, none));
        box-shadow: var(--simple-swipe-card-pagination-dot-active-hover-box-shadow, var(--simple-swipe-card-pagination-dot-active-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none)));
    }    

    /* Spacing for horizontal pagination dots */
    .pagination.horizontal .pagination-dot {
        margin: 0 var(--simple-swipe-card-pagination-dot-spacing, 4px);
    }
    
    /* Spacing for vertical pagination dots */
    .pagination.vertical .pagination-dot {
        margin: var(--simple-swipe-card-pagination-dot-spacing, 4px) 0;
    }
    
    .pagination-dot.active {
        background-color: var(--simple-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4));
        width: var(--simple-swipe-card-pagination-dot-active-size, var(--simple-swipe-card-pagination-dot-size, 8px));
        height: var(--simple-swipe-card-pagination-dot-active-size, var(--simple-swipe-card-pagination-dot-size, 8px));
        opacity: var(--simple-swipe-card-pagination-dot-active-opacity, 1);
        
        /* Separate active border radius */
        border-radius: var(--simple-swipe-card-pagination-dot-active-border-radius, var(--simple-swipe-card-pagination-border-radius, 50%));
        
        /* Active border support */
        border-width: var(--simple-swipe-card-pagination-dot-active-border-width, var(--simple-swipe-card-pagination-dot-border-width, 0px));
        border-color: var(--simple-swipe-card-pagination-dot-active-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent));
        border-style: var(--simple-swipe-card-pagination-dot-active-border-style, var(--simple-swipe-card-pagination-dot-border-style, solid));
        
        /* Active box shadow support */
        box-shadow: var(--simple-swipe-card-pagination-dot-active-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none));
    }

     ha-alert {
        display: block;
        margin: 0;
        width: 100%;
        box-sizing: border-box;
        border-radius: 0;
        border: none;
        background-color: transparent;
     }
     .slide > *:first-child {
        flex-grow: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        min-height: 0;
        overflow: visible !important;
        position: relative;
        z-index: 3; /* Above slides and pagination - ensures dropdowns are on top */
        pointer-events: auto; /* Re-enable pointer events for card content */
     }
     .slide > * > ha-card,
     .slide > * > .card-content {
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        border: none !important;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: visible !important;
        position: relative;
        z-index: 3; /* Same as parent - maintains stacking for dropdowns */
     }

     /* Mushroom-select dropdown positioning fix */
     /* Note: The fixedMenuPosition property is disabled via JavaScript in CardBuilder.js */
     /* This ensures dropdowns work correctly with CSS transforms applied to slides */
     /* For vertical mode: Active slide has no clip-path, allowing dropdown overflow */
     /* Inactive slides are clipped to hide adjacent cards */

     /* Reduced Motion Support - Automatically disable animations when user prefers reduced motion */
     @media (prefers-reduced-motion: reduce) {
        /* Disable slide transitions */
        .slider {
           transition: none !important;
        }

        /* Disable auto-height transitions */
        :host([data-auto-height]:not([data-editor-mode])) .card-container {
           transition: none !important;
        }

        /* Disable pagination transitions */
        .pagination {
           transition: none !important;
        }

        .pagination-dot {
           transition: none !important;
        }
     }
   `;
}

/**
 * Gets the editor CSS styles
 * @returns {CSSResult} LitElement CSS styles
 */
export const getEditorStyles = () => css`
  .card-config {
    /* Let HA handle padding */
  }

  .info-panel {
    display: flex;
    align-items: center;
    padding: 12px;
    margin: 8px 0 24px 0;
    background-color: var(--primary-background-color);
    border-radius: 8px;
    border: 1px solid var(--divider-color);
  }

  .info-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--info-color, #2196f3);
    color: white;
    margin-right: 12px;
    flex-shrink: 0;
    font-size: 14px;
  }

  .info-text {
    flex-grow: 1;
    color: var(--primary-text-color);
    font-size: 14px;
  }

  /* MAIN SECTION STYLES */
  .section {
    margin: 16px 0;
    padding: 16px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 8px);
    background-color: var(
      --card-background-color,
      var(--primary-background-color)
    );
  }

  .section-header {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 12px;
    color: var(--primary-text-color);
  }

  .option-row {
    display: flex;
    align-items: anchor-center;
    justify-content: space-between;
    padding: 6px 0;
    min-height: 36px;
  }

  .option-left {
    flex: 1;
    margin-right: 12px;
    display: flex;
    flex-direction: column;
  }

  .option-label {
    font-size: 14px;
    color: var(--primary-text-color);
    margin: 0 0 2px 0;
    line-height: 1.2;
  }

  .option-help {
    color: var(--secondary-text-color);
    font-size: 12px;
    line-height: 1.3;
    margin: 0;
    max-width: 100%;
    margin-top: 8px;
  }

  .option-control {
    flex-shrink: 0;
    align-self: flex-start;
    margin-top: 2px; /* Small offset to align with label baseline */
  }

  .option-row:not(:last-of-type) {
    margin-bottom: 4px;
  }

  .option-row + .help-text {
    margin-top: -8px; /* Small negative margin for close spacing */
    margin-bottom: 16px;
    margin-left: 0;
  }

  .help-text + .option-row {
    margin-top: 10px;
  }

  .option-label {
    flex: 1;
    margin-right: 12px;
    font-size: 14px;
    color: var(--primary-text-color);
    margin: 0;
  }

  .help-text {
    color: var(--secondary-text-color);
    font-size: 12px;
    margin-top: 4px;
    margin-bottom: 8px;
    line-height: 1.3;
  }

  .help-text:last-child {
    margin-bottom: 4px; /* Even smaller for last help text */
  }

  .pagination-option {
    margin-bottom: -12px !important;
  }

  /* ADVANCED OPTIONS - COLLAPSIBLE SECTION */
  .collapsible-section {
    margin: 16px 0;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 8px);
    background-color: var(
      --card-background-color,
      var(--primary-background-color)
    );
    overflow: visible;
    position: relative;
  }

  .collapsible-section .section-content {
    overflow: visible; /* Allow dropdowns to overflow */
    position: relative;
  }

  /* Ensure ha-select dropdowns can overflow the collapsible container */
  .collapsible-section ha-select {
    position: relative;
    z-index: 100; /* Ensure dropdown appears above other content */
  }

  /* Make sure the dropdown menu itself has proper z-index */
  .collapsible-section ha-select mwc-menu {
    z-index: 1000;
  }

  .collapsible-section .section-toggle {
    padding: 16px;
    margin: 0;
    background-color: inherit;
  }

  .collapsible-section .section-toggle:hover {
    background-color: var(--secondary-background-color);
  }

  .collapsible-section .section-content.expanded::before {
    content: "";
    display: block;
    height: 1px;
    background-color: var(--divider-color);
    margin: 0 -16px 16px -16px;
  }

  .collapsible-section .section-content.expanded {
    padding: 0 16px 16px 16px;
    background-color: inherit;
  }

  .section-toggle {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px 0;
    border-bottom: 1px solid var(--divider-color);
    margin-bottom: 12px;
    user-select: none;
  }

  .section-toggle:hover {
    background-color: var(--secondary-background-color);
    border-radius: 4px;
  }

  .section-toggle.expanded {
    background-color: var(--secondary-background-color);
    border-radius: 4px;
  }

  .section-toggle-icon {
    margin-right: 8px;
    transition: transform 0.2s ease;
    color: var(--secondary-text-color);
  }

  .section-toggle-icon.expanded {
    transform: rotate(90deg);
  }

  .section-toggle-title {
    font-size: 15px;
    font-weight: 500;
    color: var(--primary-text-color);
    flex-grow: 1;
  }

  .section-toggle-badge {
    background-color: var(--primary-color);
    color: var(--text-primary-color);
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 500;
    margin-left: 8px;
  }

  .section-toggle-badge.blocked-status {
    background-color: var(--warning-color, #ff9800);
    color: var(--text-primary-color);
  }

  .section-toggle-badge.mixed-status {
    background-color: var(--info-color, #2196f3);
    color: var(--text-primary-color);
    font-size: 10px;
  }

  .section-toggle-badge.blocked-only {
    background-color: var(--warning-color, #ff9800);
    color: var(--text-primary-color);
    margin-left: 4px; /* Small gap between badges */
  }

  .section-content {
    overflow: hidden;
    transition:
      max-height 0.3s ease,
      opacity 0.2s ease;
  }

  .section-content.collapsed {
    max-height: 0;
    opacity: 0;
  }

  .section-content.expanded {
    max-height: 500px;
    opacity: 1;
    overflow: visible;
  }

  .compact-options .option-row {
    padding: 8px 0;
    min-height: 20px;
  }

  .compact-options .option-row + .help-text {
    margin-top: -8px; /* Same small negative margin */
    margin-bottom: 12px;
  }

  .compact-options ha-textfield + .help-text {
    margin-top: 4px;
    margin-bottom: 8px;
  }

  .compact-options .help-text + ha-textfield {
    margin-top: 10px;
  }

  /* CARDS SECTION */
  .card-list {
    margin-top: 8px;
    margin-bottom: 16px;
  }

  .card-row {
    display: flex;
    align-items: center;
    padding: 8px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 4px);
    margin-bottom: 6px;
    background: var(--secondary-background-color);
  }

  .card-row.hidden-card {
    opacity: 0.5;
    border-style: dashed;
  }

  .card-info {
    flex-grow: 1;
    display: flex;
    align-items: center;
    margin-right: 8px;
    overflow: hidden;
  }

  .card-index {
    font-weight: bold;
    margin-right: 10px;
    color: var(--secondary-text-color);
  }

  .card-type {
    font-size: 14px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .picture-elements-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 500;
    background-color: var(--primary-color);
    color: var(--text-primary-color);
    border-radius: 12px;
    padding: 2px 6px;
    margin-left: 8px;
    text-transform: uppercase;
  }

  .visibility-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 500;
    background-color: var(--warning-color);
    color: var(--text-primary-color);
    border-radius: 12px;
    padding: 2px 6px;
    margin-left: 8px;
    text-transform: uppercase;
  }

  .card-name {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-left: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .card-actions ha-icon-button {
    --mdc-icon-button-size: 36px;
    color: var(--secondary-text-color);
  }

  .card-actions ha-icon-button:hover {
    color: var(--primary-text-color);
  }

  .hidden-icon {
    color: var(--error-color);
    margin-right: 8px;
    font-size: 18px;
  }

  .no-cards {
    text-align: center;
    color: var(--secondary-text-color);
    padding: 16px;
    border: 1px dashed var(--divider-color);
    border-radius: var(--ha-card-border-radius, 4px);
    margin-bottom: 16px;
  }

  /* NESTED CARDS */
  .nested-cards-container {
    margin-left: 24px;
    margin-top: 4px;
    margin-bottom: 8px;
    border-left: 2px solid var(--divider-color);
    padding-left: 12px;
  }

  .nested-card-row {
    display: flex;
    align-items: center;
    padding: 6px 8px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 4px);
    margin-bottom: 6px;
    background: var(--secondary-background-color);
    opacity: 0.85;
  }

  .nested-card-row:hover {
    opacity: 1;
  }

  .nested-card-info {
    flex-grow: 1;
    display: flex;
    align-items: center;
    margin-right: 8px;
    overflow: hidden;
  }

  .nested-card-index {
    font-weight: normal;
    margin-right: 10px;
    color: var(--secondary-text-color);
    font-size: 0.9em;
  }

  .nested-card-type {
    font-size: 13px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nested-card-name {
    font-size: 11px;
    color: var(--secondary-text-color);
    margin-left: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nested-card-actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .nested-card-actions ha-icon-button {
    --mdc-icon-button-size: 32px;
    color: var(--secondary-text-color);
  }

  .nested-card-actions ha-icon-button:hover {
    color: var(--primary-text-color);
  }

  /* FORM CONTROLS */
  ha-textfield {
    width: 100%;
  }

  ha-select {
    width: 185px;
    max-width: 185px;
    --ha-select-height: 40px;
  }

  .direction-icon {
    width: 32px;
    height: 32px;
    margin-left: 8px;
    color: var(--primary-color);
  }

  /* FOOTER */
  #card-picker-container {
    display: block;
    margin-top: 16px;
    margin-bottom: 20px;
    padding-top: 16px;
  }

  .version-display {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--divider-color);
    padding-top: 16px;
  }

  .version-text {
    color: var(--secondary-text-color);
    font-size: 14px;
    font-weight: 500;
  }

  .version-badge {
    background-color: var(--primary-color);
    color: var(--text-primary-color);
    border-radius: 16px;
    padding: 4px 12px;
    font-size: 14px;
    font-weight: 500;
    margin-left: auto;
  }

  .entity-picker-help {
    margin-top: 4px !important;
  }

  /* VIEW MODE SECTION */
  .view-mode-container {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }

  .view-mode-label {
    font-size: 14px;
    color: var(--primary-text-color);
    font-weight: 500;
  }

  /* VIEW MODE SECTION */
  .section-header-with-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .section-header-with-controls.carousel-mode {
    margin-bottom: 16px; /* Keep margin for carousel mode (has input below) */
  }

  .section-header-with-controls.single-mode {
    margin-bottom: 0; /* Remove margin for single mode */
  }

  .section-header-with-controls .section-header {
    margin-bottom: 0;
  }

  .radio-group {
    display: flex;
    gap: 16px;
  }

  .radio-option {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 16px;
    color: var(--primary-text-color);
  }

  .radio-option input[type="radio"] {
    margin: 0;
    cursor: pointer;
  }

  .radio-option:hover {
    color: var(--primary-color);
  }

  /* INFO MESSAGE STYLING */
  .option-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background-color: rgba(33, 150, 243, 0.4);
    color: var(--text-primary-color, white);
    border-radius: 4px;
    margin: 8px 0;
    font-size: 13px;
  }

  .option-info {
    background-color: color-mix(
      in srgb,
      var(--info-color, #2196f3) 40%,
      transparent
    );
  }

  .option-info.warning {
    background-color: color-mix(
      in srgb,
      var(--warning-color, #ff9800) 40%,
      transparent
    );
  }

  @supports not (background-color: color-mix(in srgb, blue 40%, transparent)) {
    .option-info {
      background-color: rgba(33, 150, 243, 0.4);
    }
  }

  .info-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  .option-info .info-icon {
    background: none;
    border-radius: 0;
  }

  .version-display {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--divider-color);
    padding-top: 16px;
  }

  .version-text {
    color: var(--secondary-text-color);
    font-size: 14px;
    font-weight: 500;
  }

  .version-badges {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .version-badge {
    background-color: var(--primary-color);
    color: var(--text-primary-color);
    border-radius: 16px;
    padding: 4px 12px;
    font-size: 14px;
    font-weight: 500;
  }

  .github-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    background-color: #24292e;
    color: white;
    border-radius: 16px;
    padding: 4px 12px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.2s ease;
  }

  .github-badge:hover {
    background-color: #444d56;
  }

  .github-badge ha-icon {
    --mdc-icon-size: 16px;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* AUTO-HIDE PAGINATION CONTROL */
  .auto-hide-control {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
  }

  .auto-hide-value {
    min-width: 50px;
    text-align: right;
    font-weight: 500;
    color: var(--primary-color);
    font-size: 14px;
    flex-shrink: 0;
  }

  .auto-hide-control ha-slider {
    flex: 1;
    --paper-slider-knob-color: var(--primary-color);
    --paper-slider-active-color: var(--primary-color);
    --paper-slider-pin-color: var(--primary-color);
    margin-right: -10px;
  }

  .info-text {
    font-size: 12px;
    color: var(--secondary-text-color);
    font-style: italic;
    margin-top: 4px;
    line-height: 1.3;
  }

  /* Reduced Motion Support - Disable editor animations when user prefers reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .section-toggle-icon {
      transition: none !important;
    }

    .section-content {
      transition: none !important;
    }

    .github-badge {
      transition: none !important;
    }
  }
`;
