/**
 * Simple Swipe Card for Home Assistant
 * 
 * A swipeable container card that allows users to swipe between multiple cards.
 * Supports touch gestures and mouse interactions with full configuration UI editor.
 * 
 * @author nutteloost
 * @version 1.4.1
 * @license MIT
 * @see {@link https://github.com/nutteloost/simple-swipe-card}
 * 
 * Installation:
 * 1. Install HACS: https://hacs.xyz
 * 2. Add this repo as a custom repository in HACS: https://github.com/nutteloost/simple-swipe-card
 * 3. Install the card via HACS
 * 4. Add the card to your dashboard
 */

import {
    LitElement,
    html,
    css
} from "https://unpkg.com/lit-element@^4?module";
import {
    fireEvent
} from "https://unpkg.com/custom-card-helpers@^1?module";

const HELPERS = window.loadCardHelpers ? window.loadCardHelpers() : undefined;

// Version management
const CARD_VERSION = "1.4.1";

// Debug configuration - set to false for production
const DEBUG = false;

/**
 * Enhanced debugging function that categorizes log messages
 * @param {string} category - Category of the log message
 * @param {...any} args - Arguments to log
 */
const logDebug = (category, ...args) => {
    if (!DEBUG) return;
    const categoryColors = {
        'EDITOR': 'color: #4caf50; font-weight: bold',
        'EVENT': 'color: #2196f3; font-weight: bold',
        'CONFIG': 'color: #ff9800; font-weight: bold',
        'SWIPE': 'color: #9c27b0; font-weight: bold',
        'ERROR': 'color: #f44336; font-weight: bold',
        'INIT': 'color: #795548; font-weight: bold',
        'SYSTEM': 'color: #00bcd4; font-weight: bold', 
        'DEFAULT': 'color: #607d8b; font-weight: bold',
        'ELEMENT': 'color: #e91e63; font-weight: bold'
    };

    const style = categoryColors[category] || categoryColors.DEFAULT;
    console.debug(`%cSimpleSwipeCard [${category}]:`, style, ...args);
};

// Global dialog stack to maintain proper editor hierarchy
if (!window._simpleSwipeDialogStack) {
    window._simpleSwipeDialogStack = [];
}

/**
 * Main Simple Swipe Card class
 * @extends HTMLElement
 */
class SimpleSwipeCard extends HTMLElement {
    constructor() {
        super();
        logDebug("INIT", "SimpleSwipeCard Constructor invoked.");

        this.attachShadow({
            mode: 'open'
        });
        this._config = {};
        this._hass = null;
        this.cards = [];
        this.currentIndex = 0;
        this.slideWidth = 0;
        this.slideHeight = 0;
        this.cardContainer = null;
        this.sliderElement = null;
        this.paginationElement = null;
        this.initialized = false;
        this.building = false;
        this.resizeObserver = null;
        this.resizeTimeout = null;

        // Swipe state management
        this._isDragging = false;
        this._startX = 0;
        this._startY = 0;
        this._currentX = 0;
        this._currentY = 0;
        this._initialTransform = 0;
        this._lastMoveTime = 0;
        this._isScrolling = false;
        this._swipeDirection = 'horizontal'; // Default swipe direction

        // Bind event handlers for proper cleanup
        this._boundHandleSwipeStart = this._handleSwipeStart.bind(this);
        this._boundHandleSwipeMove = this._handleSwipeMove.bind(this);
        this._boundHandleSwipeEnd = this._handleSwipeEnd.bind(this);
        this._boundMouseMove = this._handleSwipeMove.bind(this);
        this._boundMouseUp = this._handleSwipeEnd.bind(this);

        // Store open dialogs for tracking
        this._activeChildEditors = new Set();
        
        // Generate unique instance ID
        this._instanceId = Math.random().toString(36).substring(2, 15);
    }

    /**
     * Gets the config element for the Lovelace editor
     * @returns {Promise<HTMLElement>} The editor element
     */
    static async getConfigElement() {
        logDebug("SYSTEM", "SimpleSwipeCard.getConfigElement called");
        await customElements.whenDefined('simple-swipe-card-editor');
        return document.createElement('simple-swipe-card-editor');
    }

    /**
     * Gets the default configuration
     * @returns {Object} Default configuration object
     */
    static getStubConfig() {
        logDebug("SYSTEM", "SimpleSwipeCard.getStubConfig called");
        return {
            cards: [],
            show_pagination: true,
            card_spacing: 15,
            enable_loopback: false,
            swipe_direction: 'horizontal'
        };
    }

    /**
     * Sets the card configuration
     * @param {Object} config - The card configuration
     */
    setConfig(config) {
        logDebug("CONFIG", "setConfig received:", JSON.stringify(config));

        // Validate configuration
        if (!config || typeof config !== 'object') {
            this._handleInvalidConfig("Configuration must be an object");
            return;
        }

        if (!config.cards || !Array.isArray(config.cards)) {
            logDebug("CONFIG", "No cards array found in configuration, creating empty array");
            this._config = { 
                cards: [], 
                show_pagination: true, 
                card_spacing: 15, 
                enable_loopback: false,
                swipe_direction: 'horizontal'
            };
            if (this.isConnected) this._build();
            return;
        }

        // Check if configuration has changed
        const oldConfigString = JSON.stringify(this._config);
        const newConfigString = JSON.stringify(config);

        if (oldConfigString === newConfigString) {
            logDebug("CONFIG", "setConfig: No change detected, skipping update.");
            return;
        }

        // Apply new configuration
        this._config = JSON.parse(newConfigString);

        // Handle backward compatibility
        if (this._config.parameters?.show_pagination !== undefined) {
            this._config.show_pagination = this._config.parameters.show_pagination;
            delete this._config.parameters;
        }

        // Set defaults
        if (this._config.show_pagination === undefined) this._config.show_pagination = true;
        if (this._config.card_spacing === undefined) {
            this._config.card_spacing = 15;
        } else {
            this._config.card_spacing = parseInt(this._config.card_spacing);
            if (isNaN(this._config.card_spacing) || this._config.card_spacing < 0) {
                this._config.card_spacing = 15;
            }
        }
        // Set default for enable_loopback if not defined
        if (this._config.enable_loopback === undefined) this._config.enable_loopback = false;
        
        // Set default for swipe_direction if not defined
        if (this._config.swipe_direction === undefined || 
            !['horizontal', 'vertical'].includes(this._config.swipe_direction)) {
            this._config.swipe_direction = 'horizontal';
        }
        
        // Store the current swipe direction for internal use
        this._swipeDirection = this._config.swipe_direction;
        
        delete this._config.title; // Remove title if present (legacy)

        // Determine if rebuild is needed
        const needsRebuild = !this.initialized || !this.isConnected || this.cards.length !== this._config.cards.length;

        if (needsRebuild && this.isConnected) {
            logDebug("CONFIG", "setConfig triggering rebuild");
            this._build();
        } else if (this.initialized) {
            logDebug("CONFIG", "setConfig triggering updates (no rebuild)");
            this._updateChildCardConfigs();
            this._updateLayoutOptions();
        }
    }

    /**
     * Handles invalid configuration gracefully
     * @param {string} message - Error message to display
     * @private
     */
    _handleInvalidConfig(message) {
        logDebug("ERROR", `${message}`);
        this._config = { 
            cards: [], 
            show_pagination: true, 
            card_spacing: 15,
            enable_loopback: false,
            swipe_direction: 'horizontal'
        };
        if (this.isConnected) this._build();
    }

    /**
     * Updates child card configurations without rebuilding the entire card
     * @private
     */
    _updateChildCardConfigs() {
        logDebug("CONFIG", "Updating child card configs");
        if (!this.cards || this.cards.length !== this._config.cards.length) return;

        this._config.cards.forEach((cardConfig, index) => {
            const cardInstance = this.cards[index];
            if (cardInstance && !cardInstance.error && cardInstance.element?.setConfig) {
                if (JSON.stringify(cardInstance.config) !== JSON.stringify(cardConfig)) {
                    logDebug("CONFIG", "Updating config for card", index);
                    try {
                        cardInstance.element.setConfig(cardConfig);
                        cardInstance.config = JSON.parse(JSON.stringify(cardConfig));
                    } catch (e) {
                        console.error(`Error setting config on child card ${index}:`, e);
                    }
                }
            }
        });
    }

    /**
     * Updates layout options (pagination and spacing)
     * @private
     */
    _updateLayoutOptions() {
        logDebug("CONFIG", "Updating layout options (pagination, spacing, direction)");
        const showPagination = this._config.show_pagination !== false;
        const cardSpacing = this._config.card_spacing || 0;
        
        // Update swipe direction
        if (this._swipeDirection !== this._config.swipe_direction) {
            this._swipeDirection = this._config.swipe_direction;
            // Need to rebuild for direction change
            this._build();
            return;
        }

        // Update pagination visibility
        if (showPagination && this.cards.length > 1) {
            if (!this.paginationElement) {
                this._createPagination();
            } else {
                this.paginationElement.style.display = 'flex';
            }
        } else if (this.paginationElement) {
            this.paginationElement.style.display = 'none';
        }

        // Update slider position with new spacing
        this.updateSlider(false);
    }

    /**
     * Sets the Home Assistant object
     * @param {Object} hass - Home Assistant object
     */
    set hass(hass) {
        if (!hass || this._hass === hass) {
            return;
        }
        logDebug("INIT", "Setting hass");
        this._hass = hass;

        // Update hass for all child cards
        if (this.cards) {
            this.cards.forEach(card => {
                if (card.element && !card.error) {
                    try {
                        card.element.hass = hass;
                    } catch (e) {
                        console.error("Error setting hass on child card:", e);
                    }
                }
            });
        }
    }

    /**
     * Called when element is connected to DOM
     */
    connectedCallback() {
        logDebug("INIT", "connectedCallback");

        // Add event listeners for editor integration
        this.addEventListener('config-changed', (e) => {
            // Prevent handling events fired by self during updates
            if(e.detail?.fromSwipeCardEditor && e.detail?.editorId === this._editorId) return;
            
            logDebug("EVENT", "Root element received config-changed event:", e.detail);
            
            // Check if this is from an element editor to prevent interference
            if (e.detail?.fromElementEditor || e.detail?.elementConfig || e.detail?.element) {
                logDebug("ELEMENT", "Caught element editor event, allowing normal propagation");
                return;
            }
            
            // Determine if this event is from a nested actions card
            if (e.detail?.fromActionCardEditor) {
                logDebug("EVENT", "Received config-changed event from actions-card editor", e.detail);

                // Check if we should maintain editor state (prevent dialog close)
                if (e.detail.maintainEditorState) {
                    logDebug("EVENT", "Event marked to maintain editor state, preventing propagation");
                    e.stopPropagation();

                    // Extract the parent card index
                    const cardElement = e.target.closest('[data-index]');
                    if (cardElement) {
                        const cardIndex = parseInt(cardElement.getAttribute('data-index'));
                        if (!isNaN(cardIndex) && cardIndex >= 0 && cardIndex < this._config.cards.length) {
                            logDebug("EVENT", `Updating nested card at index ${cardIndex}`, e.detail.config);

                            // Update the configuration
                            const updatedCards = [...this._config.cards];
                            updatedCards[cardIndex] = e.detail.config;

                            this._config = {
                                ...this._config,
                                cards: updatedCards
                            };

                            // Fire our own config-changed event
                            const newEvent = new CustomEvent('config-changed', {
                                detail: {
                                    config: this._config,
                                    fromSwipeCardEditor: true,
                                    maintainEditorState: true,
                                    sourceCardIndex: cardIndex
                                },
                                bubbles: false, // Don't bubble to prevent dialog close
                                composed: true
                            });

                            logDebug("EVENT", "Dispatching updated config event without bubbling", this._config);
                            this.dispatchEvent(newEvent);

                            // Mark as handled
                            e._handledBySwipeCard = true;
                            return;
                        }
                    }
                } else {
                    // Standard handling
                    const cardElement = e.target.closest('[data-index]');
                    if (cardElement) {
                        const cardIndex = parseInt(cardElement.getAttribute('data-index'));
                        if (!isNaN(cardIndex) && cardIndex >= 0 && cardIndex < this._config.cards.length) {
                            logDebug("EVENT", `Updating nested card at index ${cardIndex}`, e.detail.config);

                            // Update the configuration
                            const updatedCards = [...this._config.cards];
                            updatedCards[cardIndex] = e.detail.config;

                            this._config = {
                                ...this._config,
                                cards: updatedCards
                            };

                            // Fire our own config-changed event
                            const newEvent = new CustomEvent('config-changed', {
                                detail: {
                                    config: this._config,
                                    fromSwipeCardEditor: true
                                },
                                bubbles: true,
                                composed: true
                            });

                            logDebug("EVENT", "Dispatching updated config event", this._config);
                            this.dispatchEvent(newEvent);

                            // Mark as handled
                            e._handledBySwipeCard = true;
                            e.stopPropagation();
                            return;
                        }
                    }
                }

                // If we couldn't process it, mark it as handled anyway so parent knows
                e._handledBySwipeCard = true;
                e.stopPropagation();
                return;
            }

            // Otherwise, handle normally
            logDebug("EVENT", "Caught standard config-changed event:", e.detail);
        });

        this.addEventListener('ll-show-dialog', (e) => {
            logDebug("EVENT", "Caught ll-show-dialog event:", e.detail);
        });

        this.addEventListener('show-edit-card', (e) => {
            logDebug("EVENT", "Caught show-edit-card event:", e.detail);
        });

        if (!this.initialized && this._config?.cards) {
            logDebug("INIT", "connectedCallback: Initializing build.");
            this._build();
        } else if (this.initialized && this.cardContainer) {
            logDebug("INIT", "connectedCallback: Re-initializing observers and gestures.");
            if (!this.resizeObserver) this._setupResizeObserver();
            if (this.cards.length > 1) {
                this._removeSwiperGesture();
                setTimeout(() => {
                    if (this.isConnected) this._addSwiperGesture();
                }, 50);
            }
        }
    }

    /**
     * Called when element is disconnected from DOM
     */
    disconnectedCallback() {
        logDebug("INIT", "disconnectedCallback");

        // Safely remove observers and gestures
        try {
            this._removeResizeObserver();
            this._removeSwiperGesture();

            // Clean up any DOM observer
            if (this._domObserver) {
                this._domObserver.disconnect();
                this._domObserver = null;
            }
        } catch (error) {
            console.warn("Error during cleanup:", error);
        }

        // Clean up any open dialogs
        this._activeChildEditors.forEach(dialog => {
            if (dialog.parentNode) {
                try {
                    dialog.parentNode.removeChild(dialog);
                } catch (error) {
                    console.warn("Error removing dialog:", error);
                }
            }
        });
        this._activeChildEditors.clear();

        this.initialized = false;
    }

    /**
     * Handle edit button click in preview mode
     * @param {Event} e - Click event
     * @private
     */
    _handleEditClick(e) {
        e.stopPropagation();
        logDebug("EDITOR", "Edit button clicked, firing show-edit-card event");
        fireEvent(this, 'show-edit-card', { element: this });
    }

    /**
     * Builds or rebuilds the entire card
     * @private
     */
    async _build() {
        if (this.building) {
            logDebug("INIT", "Build already in progress, skipping.");
            return;
        }
        if (!this._config || !this._config.cards || !this.isConnected) {
            logDebug("INIT", "Build skipped (no config/cards or not connected).");
            return;
        }

        this.building = true;
        logDebug("INIT", "Starting build...");

        // Reset state
        this.cards = [];
        this.currentIndex = 0;
        this._removeResizeObserver();
        this._removeSwiperGesture();
        if (this.shadowRoot) this.shadowRoot.innerHTML = '';

        const root = this.shadowRoot;

        const helpers = await HELPERS;
        if (!helpers) {
            console.error("SimpleSwipeCard: Card helpers not loaded.");
            root.innerHTML = `<ha-alert alert-type="error">Card Helpers are required for this card to function. Please ensure they are loaded.</ha-alert>`;
            this.building = false;
            this.initialized = false;
            return;
        }

        // Add styles
        const style = document.createElement('style');
        style.textContent = this._getStyles();
        root.appendChild(style);

        // Create container structure
        this.cardContainer = document.createElement('div');
        this.cardContainer.className = 'card-container';

        this.sliderElement = document.createElement('div');
        this.sliderElement.className = 'slider';
        // Add swipe direction as a data attribute
        this.sliderElement.setAttribute('data-swipe-direction', this._swipeDirection);
        this.cardContainer.appendChild(this.sliderElement);
        root.appendChild(this.cardContainer);

        // Handle empty state (PREVIEW)
        if (this._config.cards.length === 0) {
            logDebug("INIT", "Building preview state.");
            const previewContainer = document.createElement('div');
            previewContainer.className = 'preview-container';

            const iconContainer = document.createElement('div');
            iconContainer.className = 'preview-icon-container';
            const icon = document.createElement('ha-icon');
            // Use appropriate icon based on swipe direction
            icon.icon = this._swipeDirection === 'horizontal' 
                ? 'mdi:gesture-swipe-horizontal' 
                : 'mdi:gesture-swipe-vertical';
            iconContainer.appendChild(icon);

            const textContainer = document.createElement('div');
            textContainer.className = 'preview-text-container';
            const title = document.createElement('div');
            title.className = 'preview-title';
            title.textContent = "Simple Swipe Card";
            const description = document.createElement('div');
            description.className = 'preview-description';
            description.textContent = `Create a swipeable container with multiple cards. Swipe ${this._swipeDirection === 'horizontal' ? 'horizontally' : 'vertically'} between cards. Open the editor to add your first card.`;
            textContainer.appendChild(title);
            textContainer.appendChild(description);

            const actionsContainer = document.createElement('div');
            actionsContainer.className = 'preview-actions';
            const addButton = document.createElement('ha-button');
            addButton.raised = true;
            addButton.textContent = "EDIT CARD";
            addButton.setAttribute('aria-label', 'Edit Card');
            addButton.addEventListener('click', this._handleEditClick.bind(this));
            actionsContainer.appendChild(addButton);

            previewContainer.appendChild(iconContainer);
            previewContainer.appendChild(textContainer);
            previewContainer.appendChild(actionsContainer);

            // Append the preview directly to the shadow root, not inside the slider
            root.innerHTML = ''; // Clear previous content (including styles)
            root.appendChild(style); // Re-add styles
            root.appendChild(previewContainer);

            this.initialized = true;
            this.building = false;
            // No layout finish needed for preview
            return;
        }

        // Build cards - with optimization for loopback mode
        logDebug("INIT", "Building cards:", this._config.cards.length);
        
        // Determine which cards to load initially
        let cardsToLoad;
        if (this._config.cards.length <= 3) {
            // For 3 or fewer cards, load all of them
            cardsToLoad = Array.from({ length: this._config.cards.length }, (_, i) => i);
        } else {
            // For more cards, load current, prev, and next (with loopback considerations)
            cardsToLoad = [0]; // Start with first card
            
            // Add prev card (last card if loopback enabled)
            if (this._config.enable_loopback) {
                cardsToLoad.push(this._config.cards.length - 1);
            }
            
            // Add next card
            if (this._config.cards.length > 1) {
                cardsToLoad.push(1);
            }
        }
        
        const cardPromises = cardsToLoad.map((index) => {
            return this._createCard(this._config.cards[index], index, helpers);
        });
        
        await Promise.allSettled(cardPromises);

        // Sort and append cards
        this.cards.filter(Boolean).sort((a, b) => a.index - b.index).forEach(cardData => {
            if (cardData.slide) {
                // Add data-index attribute for event targeting
                cardData.slide.setAttribute('data-index', cardData.index);
                // Add card type attribute for debugging and event filtering
                if (cardData.config && cardData.config.type) {
                    cardData.slide.setAttribute('data-card-type', cardData.config.type);
                }
                this.sliderElement.appendChild(cardData.slide);
            }
        });

        this._createPagination();

        // Defer layout and gestures until next frame
        requestAnimationFrame(() => this._finishBuildLayout());

        this.initialized = true;
        this.building = false;
        logDebug("INIT", "Build finished.");
    }

    /**
     * Gets the CSS styles for the card
     * @returns {string} CSS styles
     * @private
     */
    _getStyles() {
        return `
         :host {
            display: block;
            overflow: hidden;
            width: 100%;
            height: 100%;
            position: relative;
            border-radius: var(--ha-card-border-radius, 12px);
            background: transparent;
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
            overflow: hidden;
            border-radius: inherit;
            background: transparent;
         }
         .slider {
            position: relative;
            display: flex;
            height: 100%;
            transition: transform var(--simple-swipe-card-transition-speed, 0.3s) var(--simple-swipe-card-transition-easing, ease-out);
            will-change: transform;
            background: transparent;
         }
         
         /* Horizontal slider (default) */
         .slider[data-swipe-direction="horizontal"] {
            flex-direction: row;
         }
         
         /* Vertical slider */
         .slider[data-swipe-direction="vertical"] {
            flex-direction: column;
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
            overflow: hidden;
            background: var(--ha-card-background, var(--card-background-color, white));
         }
        .pagination {
            position: absolute;
            display: flex;
            justify-content: center;
            z-index: 1;
            background-color: var(--simple-swipe-card-pagination-background, transparent);
            pointer-events: auto;
            transition: opacity 0.2s ease-in-out;
            padding: var(--simple-swipe-card-pagination-padding, 4px 8px);
            border-radius: 12px;
        }
        
        /* Horizontal pagination (bottom) */
        .pagination.horizontal {
            bottom: var(--simple-swipe-card-pagination-bottom, 8px);
            left: 50%;
            transform: translateX(-50%);
            flex-direction: row;
        }
        
        /* Vertical pagination (right) */
        .pagination.vertical {
            right: var(--simple-swipe-card-pagination-right, 8px);
            top: 50%;
            transform: translateY(-50%);
            flex-direction: column;
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
            transition: background-color 0.2s ease, width 0.2s ease, height 0.2s ease;
            border: none;
            opacity: var(--simple-swipe-card-pagination-dot-inactive-opacity, 1);
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
         }
       `;
    }

    /**
     * Checks if a dialog is related to an Actions Card being edited
     * @param {HTMLElement} dialog - Dialog element to check
     * @returns {boolean} True if it's an Actions Card dialog
     * @private
     */
    _isActionsCardDialog(dialog) {
        if (!dialog) return false;

        // Check if this dialog has our marker
        if (dialog._editingActionsCard) return true;

        // Check the card type being edited
        try {
            const cardConfig = dialog.cardConfig;
            return cardConfig && cardConfig.type === 'custom:actions-card';
        } catch (e) {
            return false;
        }
    }

    /**
     * Creates a card element and adds it to the slider
     * @param {Object} cardConfig - Configuration for the card
     * @param {number} index - Index of the card
     * @param {Object} helpers - Home Assistant card helpers
     * @private
     */
    async _createCard(cardConfig, index, helpers) {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'slide';
        let cardElement;
        let cardData = { index, slide: slideDiv, config: JSON.parse(JSON.stringify(cardConfig)), error: false };

        try {
            cardElement = await helpers.createCardElement(cardConfig);
            if (this._hass) cardElement.hass = this._hass;
            cardData.element = cardElement;
            
            // Add special attribute for picture-elements cards to enhance tracking
            if (cardConfig.type === 'picture-elements') {
                cardElement.setAttribute('data-swipe-card-picture-elements', 'true');
                slideDiv.setAttribute('data-has-picture-elements', 'true');
            }

            // Special handling for specific card types
            requestAnimationFrame(() => {
                try {
                    if (cardConfig.type === 'todo-list') {
                        const textField = cardElement.shadowRoot?.querySelector('ha-textfield');
                        const inputElement = textField?.shadowRoot?.querySelector('input');
                        if (inputElement) inputElement.enterKeyHint = 'done';
                    }
                } catch (e) {
                    console.warn("Error applying post-creation logic:", e);
                }
            });
            slideDiv.appendChild(cardElement);
        } catch (e) {
            logDebug("ERROR", `Error creating card ${index}:`, cardConfig, e);
            cardData.error = true;
            // Create error card with user-friendly message
            const errorCard = await helpers.createErrorCardElement({
                type: "error",
                error: `Failed to create card: ${e.message}`,
                origConfig: cardConfig
            }, this._hass);
            cardData.element = errorCard;
            slideDiv.appendChild(errorCard);
        }
        this.cards[index] = cardData;
    }

    /**
     * Creates the pagination dots
     * @private
     */
    _createPagination() {
        this.paginationElement?.remove();
        this.paginationElement = null;
        const showPagination = this._config.show_pagination !== false;
    
        if (showPagination && this._config.cards && this._config.cards.length > 1) {
            logDebug("INIT", "Creating pagination");
            this.paginationElement = document.createElement('div');
            this.paginationElement.className = `pagination ${this._swipeDirection}`;
            
            // Use this._config.cards.length instead of this.cards.length
            for (let i = 0; i < this._config.cards.length; i++) {
                const dot = document.createElement('div');
                dot.className = 'pagination-dot';
                if (i === this.currentIndex) dot.classList.add('active');
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.goToSlide(i);
                });
                this.paginationElement.appendChild(dot);
            }
            this.shadowRoot.appendChild(this.paginationElement);
        }
    }

    /**
     * Finishes the build process by setting up layout and observers
     * @private
     */
    _finishBuildLayout() {
        if (!this.cardContainer || !this.isConnected || this.building) {
            logDebug("INIT", "_finishBuildLayout skipped", { container: !!this.cardContainer, connected: this.isConnected, building: this.building });
            return;
        }
        logDebug("INIT", "Finishing build layout...");

        const containerWidth = this.cardContainer.offsetWidth;
        const containerHeight = this.cardContainer.offsetHeight;
        
        if (containerWidth <= 0 || containerHeight <= 0) {
            if (this.offsetParent === null) {
                logDebug("INIT", "Layout calculation skipped, element is hidden.");
                return;
            }
            logDebug("INIT", "Container dimensions are 0, retrying layout...");
            this._layoutRetryCount = (this._layoutRetryCount || 0) + 1;
            if (this._layoutRetryCount < 5) {
                setTimeout(() => requestAnimationFrame(() => this._finishBuildLayout()), 100);
            } else {
                console.error("SimpleSwipeCard: Failed to get container dimensions.");
                this._layoutRetryCount = 0;
            }
            return;
        }
        this._layoutRetryCount = 0;

        this.slideWidth = containerWidth;
        this.slideHeight = containerHeight;

        // Adjust index if out of bounds
        this.currentIndex = Math.max(0, Math.min(this.currentIndex, this.cards.length - 1));

        // Apply matching border radius to all slides
        const cardBorderRadius = getComputedStyle(this.cardContainer).borderRadius;
        this.cards.forEach(cardData => {
            if (cardData.slide) {
                cardData.slide.style.borderRadius = cardBorderRadius;
            }
        });

        this.updateSlider(false);

        this._setupResizeObserver();

        // Add swipe gestures if needed
        if (this.cards.length > 1) {
            this._addSwiperGesture();
        } else {
            this._removeSwiperGesture();
        }

        logDebug("INIT", "Layout finished, slideWidth:", this.slideWidth, "slideHeight:", this.slideHeight, "currentIndex:", this.currentIndex);
        
        // If loopback is enabled, preload relevant cards
        if (this._config.enable_loopback && this.cards.length > 1) {
            this._preloadAdjacentCards(this.currentIndex);
        }
    }

    /**
     * Preloads adjacent cards when needed (for loopback mode)
     * @param {number} currentIndex - The current card index
     * @private
     */
    _preloadAdjacentCards(currentIndex) {
        if (!this._config || !this._config.cards || !this._hass || !this.initialized) return;
        
        const totalCards = this._config.cards.length;
        if (totalCards <= 1) return;
        
        // In loopback mode, we need to preload the previous and next cards,
        // which might be the last and first cards respectively
        const loopbackEnabled = this._config.enable_loopback === true;
        
        // Determine which cards to preload
        const cardsToLoad = [currentIndex]; // Always include current card
        
        // Add previous card
        if (currentIndex > 0) {
            cardsToLoad.push(currentIndex - 1);
        } else if (loopbackEnabled) {
            // In loopback mode, when on first card, preload the last card
            cardsToLoad.push(totalCards - 1);
        }
        
        // Add next card
        if (currentIndex < totalCards - 1) {
            cardsToLoad.push(currentIndex + 1);
        } else if (loopbackEnabled) {
            // In loopback mode, when on last card, preload the first card
            cardsToLoad.push(0);
        }
        
        // Find which cards need to be created
        const cardsToCreate = cardsToLoad.filter(index => {
            return !this.cards[index] || this.cards[index].error;
        });
        
        if (cardsToCreate.length === 0) return;
        
        // Create the missing cards
        logDebug("INIT", "Preloading cards for loopback:", cardsToCreate);
        
        HELPERS.then(helpers => {
            cardsToCreate.forEach(async (index) => {
                if (!this.cards[index] || this.cards[index].error) {
                    await this._createCard(this._config.cards[index], index, helpers);
                    
                    // Add the card to the DOM if not already there, ensuring correct order
                    if (this.cards[index] && this.cards[index].slide && !this.sliderElement.contains(this.cards[index].slide)) {
                        // Set attributes
                        this.cards[index].slide.setAttribute('data-index', index);
                        if (this.cards[index].config && this.cards[index].config.type) {
                            this.cards[index].slide.setAttribute('data-card-type', this.cards[index].config.type);
                        }
                        
                        // Find the correct position to insert this card
                        let inserted = false;
                        
                        // Get all existing slide elements
                        const existingSlides = Array.from(this.sliderElement.children);
                        
                        // Find the first slide with a higher index than the current one
                        for (const slide of existingSlides) {
                            const slideIndex = parseInt(slide.getAttribute('data-index'), 10);
                            if (!isNaN(slideIndex) && slideIndex > index) {
                                // Insert before this slide
                                this.sliderElement.insertBefore(this.cards[index].slide, slide);
                                inserted = true;
                                logDebug("INIT", `Inserted card ${index} before card ${slideIndex}`);
                                break;
                            }
                        }
                        
                        // If no insertion point was found, append at the end
                        if (!inserted) {
                            this.sliderElement.appendChild(this.cards[index].slide);
                            logDebug("INIT", `Appended card ${index} at the end`);
                        }
                        
                        // Force a recalculation of layout after insertion
                        this._finishBuildLayout();
                    }
                }
            });
        });
    }

    /**
     * Sets up a ResizeObserver to handle container resizing
     * @private
     */
    _setupResizeObserver() {
        if (this.resizeObserver || !this.cardContainer) return;
        logDebug("INIT", "Setting up resize observer.");
        this.resizeObserver = new ResizeObserver(entries => {
            window.requestAnimationFrame(() => {
                if (!this.isConnected || !this.cardContainer) return;
                for (let entry of entries) {
                    const newWidth = entry.contentRect.width;
                    const newHeight = entry.contentRect.height;
                    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
                    this.resizeTimeout = setTimeout(() => {
                        if (this.cardContainer && 
                            ((newWidth > 0 && Math.abs(newWidth - this.slideWidth) > 1) ||
                             (newHeight > 0 && Math.abs(newHeight - this.slideHeight) > 1))) {
                            logDebug("INIT", "Resize detected, recalculating layout.", { 
                                oldWidth: this.slideWidth, newWidth, 
                                oldHeight: this.slideHeight, newHeight 
                            });
                            this._finishBuildLayout();
                        }
                    }, 50);
                }
            });
        });
        this.resizeObserver.observe(this.cardContainer);
    }

    /**
     * Removes the ResizeObserver
     * @private
     */
    _removeResizeObserver() {
        if (this.resizeObserver) {
            logDebug("INIT", "Removing resize observer.");
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = null;
        }
    }

    /**
     * Gets transition CSS properties with fallbacks
     * @param {boolean} animate - Whether to apply animation
     * @returns {string} - Transition style value
     * @private
     */
    _getTransitionStyle(animate) {
        if (!animate) return 'none';
        
        // Get computed values if connected to DOM
        let speed = '0.3s';
        let easing = 'ease-out';
        
        if (this.isConnected) {
            const computedStyle = getComputedStyle(this);
            const speedValue = computedStyle.getPropertyValue('--simple-swipe-card-transition-speed').trim();
            const easingValue = computedStyle.getPropertyValue('--simple-swipe-card-transition-easing').trim();
            
            if (speedValue) speed = speedValue;
            if (easingValue) easing = easingValue;
        }
        
        return `transform ${speed} ${easing}`;
    }

    // --- Swipe Gesture Handling ---

    /**
     * Removes swipe event listeners
     * @private
     */
    _removeSwiperGesture() {
        logDebug("SWIPE", "Attempting to remove swipe listeners.");
        if (this.cardContainer) {
            this.cardContainer.removeEventListener('touchstart', this._boundHandleSwipeStart, { passive: true });
            this.cardContainer.removeEventListener('touchmove', this._boundHandleSwipeMove, { passive: false });
            this.cardContainer.removeEventListener('touchend', this._boundHandleSwipeEnd, { passive: true });
            this.cardContainer.removeEventListener('touchcancel', this._boundHandleSwipeEnd, { passive: true });
            this.cardContainer.removeEventListener('mousedown', this._boundHandleSwipeStart, { passive: false });
            logDebug("SWIPE", "Removed swipe listeners from cardContainer.");
        }
        window.removeEventListener('mousemove', this._boundMouseMove, { passive: false });
        window.removeEventListener('mouseup', this._boundMouseUp, { passive: true });
        logDebug("SWIPE", "Removed potential swipe listeners from window.");

        // Reset state flags
        this._isDragging = false;
        this._isScrolling = false;
    }

    /**
     * Adds swipe event listeners
     * @private
     */
    _addSwiperGesture() {
        this._removeSwiperGesture();
        if (!this.cardContainer || this.cards.length <= 1 || !this.initialized) {
            logDebug("SWIPE", "Skipping addSwiperGesture", { container: !!this.cardContainer, count: this.cards.length, init: this.initialized });
            return;
        }
        logDebug("SWIPE", "Adding swipe listeners.");

        // Add listeners using the bound handlers
        this.cardContainer.addEventListener('touchstart', this._boundHandleSwipeStart, { passive: true });
        this.cardContainer.addEventListener('touchmove', this._boundHandleSwipeMove, { passive: false });
        this.cardContainer.addEventListener('touchend', this._boundHandleSwipeEnd, { passive: true });
        this.cardContainer.addEventListener('touchcancel', this._boundHandleSwipeEnd, { passive: true });
        this.cardContainer.addEventListener('mousedown', this._boundHandleSwipeStart, { passive: false });
    }

    /**
     * Handles swipe start events
     * @param {Event} e - Touch or mouse event
     * @private
     */
    _handleSwipeStart(e) {
        logDebug("SWIPE", "Swipe Start:", e.type);
        if (this._isDragging || (e.type === 'mousedown' && e.button !== 0)) {
            logDebug("SWIPE", "Swipe Start ignored (already dragging or wrong button)");
            return;
        }

        if (this._isInteractiveOrScrollable(e.target)) {
            logDebug("SWIPE", "Swipe Start ignored (interactive element):", e.target);
            return;
        }

        this._isDragging = true;
        this._isScrolling = false;
        const isTouch = e.type === 'touchstart';
        const point = isTouch ? e.touches[0] : e;
        this._startX = point.clientX;
        this._startY = point.clientY;
        this._currentX = this._startX;
        this._currentY = this._startY;
        this._lastMoveTime = Date.now();

        if (this.sliderElement) {
            const style = window.getComputedStyle(this.sliderElement);
            const matrix = new DOMMatrixReadOnly(style.transform);
            this._initialTransform = matrix.m41; // For horizontal, we track X transform
            if (this._swipeDirection === 'vertical') {
                this._initialTransform = matrix.m42; // For vertical, we track Y transform
            }
            this.sliderElement.style.transition = this._getTransitionStyle(false);
            this.sliderElement.style.cursor = 'grabbing';
            logDebug("SWIPE", "Swipe Start Details:", {
                startX: this._startX, 
                startY: this._startY, 
                initialTransform: this._initialTransform,
                direction: this._swipeDirection
            });
        }

        if (e.type === 'mousedown') {
            logDebug("SWIPE", "Attaching mousemove/mouseup listeners to window");
            e.preventDefault();
            window.addEventListener('mousemove', this._boundMouseMove, { passive: false });
            window.addEventListener('mouseup', this._boundMouseUp, { passive: true });
        }
    }

    /**
     * Handles swipe move events
     * @param {Event} e - Touch or mouse event
     * @private
     */
    _handleSwipeMove(e) {
        if (!this._isDragging) return;
        logDebug("SWIPE", "Swipe Move");

        const isTouch = e.type === 'touchmove';
        const point = isTouch ? e.touches[0] : e;
        const clientX = point.clientX;
        const clientY = point.clientY;

        const deltaX = clientX - this._startX;
        const deltaY = clientY - this._startY;
        const currentTime = Date.now();

        // Determine if this is a horizontal or vertical swipe based on configuration
        const isHorizontal = this._swipeDirection === 'horizontal';
        
        // Calculate the primary and secondary deltas based on swipe direction
        const primaryDelta = isHorizontal ? deltaX : deltaY;
        const secondaryDelta = isHorizontal ? deltaY : deltaX;

        // Check for scrolling in the perpendicular direction
        if (!this._isScrolling && Math.abs(secondaryDelta) > Math.abs(primaryDelta) && Math.abs(secondaryDelta) > 10) {
            logDebug("SWIPE", `${isHorizontal ? 'Vertical' : 'Horizontal'} scroll detected, cancelling ${isHorizontal ? 'horizontal' : 'vertical'} drag.`);
            this._isScrolling = true;
        }

        // Process movement in the primary direction
        if (!this._isScrolling && Math.abs(primaryDelta) > 5) {
            logDebug("SWIPE", `${isHorizontal ? 'Horizontal' : 'Vertical'} move detected`);
            if (e.cancelable) e.preventDefault();

            // Update current position based on swipe direction
            if (isHorizontal) {
                this._currentX = clientX;
            } else {
                this._currentY = clientY;
            }
            
            let dragAmount = primaryDelta;

            // Apply resistance at edges (only if loopback mode is not enabled)
            const loopbackEnabled = this._config.enable_loopback === true;
            if (!loopbackEnabled) {
                const atFirstEdge = this.currentIndex === 0;
                const atLastEdge = this.currentIndex === this.cards.length - 1;
                if ((atFirstEdge && dragAmount > 0) || (atLastEdge && dragAmount < 0)) {
                    const resistanceFactor = 0.3 + 0.7 / (1 + Math.abs(dragAmount) / (isHorizontal ? this.slideWidth : this.slideHeight) * 0.5);
                    dragAmount *= resistanceFactor * 0.5;
                }
            }

            const newTransform = this._initialTransform + dragAmount;

            if (this.sliderElement) {
                logDebug("SWIPE", "Applying transform:", newTransform);
                // Apply transform based on swipe direction
                if (isHorizontal) {
                    this.sliderElement.style.transform = `translateX(${newTransform}px)`;
                } else {
                    this.sliderElement.style.transform = `translateY(${newTransform}px)`;
                }
            }
            this._lastMoveTime = currentTime;
        }
    }

    /**
     * Handles swipe end events
     * @param {Event} e - Touch or mouse event
     * @private
     */
    _handleSwipeEnd(e) {
        logDebug("SWIPE", "Swipe End:", e.type);
        if (!this._isDragging) {
            logDebug("SWIPE", "Swipe End ignored (not dragging)");
            return;
        }

        // Cleanup listeners
        if (e.type === 'mouseup') {
            logDebug("SWIPE", "Removing mousemove/mouseup listeners from window");
            window.removeEventListener('mousemove', this._boundMouseMove);
            window.removeEventListener('mouseup', this._boundMouseUp);
        }

        // Process swipe
        Promise.resolve().then(() => {
            if (!this.sliderElement) return;

            const wasDragging = this._isDragging;
            this._isDragging = false;

            this.sliderElement.style.transition = this._getTransitionStyle(true);
            this.sliderElement.style.cursor = '';

            if (!wasDragging) {
                logDebug("SWIPE", "Swipe End: Not dragging or already processed.");
                return;
            }

            if (this._isScrolling || (e.type === 'touchcancel')) {
                logDebug("SWIPE", "Swipe End: Scrolling or Cancelled - Snapping back.");
                this.updateSlider();
                this._isScrolling = false;
                return;
            }

            // Determine if this is a horizontal or vertical swipe based on configuration
            const isHorizontal = this._swipeDirection === 'horizontal';
            
            // Calculate movement and velocity based on swipe direction
            const totalMove = isHorizontal 
                ? this._currentX - this._startX 
                : this._currentY - this._startY;
                
            const timeDiff = Date.now() - this._lastMoveTime;
            const velocity = timeDiff > 10 ? totalMove / timeDiff : 0;
            const SWIPE_VELOCITY_THRESHOLD = 0.4;
            logDebug("SWIPE", "Swipe End Details:", { totalMove, velocity });

            // Use the appropriate dimension for threshold calculation
            const slideSize = isHorizontal ? this.slideWidth : this.slideHeight;
            const threshold = slideSize * 0.2;

            let nextIndex = this.currentIndex;
            const loopbackEnabled = this._config.enable_loopback === true;
            
            if (Math.abs(totalMove) > threshold || Math.abs(velocity) > SWIPE_VELOCITY_THRESHOLD) {
                if (totalMove > 0) {
                    // Swiping right/down - go to previous card
                    if (this.currentIndex > 0) {
                        // Normal case: not at first card
                        nextIndex--;
                    } else if (loopbackEnabled && this.cards.length > 1) {
                        // Loopback mode: at first card, loop to last
                        nextIndex = this.cards.length - 1;
                        logDebug("SWIPE", "Loopback: Looping from first to last card");
                    }
                } else if (totalMove < 0) {
                    // Swiping left/up - go to next card
                    if (this.currentIndex < this.cards.length - 1) {
                        // Normal case: not at last card
                        nextIndex++;
                    } else if (loopbackEnabled && this.cards.length > 1) {
                        // Loopback mode: at last card, loop to first
                        nextIndex = 0;
                        logDebug("SWIPE", "Loopback: Looping from last to first card");
                    }
                }
            }

            if (nextIndex !== this.currentIndex) {
                logDebug("SWIPE", `Swipe resulted in index change to ${nextIndex}`);
                this.currentIndex = nextIndex;
            } else {
                logDebug("SWIPE", "Swipe did not cross threshold or velocity.");
            }

            this.updateSlider(true);
            
            // After transition, preload adjacent cards for loopback mode
            setTimeout(() => {
                this._preloadAdjacentCards(this.currentIndex);
            }, 300); // Wait for transition to complete
        });
    }

    /**
     * Checks if an element is interactive or scrollable
     * @param {Element} element - The element to check
     * @returns {boolean} True if the element is interactive or scrollable
     * @private
     */
    _isInteractiveOrScrollable(element) {
        if (!element || element === this.cardContainer || element === this.sliderElement) return false;

        const interactiveTags = ['input', 'textarea', 'select', 'button', 'a', 'ha-switch', 'ha-checkbox', 'mwc-checkbox', 'paper-checkbox', 'ha-textfield', 'ha-slider', 'paper-slider', 'ha-control-button', 'ha-control-select', 'ha-control-slider', 'ha-control-button-group', 'ha-text-input', 'mwc-button', 'paper-button', 'ha-icon-button', 'paper-icon-button', 'ha-select', 'paper-dropdown-menu', 'vaadin-combo-box'];
        const tagName = element.localName?.toLowerCase();
        const role = element.getAttribute('role');

        // Check basic interactive elements
        if (interactiveTags.includes(tagName) || (role && ['button', 'checkbox', 'switch', 'slider', 'link', 'menuitem', 'textbox', 'combobox', 'option'].includes(role))) {
            logDebug("SWIPE", "_isInteractiveOrScrollable: Found interactive tag/role:", tagName || role);
            return true;
        }

        // Check common HA interactive components
        if (element.closest('ha-control-button, ha-control-select, ha-control-slider, ha-control-button-group, ha-alert[action], ha-more-info-control, hui-buttons-base, ha-form, ha-formfield, ha-icon-button, mwc-list-item, paper-item, ha-list-item')) {
            logDebug("SWIPE", "_isInteractiveOrScrollable: Found interactive ancestor component.");
            return true;
        }

        // Check for scrollable overflow
        let current = element;
        let depth = 0;
        while (current && current !== this.sliderElement && current !== this.cardContainer && depth < 10) {
            if (current.nodeType === Node.ELEMENT_NODE) {
                try {
                    const style = window.getComputedStyle(current);
                    const hasVerticalScroll = (style.overflowY === 'auto' || style.overflowY === 'scroll') && current.scrollHeight > current.clientHeight + 1;
                    const hasHorizontalScroll = (style.overflowX === 'auto' || style.overflowX === 'scroll') && current.scrollWidth > current.clientWidth + 1;

                    if (hasVerticalScroll || hasHorizontalScroll) {
                        logDebug("SWIPE", "_isInteractiveOrScrollable: Found scrollable ancestor:", current);
                        return true;
                    }

                    // Check specific known-scrollable cards
                    if (current.localName === 'ha-logbook' || current.localName === 'hui-logbook-card' || current.localName === 'hui-history-graph-card') {
                        logDebug("SWIPE", "_isInteractiveOrScrollable: Found specific scrollable card type:", current.localName);
                        return true;
                    }
                } catch (e) {
                    logDebug("ERROR", "Error accessing style/scroll properties for:", current, e);
                }
            }

            // Traverse up
            current = current.assignedSlot || current.parentNode || (current.getRootNode() instanceof ShadowRoot ? current.getRootNode().host : null);
            depth++;
        }

        return false;
    }

    // --- Slide Navigation ---

    /**
     * Navigates to a specific slide
     * @param {number} index - The slide index to navigate to
     */
    goToSlide(index) {
        if (!this.cards || this.cards.length <= 1 || !this.initialized || this.building) return;
        
        const loopbackEnabled = this._config.enable_loopback === true;
        
        if (loopbackEnabled && this.cards.length > 1) {
            // In loopback mode, wrap around if needed
            if (index < 0) {
                index = this.cards.length - 1;
            } else if (index >= this.cards.length) {
                index = 0;
            }
        } else {
            // Standard behavior - clamp to valid range
            index = Math.max(0, Math.min(index, this.cards.length - 1));
        }
        
        if (index === this.currentIndex) return;
        
        logDebug("SWIPE", `Going to slide ${index}`);
        this.currentIndex = index;
        this.updateSlider();
        
        // Preload adjacent cards in loopback mode
        if (loopbackEnabled) {
            this._preloadAdjacentCards(index);
        }
    }

    /**
     * Updates the slider position and pagination
     * @param {boolean} [animate=true] - Whether to animate the transition
     */
    updateSlider(animate = true) {
        logDebug("SWIPE", `Updating slider to index ${this.currentIndex}`, { animate });
        if (!this.sliderElement || !this.cards || this.cards.length === 0 || !this.initialized || this.building) {
            logDebug("SWIPE", "updateSlider skipped", { slider: !!this.sliderElement, cards: this.cards?.length, init: this.initialized, building: this.building });
            return;
        }

        const cardSpacing = Math.max(0, parseInt(this._config.card_spacing)) || 0;
        const isHorizontal = this._swipeDirection === 'horizontal';
        
        // Handle loopback mode for index wrapping
        const loopbackEnabled = this._config.enable_loopback === true;
        if (loopbackEnabled && this.cards.length > 1) {
            // For loopback, we allow any index but wrap it around
            if (this.currentIndex < 0) {
                this.currentIndex = this.cards.length - 1;
            } else if (this.currentIndex >= this.cards.length) {
                this.currentIndex = 0;
            }
        } else {
            // Standard behavior - clamp to valid range
            this.currentIndex = Math.max(0, Math.min(this.currentIndex, this.cards.length - 1));
        }

        // Use gap for spacing instead of margins to maintain transparency
        this.sliderElement.style.gap = `${cardSpacing}px`;
        
        // Calculate transform amount based on direction
        const translateAmount = this.currentIndex * (isHorizontal ? this.slideWidth + cardSpacing : this.slideHeight + cardSpacing);

        this.sliderElement.style.transition = this._getTransitionStyle(animate);
        
        // Apply transform based on swipe direction
        if (isHorizontal) {
            this.sliderElement.style.transform = `translateX(-${translateAmount}px)`;
        } else {
            this.sliderElement.style.transform = `translateY(-${translateAmount}px)`;
        }

        // Remove any existing margins that could interfere with transparency
        this.cards.forEach((cardData) => {
            if (cardData.slide) {
                cardData.slide.style.marginRight = '0px';
                cardData.slide.style.marginLeft = '0px';
                cardData.slide.style.marginTop = '0px';
                cardData.slide.style.marginBottom = '0px';
            }
        });

        // Update pagination dots
        if (this.paginationElement) {
            this.paginationElement.querySelectorAll('.pagination-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === this.currentIndex);
            });
        }
        logDebug("SWIPE", `Slider updated, transform: -${translateAmount}px along ${isHorizontal ? 'X' : 'Y'} axis`);
    }

    /**
     * Gets the card size for Home Assistant
     * @returns {number} The card size
     */
    getCardSize() {
        // If showing preview, return a moderate size
        if (this._config?.cards?.length === 0) {
            return 3;
        }

        // Normal logic for actual cards
        let maxSize = 3;
        if (this.cards && this.cards.length > 0) {
            const currentCardData = this.cards[this.currentIndex];
            if (currentCardData?.element && !currentCardData.error && typeof currentCardData.element.getCardSize === 'function') {
                try {
                    maxSize = currentCardData.element.getCardSize();
                } catch (e) {
                    console.warn("Error getting card size from current element:", e);
                    maxSize = 3;
                }
            } else if (currentCardData?.element && currentCardData.element.offsetHeight) {
                // Fallback height estimation
                maxSize = Math.max(1, Math.ceil(currentCardData.element.offsetHeight / 50));
            }
        }
        logDebug("CONFIG", "Calculated card size:", maxSize);
        return Math.max(3, maxSize);
    }
}

// ======================================================================
// Editor Element
// ======================================================================

/**
 * Editor class for the Simple Swipe Card
 * @extends LitElement
 */
class SimpleSwipeCardEditor extends LitElement {
    static get properties() {
        return {
            hass: { type: Object },
            _config: { type: Object, state: true },
            lovelace: { type: Object }
        };
    }

    constructor() {
        super();
        logDebug("EDITOR", "SimpleSwipeCardEditor Constructor invoked.");

        // Generate a unique ID for this editor instance
        this._editorId = `swipe-card-editor-${Math.random().toString(36).substring(2, 15)}`;
        this._boundHandleCardPicked = this._handleCardPicked.bind(this);
        this._boundHandleNestedCardEvents = this._handleNestedCardEvents.bind(this);

        // Track active child editor dialogs
        this._activeChildEditors = new Set();

        // Track if we've detected a card-picker selection
        this._lastCardPickerSelection = null;
        this._ignoreNextCardPicker = false;
        
        // Track element editor state
        this._elementEditSession = {
            active: false,
            parentDialogId: null,
            elementId: null,
            timestamp: null,
            savedState: null
        };
        
        // Create a registry of all editors and dialogs
        if (!window._simpleSwipeEditorRegistry) {
            window._simpleSwipeEditorRegistry = new Map();
        }
        window._simpleSwipeEditorRegistry.set(this._editorId, this);
    }

    /**
     * Comprehensive event detection for element editors
     * Addresses inconsistent behavior with nested element editing
     * @param {Event} e - The event to check
     * @returns {boolean} True if the event is from an element editor
     * @private
     */
    _isElementEditorEvent(e) {
        // First check: Look for obvious markers in the event
        if (e.detail) {
            if (e.detail.fromElementEditor || 
                e.detail.elementConfig || 
                e.detail.elementToEdit || 
                e.detail.element) {
                logDebug("ELEMENT", "Element editor detected through event detail");
                return true;
            }
        }
        
        // Second check: Examine event path for element editor components
        const path = e.composedPath ? e.composedPath() : [];
        for (const node of path) {
            if (!node || !node.localName) continue;
            
            // Direct tag name checks
            if (node.localName === 'hui-element-editor' || 
                node.localName === 'hui-dialog-edit-element' ||
                node.localName.includes('element-editor')) {
                logDebug("ELEMENT", "Element editor detected through path node localName:", node.localName);
                return true;
            }
            
            // Check for specialized attributes or properties
            if (node._elementEditor || 
                node._isElementEditor ||
                (node.getAttribute && (
                    node.getAttribute('element-id') ||
                    node.getAttribute('data-element-id')
                )) ||
                (node.classList && node.classList.contains('element-editor'))) {
                logDebug("ELEMENT", "Element editor detected through specialized attributes");
                return true;
            }
            
            // Look for picture-elements specific dialogs
            if (node.tagName === 'HUI-DIALOG' && 
                (node.querySelector('.element-editor') || 
                 (node._title && typeof node._title === 'string' && node._title.toLowerCase().includes('element')))) {
                logDebug("ELEMENT", "Element editor detected through hui-dialog with element editor content");
                return true;
            }
        }
        
        // Third check: Examine the event characteristics
        if (e.type === 'element-updated' || 
            (e.type === 'config-changed' && e.target && 
             (e.target.localName === 'hui-element-editor' || 
              e.target.closest('hui-element-editor')))) {
            logDebug("ELEMENT", "Element editor detected through event characteristics");
            return true;
        }
        
        // Check if this event happens during an active element editing session
        if (this._elementEditSession.active && 
            Date.now() - this._elementEditSession.timestamp < 5000) { // 5 second window
            logDebug("ELEMENT", "Element editor event detected through active editing session");
            return true;
        }
        
        return false;
    }

    /**
     * Checks if a dialog is related to an Actions Card being edited
     * @param {HTMLElement} dialog - Dialog element to check
     * @returns {boolean} True if it's an Actions Card dialog
     * @private
     */
    _isActionsCardDialog(dialog) {
        if (!dialog) return false;

        // Check if this dialog has our marker
        if (dialog._editingActionsCard) return true;

        // Check the card type being edited
        try {
            const cardConfig = dialog.cardConfig;
            return cardConfig && cardConfig.type === 'custom:actions-card';
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Checks if a card config is a picture-elements card
     * @param {Object} config - Card configuration
     * @returns {boolean} True if it's a picture-elements card
     * @private
     */
    _isPictureElementsCard(config) {
        return config && config.type === 'picture-elements';
    }

    // Ensure card picker is properly loaded
    connectedCallback() {
        super.connectedCallback();
        logDebug("EDITOR", "SimpleSwipeCardEditor connectedCallback");
        
        // Register this editor instance globally for state sharing
        if (!window._simpleSwipeCardEditors) window._simpleSwipeCardEditors = new Set();
        window._simpleSwipeCardEditors.add(this);
        
        // Call _ensureCardPickerLoaded after a short delay to ensure shadowRoot is ready
        // and potentially after initial config is set by parent.
        setTimeout(() => this._ensureCardPickerLoaded(), 50);

        // Add enhanced event handling for nested card editors
        document.addEventListener('config-changed', this._boundHandleNestedCardEvents, { capture: true });

        // Global handler for editor card picker selections
        this._cardPickerHandler = (e) => {
            // Check for element editor events first to avoid interference
            if (this._isElementEditorEvent(e)) {
                logDebug("ELEMENT", "Config-changed event from element editor, allowing propagation");
                
                // Mark this dialog as handling an element edit
                if (e.target && e.target.closest('hui-dialog-edit-card')) {
                    const dialog = e.target.closest('hui-dialog-edit-card');
                    if (dialog) {
                        dialog._handlingElementEdit = true;
                        
                        // Track element edit session
                        this._elementEditSession.active = true;
                        this._elementEditSession.parentDialogId = dialog._parentEditorId || null;
                        this._elementEditSession.timestamp = Date.now();
                    }
                }
                
                return;
            }
            
            // Only process events potentially from card pickers
            if (e.type === 'config-changed' && e.detail?.config) {
                // Special handling for actions-card or other problematic cards
                const isActionCard = e.detail?.config?.type === 'custom:actions-card';

                // If this is a hui-card-picker event, capture it
                if (e.target?.tagName?.toLowerCase() === 'hui-card-picker') {
                    // Get the path of the event to see if it's related to our editor
                    const path = e.composedPath ? e.composedPath() : [];

                    if (path.some(node =>
                        node === this ||
                        (node.shadowRoot && node.shadowRoot.contains(this)) ||
                        (this.shadowRoot && this.shadowRoot.contains(node))
                    )) {
                        // This is from our editor's card picker
                        logDebug("EDITOR", "Card picker selection captured by global handler:", e.detail.config.type);

                        // If this is an Actions Card, we need special handling
                        if (isActionCard && !this._ignoreNextCardPicker) {
                            // Store the information before stopping propagation
                            this._lastCardPickerSelection = {
                                time: Date.now(),
                                config: e.detail.config
                            };

                            // Flag to ignore the next event, process ourselves
                            this._ignoreNextCardPicker = true;

                            // Process this ourselves without the event
                            this._safelyAddCard(e.detail.config);

                            // Stop propagation to prevent editor replacement
                            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                            e.stopPropagation();
                            return;
                        }
                    }
                }
            }
        };

        // Capture phase is important to intercept before default handling
        document.addEventListener('config-changed', this._cardPickerHandler, {
            capture: true
        });

        // Listen for iron-select events to handle tabs
        this._tabSwitchHandler = (e) => {
            // Check if the event has already been processed by an actions card editor
            if (e._processedByActionsCardEditor) {
                logDebug("EVENT", "Intercepted iron-select event already processed by actions card editor");
                e.stopPropagation();
                return;
            }
        };

        document.addEventListener('iron-select', this._tabSwitchHandler, { capture: true });

        // Add handler for dialog-closed events
        this._dialogClosedHandler = (e) => {
            if (e.target && e.target.tagName === 'HUI-DIALOG-EDIT-CARD') {
                const dialog = e.target;
                logDebug("EDITOR", "A HUI-DIALOG-EDIT-CARD closed", { 
                    tracked: this._activeChildEditors.has(dialog), 
                    isActions: this._isActionsCardDialog(dialog),
                    handlingElementEdit: dialog._handlingElementEdit
                });
                
                // End element editing session if this was the parent dialog
                if (dialog._handlingElementEdit) {
                    logDebug("ELEMENT", "Dialog handling element edit is closing, ending element edit session");
                    this._elementEditSession.active = false;
                    
                    // Important: If dialog was handling element edit and has stored element config,
                    // ensure it's not lost on dialog close
                    if (dialog._lastElementConfig) {
                        logDebug("ELEMENT", "Preserving element config on dialog close");
                        this._elementEditSession.savedState = dialog._lastElementConfig;
                        dialog._lastElementConfig = null;
                    }
                }
                
                if (this._activeChildEditors.has(dialog)) { // Check if it's one we are tracking
                    this._activeChildEditors.delete(dialog);
                    this.requestUpdate(); // Update our own UI
                    setTimeout(() => this._ensureCardPickerLoaded(), 100); // Ensure picker is good after dialog closes
                }
            }
            
            // Also handle element editor dialog close
            if (e.target && (e.target.tagName === 'HUI-DIALOG-EDIT-ELEMENT' || 
                            (e.target.tagName === 'HUI-DIALOG' && this._isElementEditorEvent(e)))) {
                logDebug("ELEMENT", "Element editor dialog closed");
                // Keep the active session for a short time after dialog close
                setTimeout(() => {
                    // Only reset if no new element edit session has started
                    if (this._elementEditSession.active && 
                        Date.now() - this._elementEditSession.timestamp > 500) {
                        logDebug("ELEMENT", "Resetting element edit session after timeout");
                        this._elementEditSession.active = false;
                    }
                }, 500);
            }
        };
        document.addEventListener('dialog-closed', this._dialogClosedHandler, { capture: true });
        
        // Add handler for element editor specific events
        this._elementEditorHandler = (e) => {
            if ((e.type === 'element-updated' || e.type === 'show-edit-element') && 
                !this._elementEditSession.active) {
                logDebug("ELEMENT", `Capturing ${e.type} event, starting element edit session`);
                this._elementEditSession.active = true;
                this._elementEditSession.timestamp = Date.now();
                if (e.detail && e.detail.elementId) {
                    this._elementEditSession.elementId = e.detail.elementId;
                }
            }
        };
        
        document.addEventListener('element-updated', this._elementEditorHandler, { capture: true });
        document.addEventListener('show-edit-element', this._elementEditorHandler, { capture: true });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        logDebug("EDITOR", "SimpleSwipeCardEditor disconnectedCallback");
        document.removeEventListener('config-changed', this._cardPickerHandler, { capture: true });
        document.removeEventListener('iron-select', this._tabSwitchHandler, { capture: true });
        document.removeEventListener('config-changed', this._boundHandleNestedCardEvents, { capture: true });
        document.removeEventListener('dialog-closed', this._dialogClosedHandler, { capture: true });
        document.removeEventListener('element-updated', this._elementEditorHandler, { capture: true });
        document.removeEventListener('show-edit-element', this._elementEditorHandler, { capture: true });

        // Clean up any tracked dialogs
        this._activeChildEditors.forEach(dialog => {
            if (dialog.parentNode) {
                try {
                    dialog.parentNode.removeChild(dialog);
                } catch (error) {
                    console.warn("Error removing dialog:", error);
                }
            }
        });
        this._activeChildEditors.clear();
        
        // Unregister this editor
        if (window._simpleSwipeCardEditors) {
            window._simpleSwipeCardEditors.delete(this);
        }
        if (window._simpleSwipeEditorRegistry) {
            window._simpleSwipeEditorRegistry.delete(this._editorId);
        }
    }

    /**
     * Enhanced handler for nested card editor events
     * Specifically targets events from action cards
     * @param {Event} e - The event to handle
     * @private
     */
    _handleNestedCardEvents(e) {
        // Check for element editor events first to prioritize them
        if (this._isElementEditorEvent(e)) {
            logDebug("ELEMENT", "Detected element editor event in _handleNestedCardEvents");
            
            // Determine if this is related to our card stack
            const isRelatedToOurStack = e.composedPath && e.composedPath().some(node => {
                return this._activeChildEditors.has(node) || 
                       (node._parentEditorId && node._parentEditorId === this._editorId);
            });
            
            if (isRelatedToOurStack) {
                logDebug("ELEMENT", "Element editor event is related to our dialog stack, handling specially");
                // Don't interfere with element editor events from our own dialog stack
                return;
            }
        }
        
        // Already handled or not relevant
        if (e._handledBySwipeCard || !e.detail?.fromActionCardEditor) return;

        // Find if this event is related to our editor's cards
        const cardElement = e.target.closest('[data-index]');
        if (!cardElement || !this._config?.cards) return;

        const cardIndex = parseInt(cardElement.getAttribute('data-index'));
        if (isNaN(cardIndex) || cardIndex < 0 || cardIndex >= this._config.cards.length) return;

        logDebug("EVENT", `Handling nested card event from actions card at index ${cardIndex}`, e.detail);

        // Prevent default behavior and stopPropagation
        e.stopPropagation();
        if (e.preventDefault) e.preventDefault();

        // Check if we should maintain editor state (prevent dialog close)
        if (e.detail.maintainEditorState) {
            logDebug("EVENT", "Event marked to maintain editor state, preventing propagation");

            // Update the configuration without firing normal event
            const updatedCards = [...this._config.cards];
            updatedCards[cardIndex] = e.detail.config;

            this._config = {
                ...this._config,
                cards: updatedCards
            };

            // Fire our own config-changed event with special flag
            this._fireConfigChanged({
                nestedCardUpdate: true,
                updatedCardIndex: cardIndex,
                nestedCardType: e.detail.config.type,
                maintainEditorState: true
            });
        } else {
            // Update the configuration
            const updatedCards = [...this._config.cards];
            updatedCards[cardIndex] = e.detail.config;

            this._config = {
                ...this._config,
                cards: updatedCards
            };

            // Fire our own config-changed event
            this._fireConfigChanged({
                nestedCardUpdate: true,
                updatedCardIndex: cardIndex,
                nestedCardType: e.detail.config.type
            });
        }

        // Mark as handled
        e._handledBySwipeCard = true;

        // Trigger UI update
        this.requestUpdate();
    }

    /**
     * Safely adds a card to the configuration without triggering editor replacement
     * @param {Object} cardConfig - Card configuration to add
     * @private
     */
    _safelyAddCard(cardConfig) {
        if (!cardConfig || !this._config) return;

        try {
            // Add to the configuration
            const currentCards = Array.isArray(this._config.cards) ? [...this._config.cards] : [];
            const updatedConfig = {
                ...this._config,
                cards: [...currentCards, cardConfig]
            };

            // Update our config
            this._config = updatedConfig;

            // Fire config changed event with special flag
            this._fireConfigChanged({
                isSafeCardAddition: true,
                addedCardType: cardConfig.type
            });

            // Force a visual update
            this.requestUpdate();
            setTimeout(() => this._ensureCardPickerLoaded(), 50); // Ensure picker is fine after adding

            // Log success
            logDebug("EDITOR", "Safely added card:", cardConfig.type);

        } catch (err) {
            logDebug("ERROR", "Failed to safely add card:", err);
        }
    }

    /**
     * Ensures the card picker is loaded and visible
     * @private
     */
    _ensureCardPickerLoaded() {
        if (!this.shadowRoot) {
            logDebug("EDITOR", "_ensureCardPickerLoaded: No shadowRoot, returning.");
            return;
        }
        logDebug("EDITOR", "_ensureCardPickerLoaded called");
    
        const container = this.shadowRoot.querySelector('#card-picker-container');
        if (container) {
            container.style.display = 'block';
    
            if (!container.hasAttribute('event-barrier-applied')) {
                container.setAttribute('event-barrier-applied', 'true');
                
                // Add a comprehensive event barrier for all config-changed events
                container.addEventListener('config-changed', (e) => {
                    // Stop ALL config-changed events at the container level
                    logDebug("EDITOR", "Intercepted config-changed at container level:", e.detail?.config?.type);
                    
                    // Process the card selection here directly
                    if (e.target && e.target.tagName && 
                        e.target.tagName.toLowerCase() === 'hui-card-picker' && 
                        e.detail && e.detail.config) {
                        
                        const cardConfig = e.detail.config;
                        logDebug("EDITOR", "Processing card selection:", cardConfig.type);
                        
                        // Add the card to our config
                        if (this._config) {
                            const cards = Array.isArray(this._config.cards) ? [...this._config.cards] : [];
                            cards.push(cardConfig);
                            
                            this._config = {
                                ...this._config,
                                cards
                            };
                            
                            // Fire our own config-changed event
                            this._fireConfigChanged({
                                cardAdded: true,
                                cardType: cardConfig.type
                            });
                            
                            this.requestUpdate();
                        }
                    }
                    
                    // Always stop propagation
                    e.stopPropagation();
                    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                    return false;
                }, { capture: true });
            }
    
            const picker = container.querySelector('hui-card-picker');
            if (picker) {
                picker.style.display = 'block';
                
                // If picker has no content, try to refresh it
                if (picker.requestUpdate) {
                    picker.requestUpdate();
                }
            }
        }
        
        this.requestUpdate();
    }

    static get styles() {
        return css`
            .card-config {
                /* Let HA handle padding */
            }

            .info-panel {
                display: flex;
                align-items: flex-start;
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
                background-color: var(--info-color, #4a90e2);
                color: white;
                margin-right: 12px;
                flex-shrink: 0;
            }

            .info-text {
                flex-grow: 1;
                color: var(--primary-text-color);
                font-size: 14px;
            }

            .section {
                margin-bottom: 20px;
                padding-bottom: 16px;
                border-bottom: 1px solid var(--divider-color);
            }

            .section:last-of-type {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }

            /* Ensure the cards section has a bottom border */
            .cards-section {
                border-bottom: 1px solid var(--divider-color);
                margin-bottom: 0;
            }

            .section-header {
                font-size: 16px;
                font-weight: 500;
                margin-bottom: 8px;
                color: var(--primary-text-color);
                padding-bottom: 4px;
            }

            .option-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 0;
                min-height: 40px;
            }

            .option-label {
                flex: 1;
                margin-right: 12px;
                font-size: 14px;
                color: var(--primary-text-color);
            }

            .help-text {
                color: var(--secondary-text-color);
                font-size: 12px;
                padding: 0 4px;
                margin-top: 4px;
                margin-bottom: 12px;
            }

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
                margin-bottom: 8px;
                background: var(--secondary-background-color);
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

            .no-cards {
                text-align: center;
                color: var(--secondary-text-color);
                padding: 16px;
                border: 1px dashed var(--divider-color);
                border-radius: var(--ha-card-border-radius, 4px);
                margin-bottom: 16px;
            }

            #card-picker-container {
                display: block;
                margin-top: 16px;
                margin-bottom: 20px;
                padding-top: 16px;
                border-top: none; /* Keep top border removed */
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

            ha-textfield {
                width: 100%;
            }
            
            ha-select {
                width: 100%;
            }

            /* Nested cards styling */
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
            
            /* Direction icon styling */
            .direction-icon {
                width: 32px;
                height: 32px;
                margin-left: 8px;
                color: var(--primary-color);
            }
        `;
    }

    /**
     * Sets the configuration for the editor
     * @param {Object} config - The configuration object
     */
    setConfig(config) {
        if (!config) {
            throw new Error("Invalid configuration");
        }
        logDebug("EDITOR", "Editor setConfig received:", JSON.stringify(config));

        this._config = JSON.parse(JSON.stringify(config));
        if (!Array.isArray(this._config.cards)) this._config.cards = [];
        if (this._config.show_pagination === undefined) this._config.show_pagination = true;
        if (this._config.card_spacing === undefined) {
            this._config.card_spacing = 15;
        } else {
            const spacing = parseInt(this._config.card_spacing);
            this._config.card_spacing = (isNaN(spacing) || spacing < 0) ? 15 : spacing;
        }
        // Set default for enable_loopback
        if (this._config.enable_loopback === undefined) this._config.enable_loopback = false;
        
        // Set default for swipe_direction
        if (this._config.swipe_direction === undefined || 
            !['horizontal', 'vertical'].includes(this._config.swipe_direction)) {
            this._config.swipe_direction = 'horizontal';
        }
        
        delete this._config.title;

        // Ensure card picker is loaded after config is set
        setTimeout(() => this._ensureCardPickerLoaded(), 50);
    }

    /**
     * Handles value changes in the editor
     * @param {Event} ev - The change event
     * @private
     */
    _valueChanged(ev) {
        if (!this._config || !ev.target) return;
        const target = ev.target;
        const option = target.configValue || target.getAttribute('data-option');
        const parentOption = target.parentElement?.configValue || target.parentElement?.getAttribute('data-option');
        const finalOption = option || parentOption;
        if (!finalOption) return;
    
        let value;
        if (target.localName === 'ha-switch') {
            value = target.checked;
        } else if (target.localName === 'ha-textfield' && target.type === 'number') {
            value = parseInt(target.value);
            if (isNaN(value) || value < 0) value = (finalOption === 'card_spacing') ? 15 : 0;
        } else {
            value = target.value;
        }
    
        // Guard against redundant updates to prevent loops
        if (this._config[finalOption] !== value) {
            logDebug("EDITOR", `Value changed for ${finalOption}:`, value);
            
            // Create a new config object to ensure reactivity
            this._config = { ...this._config, [finalOption]: value };
            
            // Fire config changed without requesting an update
            this._fireConfigChanged();
            
            // Don't call requestUpdate() here as it may cause update loops
        }
    }

    /**
     * Fires the config-changed event with proper identification
     * @param {Object} [extraData] - Additional data to include in the event
     * @private
     */
    _fireConfigChanged(extraData = {}) {
        if (!this._config) return;

        // Determine if the event should bubble based on maintainEditorState
        const shouldBubble = !extraData.maintainEditorState; 

        // Create a custom event with the editor ID
        const event = new CustomEvent('config-changed', {
            detail: {
                config: this._config,
                editorId: this._editorId,
                fromSwipeCardEditor: true,
                ...extraData
            },
            bubbles: shouldBubble,    // Set bubbles based on maintainEditorState
            composed: true            // Cross shadow DOM boundary
        });

        logDebug("EDITOR", "Firing config-changed event", { bubble: shouldBubble, ...extraData });
        this.dispatchEvent(event);
    }

    /**
     * Handles card selection from the picker
     * @param {Event} ev - The selection event
     * @private
     */
    _handleCardPicked(ev) {
        // This is a fallback - all events should be caught by the container listener
        logDebug("EDITOR", "Fallback _handleCardPicked called:", ev.detail?.config?.type);
        
        // Stop propagation to prevent editor replacement
        ev.stopPropagation();
        if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
    
        if (!ev.detail?.config) return;
    
        // Add the card to our config
        const newCardConfig = ev.detail.config;
        logDebug("EDITOR", "Adding card in fallback handler:", newCardConfig.type);
    
        const currentCards = Array.isArray(this._config.cards) ? [...this._config.cards] : [];
        const updatedConfig = {
            ...this._config,
            cards: [...currentCards, newCardConfig]
        };
    
        this._config = updatedConfig;
        this._fireConfigChanged();
        this.requestUpdate();
    }

    /**
     * Opens the edit dialog for a card
     * @param {number} index - The index of the card to edit
     * @private
     */
    async _editCard(index) {
        logDebug("EDITOR", `_editCard called for index ${index}`);
        if (!this._config || !this._config.cards || index < 0 || index >= this._config.cards.length) {
            logDebug("ERROR", "SimpleSwipeCardEditor: Invalid index for card editing:", index);
            return;
        }

        const cardConfig = this._config.cards[index];
        const hass = this.hass;
        const mainApp = document.querySelector('home-assistant');

        if (!hass || !mainApp) {
            logDebug("ERROR", "SimpleSwipeCardEditor: Cannot find Home Assistant instance");
            return;
        }

        try {
            await customElements.whenDefined('hui-dialog-edit-card');

            const dialog = document.createElement('hui-dialog-edit-card');
            dialog.hass = hass;

            document.body.appendChild(dialog); // Add to body FIRST
            this._activeChildEditors.add(dialog);
            dialog._parentEditorId = this._editorId; 
            
            // Add special attributes for picture-elements cards to enhance tracking
            if (this._isPictureElementsCard(cardConfig)) {
                dialog.setAttribute('data-editing-picture-elements', 'true');
                dialog._editingPictureElements = true;
            }
            
            logDebug("EDITOR", `[CARD INDEX ${index}] hui-dialog-edit-card created and added to body. Tracking it.`);

            // --- Listener Setup ---
            // Store bound functions for removal
            const boundHandleDialogConfigChanged = this._handleDialogConfigChanged.bind(this, index, dialog);
            const boundHandleDialogShowDialog = this._handleDialogShowDialog.bind(this, index);

            dialog.addEventListener('config-changed', boundHandleDialogConfigChanged, { capture: true });
            dialog.addEventListener('show-dialog', boundHandleDialogShowDialog, { capture: true });
            dialog.addEventListener('ll-show-dialog', boundHandleDialogShowDialog, { capture: true });
            
            // For picture-elements, listen to element editor events
            if (this._isPictureElementsCard(cardConfig)) {
                dialog.addEventListener('element-updated', (e) => {
                    logDebug("ELEMENT", "Element updated event on dialog", e.detail);
                    dialog._handlingElementEdit = true;
                    this._elementEditSession.active = true;
                    this._elementEditSession.timestamp = Date.now();
                }, { capture: true });
                
                dialog.addEventListener('show-edit-element', (e) => {
                    logDebug("ELEMENT", "Show edit element event on dialog", e.detail);
                    dialog._handlingElementEdit = true;
                    this._elementEditSession.active = true;
                    this._elementEditSession.timestamp = Date.now();
                }, { capture: true });
            }

            if (cardConfig.type === 'custom:actions-card') {
                dialog._editingActionsCard = true;
            }

            const handleDialogClose = (e) => {
                logDebug("EDITOR", `[CARD INDEX ${index}] hui-dialog-edit-card closed event received.`);
                // Remove listeners using the stored bound functions
                dialog.removeEventListener('dialog-closed', handleDialogClose);
                dialog.removeEventListener('config-changed', boundHandleDialogConfigChanged, { capture: true });
                dialog.removeEventListener('show-dialog', boundHandleDialogShowDialog, { capture: true });
                dialog.removeEventListener('ll-show-dialog', boundHandleDialogShowDialog, { capture: true });
                
                if (this._isPictureElementsCard(cardConfig)) {
                    dialog.removeEventListener('element-updated', handleElementUpdated, { capture: true });
                    dialog.removeEventListener('show-edit-element', handleShowEditElement, { capture: true });
                }

                this._activeChildEditors.delete(dialog);
                logDebug("EDITOR", `[CARD INDEX ${index}] hui-dialog-edit-card removed from tracking. Active child editors: ${this._activeChildEditors.size}`);

                // Reset element edit session if it's from this dialog
                if (dialog._handlingElementEdit) {
                    logDebug("ELEMENT", "Element edit session reset due to dialog close");
                    setTimeout(() => {
                        // Only clear if no new element edit session has started
                        if (this._elementEditSession.active && 
                            Date.now() - this._elementEditSession.timestamp > 500) {
                            this._elementEditSession.active = false;
                        }
                    }, 500);
                }

                if (dialog.parentNode === document.body) {
                    try {
                        document.body.removeChild(dialog);
                        logDebug("EDITOR", `[CARD INDEX ${index}] hui-dialog-edit-card removed from body.`);
                    } catch (error) {
                         console.warn(`[CARD INDEX ${index}] Error removing dialog from body:`, error);
                    }
                }
                setTimeout(() => this._ensureCardPickerLoaded(), 100);
            };
            dialog.addEventListener('dialog-closed', handleDialogClose);
            
            // Additional handlers for picture-elements cards
            const handleElementUpdated = (e) => {
                logDebug("ELEMENT", "Element updated event on dialog", e.detail);
                dialog._handlingElementEdit = true;
                this._elementEditSession.active = true;
                this._elementEditSession.timestamp = Date.now();
            };
            
            const handleShowEditElement = (e) => {
                logDebug("ELEMENT", "Show edit element event on dialog", e.detail);
                dialog._handlingElementEdit = true;
                this._elementEditSession.active = true;
                this._elementEditSession.timestamp = Date.now();
            };
            
            if (this._isPictureElementsCard(cardConfig)) {
                dialog.addEventListener('element-updated', handleElementUpdated, { capture: true });
                dialog.addEventListener('show-edit-element', handleShowEditElement, { capture: true });
            }
            // --- End Listener Setup ---


            const dialogParams = {
                cardConfig: cardConfig,
                lovelaceConfig: this.lovelace || mainApp.lovelace,
                // This is the FINAL save from hui-dialog-edit-card
                saveCardConfig: async (savedCardConfig) => { 
                    logDebug("EDITOR", `[CARD INDEX ${index}] saveCardConfig callback in hui-dialog-edit-card invoked.`);
                    
                    // Check if this save is coming from an element editor
                    if (dialog._savingFromElementEditor || dialog._handlingElementEdit) {
                        logDebug("ELEMENT", `[CARD INDEX ${index}] Save detected from element editor, preserving dialog state`);
                        dialog._savingFromElementEditor = false;
                        
                        // Keep the element edit session active for a short time to catch any related events
                        this._elementEditSession.timestamp = Date.now();
                        
                        // If we have a savedCardConfig, update it silently in our configuration
                        // This keeps picture-elements changes without closing the editor
                        if (savedCardConfig) {
                            logDebug("ELEMENT", "Silently updating config with element changes");
                            const updatedCards = [...this._config.cards];
                            updatedCards[index] = savedCardConfig;
                            this._config = { ...this._config, cards: updatedCards };
                            
                            // Fire a non-bubbling config change to update parent without closing
                            this._fireConfigChanged({
                                maintainEditorState: true,
                                fromElementEditor: true,
                                updatedCardIndex: index
                            });
                        }
                        
                        // Return the config to prevent dialog from closing
                        return savedCardConfig;
                    }
                    
                    // Handle dialog closing during element edit
                    if (dialog._lastElementConfig && !savedCardConfig) {
                        logDebug("ELEMENT", `[CARD INDEX ${index}] Element editor cancel detected, restoring previous config`);
                        dialog._lastElementConfig = null;
                        // Don't return anything to allow dialog close
                        return;
                    }
                    
                    if (!savedCardConfig) return;
                    const updatedCards = [...this._config.cards];
                    updatedCards[index] = savedCardConfig;
                    this._config = { ...this._config, cards: updatedCards };
                    // Fire a BUBBLING event here, as the edit session for this card IS finished.
                    this._fireConfigChanged({ reason: "child_dialog_saved" }); 
                    this.requestUpdate();
                    // Dialog will close itself, handleDialogClose will manage cleanup
                    setTimeout(() => this._ensureCardPickerLoaded(), 100); // Also ensure here
                }
            };
            
            logDebug("EDITOR", `[CARD INDEX ${index}] About to call dialog.showDialog()`);
            await dialog.showDialog(dialogParams);
            logDebug("EDITOR", `[CARD INDEX ${index}] dialog.showDialog() finished.`);

        } catch (err) {
            logDebug("ERROR", "SimpleSwipeCardEditor: Error opening edit dialog:", err);
            // Fallback method... (remains the same)
            fireEvent(this, 'll-show-dialog', {
                dialogTag: 'hui-dialog-edit-card',
                dialogImport: () => import('hui-dialog-edit-card'),
                dialogParams: {
                    cardConfig: cardConfig,
                    lovelaceConfig: this.lovelace || mainApp.lovelace,
                    saveCardConfig: async (savedCardConfig) => {
                        if (!savedCardConfig) return;
                        const updatedCards = [...this._config.cards];
                        updatedCards[index] = savedCardConfig;
                        this._config = { ...this._config, cards: updatedCards };
                        this._fireConfigChanged({ reason: "child_dialog_saved_fallback" });
                        this.requestUpdate();
                        setTimeout(() => this._ensureCardPickerLoaded(), 100);
                    }
                }
            });
        }
    }
    
    /**
     * Handles config-changed events originating from within the hui-dialog-edit-card.
     * @param {number} index - The index of the card being edited.
     * @param {HTMLElement} dialog - The hui-dialog-edit-card element.
     * @param {Event} e - The config-changed event.
     * @private
     */
    _handleDialogConfigChanged(index, dialog, e) {
        // Log detailed information when in debug mode
        if (DEBUG) {
            const path = e.composedPath ? e.composedPath().map(n => n.localName || n.nodeName).join(' > ') : 'No path';
            const detailString = e.detail ? JSON.stringify(e.detail, null, 2) : '{}';
            logDebug("EVENT", `Config change event details:`, {
                target: e.target.localName,
                path: path,
                detail: JSON.parse(detailString),
                rawDetail: detailString,
                currentTarget: e.currentTarget.localName
            });
        }

        // Use our robust element editor detection
        if (this._isElementEditorEvent(e)) {
            logDebug("ELEMENT", `[CARD INDEX ${index}] Element editor event detected, preserving and allowing propagation`);
            
            // Mark the dialog as handling an element edit session
            dialog._handlingElementEdit = true;
            
            // Refresh element edit session time
            this._elementEditSession.active = true;
            this._elementEditSession.timestamp = Date.now();
            
            // Track the event for state restoration if needed
            if (e.detail && e.detail.config) {
                dialog._lastElementConfig = JSON.parse(JSON.stringify(e.detail.config));
                dialog._savingFromElementEditor = true;
                
                // Silently update the configuration to keep changes without closing dialogs
                if (dialog._editingPictureElements) {
                    try {
                        logDebug("ELEMENT", "Silently updating picture-elements config");
                        const updatedCards = [...this._config.cards];
                        updatedCards[index] = e.detail.config;
                        this._config = { ...this._config, cards: updatedCards };
                        
                        // Fire silent update
                        this._fireConfigChanged({
                            maintainEditorState: true,
                            fromElementEditor: true,
                            elementEditorEvent: true,
                            updatedCardIndex: index
                        });
                    } catch (err) {
                        logDebug("ERROR", "Error silently updating config:", err);
                    }
                }
            }
            
            // Critical: Do NOT stop propagation for element editor events
            return;
        }

        // Check if the event originated from within the dialog's content editor
        if (e.target !== dialog && e.detail && e.detail.config) {
            // Stop the event from bubbling OUTSIDE hui-dialog-edit-card
            // but allow propagation *within* it.
            e.stopPropagation(); 
            
            const newCardConfig = e.detail.config;
            logDebug("EDITOR", `[CARD INDEX ${index}] Config received in handler: ${JSON.stringify(newCardConfig.type)}`);

            const updatedCards = [...this._config.cards];
            updatedCards[index] = newCardConfig;
            this._config = { ...this._config, cards: updatedCards };

            // Fire our own config-changed event, with maintainEditorState: true.
            this._fireConfigChanged({
                maintainEditorState: true,
                updatedCardIndex: index,
                reason: `child_dialog_update_${e.detail.fromActionCardEditor ? 'action_card' : 'generic'}`
            });
            this.requestUpdate(); // Update SimpleSwipeCardEditor's own UI if necessary
            
            logDebug("EDITOR", `[CARD INDEX ${index}] Processed config-changed from content, stopped propagation OUTSIDE dialog.`);
        } else {
            logDebug("EDITOR", `[CARD INDEX ${index}] config-changed ignored or allowed to bubble (no config or event target is the dialog itself)`);
        }
    }

    /**
     * Handles show-dialog events originating from within the hui-dialog-edit-card.
     * Re-fires the event from the SimpleSwipeCardEditor context.
     * @param {number} index - The index of the card being edited.
     * @param {Event} ev - The show-dialog or ll-show-dialog event.
     * @private
     */
    _handleDialogShowDialog(index, ev) {
        // Check if this is for an element editor
        const isElementEditorDialog = ev.detail && (
            (ev.detail.dialogTag && (
                ev.detail.dialogTag === 'hui-dialog-edit-element' || 
                ev.detail.dialogTag.includes('element-editor')
            )) ||
            (ev.detail.elementToEdit)
        );
        
        if (isElementEditorDialog) {
            logDebug("ELEMENT", `[CARD INDEX ${index}] Element editor dialog detected, allowing normal event flow`);
            
            // Mark parent dialog as handling element edit
            const dialog = ev.currentTarget;
            if (dialog) {
                dialog._handlingElementEdit = true;
            }
            
            // Update element edit session state
            this._elementEditSession.active = true;
            this._elementEditSession.timestamp = Date.now();
            if (ev.detail && ev.detail.elementId) {
                this._elementEditSession.elementId = ev.detail.elementId;
            }
            
            // Don't interfere with element editor dialogs
            return;
        }
        
        const detailString = ev.detail ? JSON.stringify(ev.detail) : '{}';
        logDebug("EDITOR", `[CARD INDEX ${index}] INTERCEPTED "${ev.type}" event from hui-dialog-edit-card OR ITS CONTENT`, { 
            detail: JSON.parse(detailString), 
            target: ev.target.localName 
        });
        
        // For non-element editor dialogs, stop propagation and re-fire from our level
        ev.stopPropagation();
        if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
        if (ev.cancelable) ev.preventDefault();

        // Re-fire the event from SimpleSwipeCardEditor itself
        logDebug("EDITOR", `[CARD INDEX ${index}] Re-firing "${ev.type}" event from SimpleSwipeCardEditor.`);
        fireEvent(this, ev.type, ev.detail);
    }


    /**
     * Moves a card in the list
     * @param {number} index - The index of the card to move
     * @param {number} direction - The direction to move (-1 for up, 1 for down)
     * @private
     */
    _moveCard(index, direction) {
        if (!this._config?.cards) return;
        const cards = [...this._config.cards];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= cards.length) return;

        // Swap the cards
        logDebug("EDITOR", `Moving card ${index} to position ${newIndex}`);
        [cards[index], cards[newIndex]] = [cards[newIndex], cards[index]];

        this._config = { ...this._config, cards };
        this._fireConfigChanged();
        this.requestUpdate();
    }

    /**
     * Removes a card from the list
     * @param {number} index - The index of the card to remove
     * @private
     */
    _removeCard(index) {
        if (!this._config?.cards || index < 0 || index >= this._config.cards.length) return;

        logDebug("EDITOR", `Removing card at index ${index}`);
        const cards = this._config.cards.filter((_, i) => i !== index);
        this._config = { ...this._config, cards };
        this._fireConfigChanged();
        this.requestUpdate();
    }

    /**
     * Gets a descriptive name for a card configuration
     * @param {Object} cardConfig - The card configuration
     * @returns {Object} An object with type name and card name
     * @private
     */
    _getCardDescriptor(cardConfig) {
        if (!cardConfig?.type) return { typeName: 'Unknown', name: '', isPictureElements: false };
        let type = cardConfig.type.startsWith('custom:') ? cardConfig.type.substring(7) : cardConfig.type;
        const typeName = type.split(/[-_]/).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
        const name = cardConfig.title || cardConfig.name || '';
        const isPictureElements = type === 'picture-elements';
        return { typeName, name, isPictureElements };
    }

    /**
     * Checks if a card configuration contains nested cards
     * @param {Object} cardConfig - The card configuration to check
     * @returns {boolean} True if the card has nested cards
     * @private
     */
    _hasNestedCards(cardConfig) {
        // Check for action-card with card property
        if (cardConfig.type === 'custom:actions-card' && cardConfig.card) {
            return Array.isArray(cardConfig.card) ? cardConfig.card.length > 0 : !!cardConfig.card;
        }
        return false;
    }

    /**
     * Gets the nested cards from a card configuration
     * @param {Object} cardConfig - The card configuration
     * @returns {Array} Array of nested card configurations
     * @private
     */
    _getNestedCards(cardConfig) {
        if (!this._hasNestedCards(cardConfig)) return [];
        return Array.isArray(cardConfig.card) ? cardConfig.card : [cardConfig.card];
    }

    /**
     * Moves a nested card in the list
     * @param {number} parentIndex - The index of the parent card
     * @param {number} nestedIndex - The index of the nested card
     * @param {number} direction - The direction to move (-1 for up, 1 for down)
     * @private
     */
    _moveNestedCard(parentIndex, nestedIndex, direction) {
        if (!this._config?.cards || !this._config.cards[parentIndex]) return;

        const parentCard = this._config.cards[parentIndex];
        if (!this._hasNestedCards(parentCard)) return;

        let nestedCards = this._getNestedCards(parentCard);
        const newNestedIndex = nestedIndex + direction;

        if (newNestedIndex < 0 || newNestedIndex >= nestedCards.length) return;

        logDebug("EDITOR", `Moving nested card ${parentIndex}.${nestedIndex} to position ${parentIndex}.${newNestedIndex}`);

        // Swap the cards
        [nestedCards[nestedIndex], nestedCards[newNestedIndex]] =
            [nestedCards[newNestedIndex], nestedCards[nestedIndex]];

        // Update the configuration
        const updatedCards = [...this._config.cards];
        updatedCards[parentIndex] = {...parentCard, card: nestedCards};
        this._config = {...this._config, cards: updatedCards};

        this._fireConfigChanged();
        this.requestUpdate();
    }

    /**
     * Removes a nested card from the list
     * @param {number} parentIndex - The index of the parent card
     * @param {number} nestedIndex - The index of the nested card to remove
     * @private
     */
    _removeNestedCard(parentIndex, nestedIndex) {
        if (!this._config?.cards || !this._config.cards[parentIndex]) return;

        const parentCard = this._config.cards[parentIndex];
        if (!this._hasNestedCards(parentCard)) return;

        let nestedCards = this._getNestedCards(parentCard);
        if (nestedIndex < 0 || nestedIndex >= nestedCards.length) return;

        logDebug("EDITOR", `Removing nested card ${parentIndex}.${nestedIndex}`);

        // Remove the card
        nestedCards = nestedCards.filter((_, i) => i !== nestedIndex);

        // Update the configuration
        const updatedCards = [...this._config.cards];
        updatedCards[parentIndex] = {...parentCard, card: nestedCards};
        this._config = {...this._config, cards: updatedCards};

        this._fireConfigChanged();
        this.requestUpdate();
    }

    /**
     * Opens the edit dialog for a nested card
     * @param {number} parentIndex - The index of the parent card
     * @param {number} nestedIndex - The index of the nested card to edit
     * @private
     */
    async _editNestedCard(parentIndex, nestedIndex) {
        logDebug("EDITOR", `_editNestedCard called for parent ${parentIndex}, nested ${nestedIndex}`);
        if (!this._config?.cards ||
            !this._config.cards[parentIndex] ||
            !this._hasNestedCards(this._config.cards[parentIndex])) {
            logDebug("ERROR", "SimpleSwipeCardEditor: Invalid indices for nested card editing:", parentIndex, nestedIndex);
            return;
        }

        const parentCard = this._config.cards[parentIndex];
        const nestedCards = this._getNestedCards(parentCard);
        if (nestedIndex < 0 || nestedIndex >= nestedCards.length) return;

        const cardConfig = nestedCards[nestedIndex];
        const hass = this.hass;
        const mainApp = document.querySelector('home-assistant');

        if (!hass || !mainApp) {
            logDebug("ERROR", "SimpleSwipeCardEditor: Cannot find Home Assistant instance");
            return;
        }

        try {
            await customElements.whenDefined('hui-dialog-edit-card');

            const dialog = document.createElement('hui-dialog-edit-card');
            dialog.hass = hass;

            document.body.appendChild(dialog);
            this._activeChildEditors.add(dialog);
            dialog._parentEditorId = this._editorId;
            
            // Add special attributes for picture-elements cards to enhance tracking
            if (this._isPictureElementsCard(cardConfig)) {
                dialog.setAttribute('data-editing-picture-elements', 'true');
                dialog._editingPictureElements = true;
            }

            // Add element editor detection
            dialog.addEventListener('config-changed', (e) => {
                // Check if this is from an element editor (FIXED - Added element editor check)
                if (this._isElementEditorEvent(e)) {
                    logDebug("ELEMENT", `Nested card: Detected element editor event, allowing natural propagation`);
                    
                    // Mark the dialog as handling an element edit session
                    dialog._handlingElementEdit = true;
                    
                    // Update element edit session state
                    this._elementEditSession.active = true;
                    this._elementEditSession.timestamp = Date.now();
                    
                    // Track the event for state restoration if needed
                    if (e.detail && e.detail.config) {
                        dialog._lastElementConfig = JSON.parse(JSON.stringify(e.detail.config));
                        dialog._savingFromElementEditor = true;
                    }
                    
                    // Critical: Do NOT stop propagation for element editor events
                    return;
                }
                
                if (e.detail?.fromExternalEditor || e.detail?.fromActionCardEditor ||
                    e.detail?.fromSwipeCardEditor) {
                    logDebug("EDITOR", "Marking nested event as already handled in _editNestedCard's dialog");
                    e._handledByParentEditor = true;
                }
            }, true);

            const handleDialogClose = (e) => {
                dialog.removeEventListener('dialog-closed', handleDialogClose);
                
                // End element editing session if this was the parent dialog
                if (dialog._handlingElementEdit) {
                    logDebug("ELEMENT", "Dialog handling element edit is closing, ending element edit session");
                    this._elementEditSession.active = false;
                }
                
                this._activeChildEditors.delete(dialog);
                if (dialog.parentNode === document.body) {
                    try {
                        document.body.removeChild(dialog);
                    } catch (error) {
                        console.warn("Error removing nested card dialog:", error);
                    }
                }
                setTimeout(() => this._ensureCardPickerLoaded(), 100); // Ensure picker is fine after dialog closes
            };
            dialog.addEventListener('dialog-closed', handleDialogClose);

            const dialogParams = {
                cardConfig: cardConfig,
                lovelaceConfig: this.lovelace || mainApp.lovelace,
                saveCardConfig: async (savedCardConfig) => {
                    // Check if this save is coming from an element editor (FIXED - Added element editor check)
                    if (dialog._savingFromElementEditor || dialog._handlingElementEdit) {
                        logDebug("ELEMENT", `Nested card: Save detected from element editor, preserving dialog state`);
                        dialog._savingFromElementEditor = false;
                        
                        // Keep the element edit session active for a short time to catch any related events
                        this._elementEditSession.timestamp = Date.now();
                        
                        // If we have a savedCardConfig, update it silently in our configuration
                        if (savedCardConfig) {
                            logDebug("ELEMENT", "Silently updating nested card config with element changes");
                            const updatedNestedCards = [...nestedCards];
                            updatedNestedCards[nestedIndex] = savedCardConfig;
                            const updatedParentCard = {...parentCard, card: updatedNestedCards};
                            const updatedCards = [...this._config.cards];
                            updatedCards[parentIndex] = updatedParentCard;
                            this._config = { ...this._config, cards: updatedCards };
                            
                            // Fire a non-bubbling config change to update parent without closing
                            this._fireConfigChanged({
                                maintainEditorState: true,
                                fromElementEditor: true,
                                updatedCardIndex: parentIndex,
                                nestedCardIndex: nestedIndex
                            });
                        }
                        
                        // Return the config to prevent dialog from closing
                        return savedCardConfig;
                    }
                    
                    // Handle dialog closing during element edit
                    if (dialog._lastElementConfig && !savedCardConfig) {
                        logDebug("ELEMENT", `Nested card: Element editor cancel detected, restoring previous config`);
                        dialog._lastElementConfig = null;
                        return;
                    }
                    
                    if (!savedCardConfig) return;
                    
                    logDebug("EDITOR", `Saving nested card ${parentIndex}.${nestedIndex} with new config`);
                    const updatedNestedCards = [...nestedCards];
                    updatedNestedCards[nestedIndex] = savedCardConfig;
                    const updatedParentCard = {...parentCard, card: updatedNestedCards};
                    const updatedCards = [...this._config.cards];
                    updatedCards[parentIndex] = updatedParentCard;
                    this._config = { ...this._config, cards: updatedCards };
                    this._fireConfigChanged();
                    this.requestUpdate();
                    setTimeout(() => this._ensureCardPickerLoaded(), 100); // Ensure picker is fine
                }
            };
            await dialog.showDialog(dialogParams);

        } catch (err) {
            logDebug("ERROR", "SimpleSwipeCardEditor: Error opening edit dialog for nested card:", err);
            fireEvent(this, 'll-show-dialog', {
                dialogTag: 'hui-dialog-edit-card',
                dialogImport: () => import('hui-dialog-edit-card'),
                dialogParams: {
                    cardConfig: cardConfig,
                    lovelaceConfig: this.lovelace || mainApp.lovelace,
                    saveCardConfig: async (savedCardConfig) => {
                        if (!savedCardConfig) return;
                        const updatedNestedCards = [...nestedCards];
                        updatedNestedCards[nestedIndex] = savedCardConfig;
                        const updatedParentCard = {...parentCard, card: updatedNestedCards};
                        const updatedCards = [...this._config.cards];
                        updatedCards[parentIndex] = updatedParentCard;
                        this._config = { ...this._config, cards: updatedCards };
                        this._fireConfigChanged();
                        this.requestUpdate();
                        setTimeout(() => this._ensureCardPickerLoaded(), 100); // Ensure picker is fine
                    }
                }
            });
        }
    }

    /**
     * Renders the editor UI
     * @returns {TemplateResult} The template to render
     */
    render() {
        logDebug("EDITOR", "SimpleSwipeCardEditor render called");
        if (!this.hass || !this._config) {
            return html`<ha-circular-progress active alt="Loading editor"></ha-circular-progress>`;
        }

        const cards = this._config.cards || [];
        const showPagination = this._config.show_pagination !== false;
        const cardSpacing = this._config.card_spacing ?? 15;
        const enableLoopback = this._config.enable_loopback === true;
        const swipeDirection = this._config.swipe_direction || 'horizontal';

        return html`
            <div class="card-config">
                <!-- Information Panel -->
                <div class="info-panel">
                    <div class="info-icon">i</div>
                    <div class="info-text">
                        To add a card, search for the card type in the picker below and click on it.
                        It will be added with every click.
                        After adding cards, you can go back to the top of this editor to edit each card and reorder them using the up/down arrows.
                    </div>
                </div>

                <!-- Display Options -->
                <div class="section">
                    <div class="section-header">Display Options</div>

                    <ha-textfield
                        label="Card Spacing (px)"
                        .value=${cardSpacing.toString()}
                        data-option="card_spacing"
                        type="number"
                        min="0"
                        max="100"
                        suffix="px"
                        @change=${this._valueChanged}
                        autoValidate pattern="[0-9]+" required
                    ></ha-textfield>

                    <div class="help-text">Visual gap between cards when swiping (in pixels)</div>
                    
                    <div class="option-row">
                        <div class="option-label">Swipe direction</div>
                        <div class="option-control">
                            <ha-select
                                .value=${swipeDirection}
                                data-option="swipe_direction"
                                @change=${this._valueChanged}
                                @closed=${(ev) => ev.stopPropagation()}
                            >
                                <ha-list-item .value=${'horizontal'}>
                                    Horizontal
                                    <ha-icon slot="graphic" class="direction-icon" icon="mdi:gesture-swipe-horizontal"></ha-icon>
                                </ha-list-item>
                                <ha-list-item .value=${'vertical'}>
                                    Vertical
                                    <ha-icon slot="graphic" class="direction-icon" icon="mdi:gesture-swipe-vertical"></ha-icon>
                                </ha-list-item>
                            </ha-select>
                        </div>
                    </div>
                    
                    <div class="help-text">The direction to swipe between cards</div>

                    <div class="option-row">
                        <div class="option-label">Show pagination dots</div>
                        <div class="option-control">
                            <ha-switch
                                .checked=${showPagination}
                                data-option="show_pagination"
                                @change=${this._valueChanged}
                            ></ha-switch>
                        </div>
                    </div>
                    
                    <div class="option-row">
                        <div class="option-label">Enable loopback mode</div>
                        <div class="option-control">
                            <ha-switch
                                .checked=${enableLoopback}
                                data-option="enable_loopback"
                                @change=${this._valueChanged}
                            ></ha-switch>
                        </div>
                    </div>

                    <div class="help-text">When enabled, swiping past the last card will circle back to the first card, and vice versa.</div>
                </div>

                <!-- Cards Management -->
                <div class="section cards-section">
                    <div class="section-header">Cards</div>

                    <div class="card-list">
                        ${cards.length === 0 ?
                            html`<div class="no-cards">No cards added yet. Select a card type below to add your first card.</div>` :
                            cards.map((card, index) => {
                                const descriptor = this._getCardDescriptor(card);
                                const hasNestedCards = this._hasNestedCards(card);
                                const nestedCards = hasNestedCards ? this._getNestedCards(card) : [];

                                return html`
                                <div class="card-row" data-index=${index}>
                                    <div class="card-info">
                                        <span class="card-index">${index + 1}</span>
                                        <span class="card-type">${descriptor.typeName}</span>
                                        ${descriptor.isPictureElements ? html`<span class="picture-elements-badge">Elements</span>` : ''}
                                        ${descriptor.name ? html`<span class="card-name">(${descriptor.name})</span>` : ''}
                                    </div>
                                    <div class="card-actions">
                                        <ha-icon-button
                                            label="Move Up"
                                            ?disabled=${index === 0}
                                            path="M7,15L12,10L17,15H7Z"
                                            @click=${() => this._moveCard(index, -1)}
                                        ></ha-icon-button>
                                        <ha-icon-button
                                            label="Move Down"
                                            ?disabled=${index === cards.length - 1}
                                            path="M7,9L12,14L17,9H7Z"
                                            @click=${() => this._moveCard(index, 1)}
                                        ></ha-icon-button>
                                        <ha-icon-button
                                             label="Edit Card"
                                            path="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                                            @click=${() => this._editCard(index)}
                                        ></ha-icon-button>
                                        <ha-icon-button
                                            path="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                                            @click=${() => this._removeCard(index)}
                                            style="color: var(--error-color);"
                                        ></ha-icon-button>
                                    </div>
                                </div>
                                ${hasNestedCards ? html`
                                    <div class="nested-cards-container">
                                        ${nestedCards.map((nestedCard, nestedIndex) => {
                                            const nestedDescriptor = this._getCardDescriptor(nestedCard);
                                            return html`
                                                <div class="nested-card-row" data-parent-index=${index} data-nested-index=${nestedIndex}>
                                                    <div class="nested-card-info">
                                                        <span class="nested-card-index">${index + 1}.${nestedIndex + 1}</span>
                                                        <span class="nested-card-type">${nestedDescriptor.typeName}</span>
                                                        ${nestedDescriptor.isPictureElements ? html`<span class="picture-elements-badge">Elements</span>` : ''}
                                                        ${nestedDescriptor.name ? html`<span class="nested-card-name">(${nestedDescriptor.name})</span>` : ''}
                                                    </div>
                                                    <div class="nested-card-actions">
                                                        <ha-icon-button
                                                            label="Move Up"
                                                            ?disabled=${nestedIndex === 0}
                                                            path="M7,15L12,10L17,15H7Z"
                                                            @click=${() => this._moveNestedCard(index, nestedIndex, -1)}
                                                        ></ha-icon-button>
                                                        <ha-icon-button
                                                            label="Move Down"
                                                            ?disabled=${nestedIndex === nestedCards.length - 1}
                                                            path="M7,9L12,14L17,9H7Z"
                                                            @click=${() => this._moveNestedCard(index, nestedIndex, 1)}
                                                        ></ha-icon-button>
                                                        <ha-icon-button
                                                            label="Edit Card"
                                                            path="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                                                            @click=${() => this._editNestedCard(index, nestedIndex)}
                                                        ></ha-icon-button>
                                                        <ha-icon-button
                                                            label="Delete Card"
                                                            path="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                                                            @click=${() => this._removeNestedCard(index, nestedIndex)}
                                                            style="color: var(--error-color);"
                                                        ></ha-icon-button>
                                                    </div>
                                                </div>
                                            `;
                                        })}
                                    </div>
                                ` : ''}
                            `})
                        }
                    </div>
                </div>

                <!-- Card Picker (now outside the cards section with its own separator) -->
                <div id="card-picker-container">
                    <hui-card-picker
                        .hass=${this.hass}
                        .lovelace=${this.lovelace}
                        @config-changed=${this._boundHandleCardPicked}
                        label="Add Card"
                    ></hui-card-picker>
                </div>

                <!-- Version display -->
                <div class="version-display">
                    <div class="version-text">Simple Swipe Card</div>
                    <div class="version-badge">v${CARD_VERSION}</div>
                </div>
            </div>
        `;
    }
}

// ======================================================================
// Registration & Versioning
// ======================================================================

customElements.define('simple-swipe-card-editor', SimpleSwipeCardEditor);
customElements.define('simple-swipe-card', SimpleSwipeCard);

/**
 * Registers the card with Home Assistant
 */
const registerCard = () => {
    if (window.customCards && !window.customCards.some(card => card.type === "simple-swipe-card")) {
        window.customCards.push({
            type: "simple-swipe-card",
            name: "Simple Swipe Card",
            preview: true,
            description: "A swipeable container for multiple cards with touch and mouse gesture support."
        });
    }
};

// Register the card
if (HELPERS) {
    HELPERS.then(() => {
        registerCard();
    }).catch(e => console.error("Error waiting for Card Helpers:", e));
} else if (window.customCards) {
    registerCard();
} else {
    window.addEventListener('load', () => {
        registerCard();
    }, { once: true });
}

// Display version information
console.info(
    `%c SIMPLE-SWIPE-CARD %c v${CARD_VERSION} `,
    "color: white; background: #4caf50; font-weight: 700;",
    "color: #4caf50; background: white; font-weight: 700;"
);
