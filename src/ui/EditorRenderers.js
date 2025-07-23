/**
 * UI rendering functions for Simple Swipe Card Editor
 */

import { html } from "../core/Dependencies.js";
import { CARD_VERSION } from "../utils/Constants.js";
import { evaluateVisibilityConditions } from "../features/VisibilityConditions.js";

/**
 * Renders the information panel at the top of the editor
 * @returns {TemplateResult} The info panel template
 */
export function renderInfoPanel() {
  return html`
    <div class="info-panel">
      <div class="info-icon">
        <ha-icon icon="mdi:information"></ha-icon>
      </div>
      <div class="info-text">
        Add cards using the picker below. Edit and reorder them in the Cards
        section. Use Advanced Options for auto-swipe, reset timers, and loopback
        features.
      </div>
    </div>
  `;
}

/**
 * Renders the view mode selection section
 * @param {Object} config - Current configuration
 * @param {Function} valueChanged - Value change handler
 * @returns {TemplateResult} The view mode template
 */
export function renderViewModeOptions(config, valueChanged) {
  const viewMode = config.view_mode || "single";
  const cardsVisible = config.cards_visible ?? 2.5;

  return html`
    <div class="section">
      <div
        class="section-header-with-controls ${viewMode === "single"
          ? "single-mode"
          : "carousel-mode"}"
      >
        <div class="section-header">View Mode</div>
        <div class="radio-group">
          <label class="radio-option">
            <input
              type="radio"
              name="view-mode"
              value="single"
              .checked=${viewMode === "single"}
              data-option="view_mode"
              @change=${valueChanged}
            />
            <span>Single</span>
          </label>
          <label class="radio-option">
            <input
              type="radio"
              name="view-mode"
              value="carousel"
              .checked=${viewMode === "carousel"}
              data-option="view_mode"
              @change=${valueChanged}
            />
            <span>Carousel</span>
          </label>
        </div>
      </div>

      ${viewMode === "carousel"
        ? html`
            <ha-textfield
              label="Cards Visible"
              .value=${cardsVisible.toFixed(1).replace(/\.0$/, "")}
              data-option="cards_visible"
              type="number"
              min="1.1"
              max="8.0"
              step="0.1"
              lang="en-US"
              @change=${valueChanged}
              @input=${(e) => {
                // Real-time validation feedback
                const value = parseFloat(e.target.value);
                if (value < 1.1 || value > 8.0 || isNaN(value)) {
                  e.target.style.borderColor = "var(--error-color, #f44336)";
                } else {
                  e.target.style.borderColor = "";
                }
              }}
              autoValidate
              required
            ></ha-textfield>
            <div class="help-text">
              Number of cards visible at once (1.1 - 8.0). Values like 2.5 show
              2 full cards + partial third card.
            </div>
          `
        : ""}
    </div>
  `;
}

/**
 * Renders the display options section
 * @param {Object} config - Current configuration
 * @param {Function} valueChanged - Value change handler
 * @returns {TemplateResult} The display options template
 */
export function renderDisplayOptions(config, valueChanged) {
  const showPagination = config.show_pagination !== false;
  const cardSpacing = config.card_spacing ?? 15;
  const swipeDirection = config.swipe_direction || "horizontal";
  const viewMode = config.view_mode || "single";

  return html`
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
        @change=${valueChanged}
        autoValidate
        pattern="[0-9]+"
        required
      ></ha-textfield>
      <div class="help-text">
        Visual gap between cards when swiping (in pixels)
      </div>

      ${viewMode === "single"
        ? html`
            <div class="option-row">
              <div class="option-label">Swipe direction</div>
              <div class="option-control">
                <ha-select
                  .value=${swipeDirection}
                  data-option="swipe_direction"
                  @change=${valueChanged}
                  @closed=${(ev) => ev.stopPropagation()}
                >
                  <ha-list-item .value=${"horizontal"}>
                    Horizontal
                    <ha-icon
                      slot="graphic"
                      class="direction-icon"
                      icon="mdi:gesture-swipe-horizontal"
                    ></ha-icon>
                  </ha-list-item>
                  <ha-list-item .value=${"vertical"}>
                    Vertical
                    <ha-icon
                      slot="graphic"
                      class="direction-icon"
                      icon="mdi:gesture-swipe-vertical"
                    ></ha-icon>
                  </ha-list-item>
                </ha-select>
              </div>
            </div>
            <div class="help-text">The direction to swipe between cards</div>
          `
        : html`
            <!-- Carousel mode: Only horizontal direction supported -->
            <div class="option-info">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span>Carousel mode supports horizontal swiping only</span>
            </div>
          `}

      <div class="option-row pagination-option">
        <div class="option-label">Show pagination dots</div>
        <div class="option-control">
          <ha-switch
            .checked=${showPagination}
            data-option="show_pagination"
            @change=${valueChanged}
          ></ha-switch>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the advanced options collapsible section
 * @param {Object} config - Current configuration
 * @param {Object} collapsibleState - State of collapsible sections
 * @param {Function} valueChanged - Value change handler
 * @param {Function} toggleSection - Section toggle handler
 * @param {Array} cards - Array of cards for validation
 * @param {Function} handleTimeoutChange - Timeout change handler
 * @param {Function} handleTargetChange - Target change handler
 * @param {Object} hass - Home Assistant object
 * @returns {TemplateResult} The advanced options template
 */
export function renderAdvancedOptions(
  config,
  collapsibleState,
  valueChanged,
  toggleSection,
  cards,
  handleTimeoutChange,
  handleTargetChange,
  hass,
) {
  const enableLoopback = config.enable_loopback === true;
  const enableAutoSwipe = config.enable_auto_swipe === true;
  const autoSwipeInterval = config.auto_swipe_interval ?? 2000;
  const enableResetAfter = config.enable_reset_after === true;
  const resetAfterTimeout = config.reset_after_timeout ?? 30000;
  const resetTargetCard = config.reset_target_card ?? 1;
  const stateEntity = config.state_entity || "";
  const viewMode = config.view_mode || "single";

  // Count active and blocked advanced features
  let activeFeatures = 0;
  let blockedFeatures = 0;

  if (enableLoopback) activeFeatures++;

  // Only count these features if in single mode
  if (viewMode === "single") {
    if (enableAutoSwipe) activeFeatures++;
    if (enableResetAfter && !enableAutoSwipe) activeFeatures++; // Only count if not blocked
    if (enableResetAfter && enableAutoSwipe) blockedFeatures++; // Count as blocked when auto-swipe is on
    if (stateEntity) activeFeatures++; // Count state sync as active feature
  }

  // Create separate badges for active and blocked features
  let activeBadge = "";
  let blockedBadge = "";

  if (activeFeatures > 0) {
    activeBadge = `${activeFeatures} active`;
  }

  if (blockedFeatures > 0) {
    blockedBadge = `${blockedFeatures} blocked`;
  }

  return html`
    <div class="collapsible-section">
      <div
        class="section-toggle ${collapsibleState.advanced ? "expanded" : ""}"
        @click=${() => toggleSection("advanced")}
      >
        <ha-icon
          class="section-toggle-icon ${collapsibleState.advanced
            ? "expanded"
            : ""}"
          icon="mdi:chevron-right"
        ></ha-icon>
        <div class="section-toggle-title">Advanced Options</div>
        ${activeBadge
          ? html`<div class="section-toggle-badge">${activeBadge}</div>`
          : ""}
        ${blockedBadge
          ? html`<div class="section-toggle-badge blocked-only">
              ${blockedBadge}
            </div>`
          : ""}
      </div>

      <div
        class="section-content compact-options ${collapsibleState.advanced
          ? "expanded"
          : "collapsed"}"
      >
        ${renderLoopbackOption(enableLoopback, valueChanged)}
        ${viewMode === "single"
          ? html`
              ${renderAutoSwipeOptions(
                enableAutoSwipe,
                autoSwipeInterval,
                valueChanged,
              )}
              ${renderResetAfterOptions(
                enableResetAfter,
                enableAutoSwipe,
                resetAfterTimeout,
                resetTargetCard,
                cards,
                valueChanged,
                handleTimeoutChange,
                handleTargetChange,
              )}
              ${renderStateSynchronizationOptions(
                stateEntity,
                hass,
                valueChanged,
              )}
            `
          : html`
              <!-- Carousel mode: Limited options available -->
              <div class="option-info">
                <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
                <span>Additional features available in Single card mode</span>
              </div>
            `}
      </div>
    </div>
  `;
}

/**
 * Renders the loopback option
 * @param {boolean} enableLoopback - Current loopback setting
 * @param {Function} valueChanged - Value change handler
 * @returns {TemplateResult} The loopback option template
 */
function renderLoopbackOption(enableLoopback, valueChanged) {
  return html`
    <div class="option-row">
      <div class="option-label">Enable loopback mode</div>
      <div class="option-control">
        <ha-switch
          .checked=${enableLoopback}
          data-option="enable_loopback"
          @change=${valueChanged}
        ></ha-switch>
      </div>
    </div>
    <div class="help-text">
      Swipe past the last card to circle back to the first card, and vice versa.
    </div>
  `;
}

/**
 * Renders the auto-swipe options
 * @param {boolean} enableAutoSwipe - Current auto-swipe setting
 * @param {number} autoSwipeInterval - Current interval setting
 * @param {Function} valueChanged - Value change handler
 * @returns {TemplateResult} The auto-swipe options template
 */
function renderAutoSwipeOptions(
  enableAutoSwipe,
  autoSwipeInterval,
  valueChanged,
) {
  return html`
    <div class="option-row">
      <div class="option-label">Enable auto-swipe</div>
      <div class="option-control">
        <ha-switch
          .checked=${enableAutoSwipe}
          data-option="enable_auto_swipe"
          @change=${valueChanged}
        ></ha-switch>
      </div>
    </div>
    <div class="help-text">
      Automatically swipe between slides at a set interval.
    </div>

    ${enableAutoSwipe
      ? html`
          <ha-textfield
            label="Auto-swipe interval (ms)"
            .value=${autoSwipeInterval.toString()}
            data-option="auto_swipe_interval"
            type="number"
            min="500"
            suffix="ms"
            @change=${valueChanged}
            autoValidate
            pattern="[0-9]+"
            required
          ></ha-textfield>
          <div class="help-text">
            Time between automatic swipes (minimum 500ms).
          </div>
        `
      : ""}
  `;
}

/**
 * Renders the reset-after options
 * @param {boolean} enableResetAfter - Current reset-after setting
 * @param {boolean} enableAutoSwipe - Current auto-swipe setting
 * @param {number} resetAfterTimeout - Current timeout setting
 * @param {number} resetTargetCard - Current target card setting
 * @param {Array} cards - Array of cards
 * @param {Function} valueChanged - Value change handler
 * @param {Function} handleTimeoutChange - Timeout change handler
 * @param {Function} handleTargetChange - Target change handler
 * @returns {TemplateResult} The reset-after options template
 */
function renderResetAfterOptions(
  enableResetAfter,
  enableAutoSwipe,
  resetAfterTimeout,
  resetTargetCard,
  cards,
  valueChanged,
  handleTimeoutChange,
  handleTargetChange,
) {
  return html`
    <div class="option-row">
      <div class="option-label">Enable reset after timeout</div>
      <div class="option-control">
        <ha-switch
          .checked=${enableResetAfter}
          data-option="enable_reset_after"
          @change=${valueChanged}
          ?disabled=${enableAutoSwipe}
        ></ha-switch>
      </div>
    </div>
    <div class="help-text">
      ${enableAutoSwipe
        ? "Reset after timeout is disabled when auto-swipe is enabled."
        : "Return to target card after inactivity. Timer starts after manual interactions."}
    </div>

    ${enableResetAfter && !enableAutoSwipe
      ? html`
          <ha-textfield
            label="Reset timeout (seconds)"
            .value=${Math.round(resetAfterTimeout / 1000).toString()}
            type="number"
            min="5"
            max="3600"
            suffix="sec"
            @change=${handleTimeoutChange}
            autoValidate
            pattern="[0-9]+"
            required
          ></ha-textfield>
          <div class="help-text">
            Time of inactivity before resetting (5 seconds to 1 hour).
          </div>

          <ha-textfield
            label="Target card (1-based)"
            .value=${resetTargetCard.toString()}
            type="number"
            min="1"
            max=${(Math.max(0, cards.length - 1) + 1).toString()}
            @change=${handleTargetChange}
            ?disabled=${cards.length === 0}
            autoValidate
            pattern="[0-9]+"
            required
          ></ha-textfield>
          <div class="help-text">
            Which card to reset to (1 = first card, 2 = second card, etc.).
            ${cards.length === 0
              ? "Add cards first to set a target."
              : `Current range: 1-${cards.length}`}
          </div>
        `
      : ""}
  `;
}

/**
 * Renders the state synchronization options
 * @param {string} stateEntity - Current state entity setting
 * @param {Object} hass - Home Assistant object
 * @param {Function} valueChanged - Value change handler
 * @returns {TemplateResult} The state synchronization options template
 */
function renderStateSynchronizationOptions(stateEntity, hass, valueChanged) {
  return html`
    <div class="option-row">
      <div class="option-label">State synchronization entity</div>
      <div class="option-control">
        <ha-entity-picker
          .hass=${hass}
          .value=${stateEntity || ""}
          .includeDomains=${["input_select", "input_number"]}
          data-option="state_entity"
          @value-changed=${valueChanged}
          allow-custom-entity
        ></ha-entity-picker>
      </div>
    </div>
    <div class="help-text entity-picker-help">
      Sync card position with an input_select or input_number entity.
      input_select options are mapped by position to cards. input_number uses
      1-based indexing (1 = first card).
    </div>
  `;
}

/**
 * Renders the cards management section
 * @param {Array} cards - Array of cards
 * @param {Object} hass - Home Assistant object
 * @param {Function} moveCard - Move card handler
 * @param {Function} editCard - Edit card handler
 * @param {Function} removeCard - Remove card handler
 * @param {Function} getCardDescriptor - Get card descriptor function
 * @param {Function} hasNestedCards - Check nested cards function
 * @param {Function} getNestedCards - Get nested cards function
 * @param {Function} hasVisibilityConditions - Check visibility conditions function
 * @param {Function} moveNestedCard - Move nested card handler
 * @param {Function} editNestedCard - Edit nested card handler
 * @param {Function} removeNestedCard - Remove nested card handler
 * @returns {TemplateResult} The cards management template
 */
export function renderCardsSection(
  cards,
  hass,
  moveCard,
  editCard,
  removeCard,
  getCardDescriptor,
  hasNestedCards,
  getNestedCards,
  hasVisibilityConditions,
  moveNestedCard,
  editNestedCard,
  removeNestedCard,
) {
  return html`
    <div class="section cards-section">
      <div class="section-header">Cards</div>

      <div class="card-list">
        ${cards.length === 0
          ? html`<div class="no-cards">
              No cards added yet. Select a card type below to add your first
              card.
            </div>`
          : cards.map((card, index) =>
              renderCardRow(
                card,
                index,
                cards.length,
                hass,
                moveCard,
                editCard,
                removeCard,
                getCardDescriptor,
                hasNestedCards,
                getNestedCards,
                hasVisibilityConditions,
                moveNestedCard,
                editNestedCard,
                removeNestedCard,
              ),
            )}
      </div>
    </div>
  `;
}

/**
 * Renders an individual card row
 * @param {Object} card - Card configuration
 * @param {number} index - Card index
 * @param {number} totalCards - Total number of cards
 * @param {Object} hass - Home Assistant object
 * @param {Function} moveCard - Move card handler
 * @param {Function} editCard - Edit card handler
 * @param {Function} removeCard - Remove card handler
 * @param {Function} getCardDescriptor - Get card descriptor function
 * @param {Function} hasNestedCards - Check nested cards function
 * @param {Function} getNestedCards - Get nested cards function
 * @param {Function} hasVisibilityConditions - Check visibility conditions function
 * @param {Function} moveNestedCard - Move nested card handler
 * @param {Function} editNestedCard - Edit nested card handler
 * @param {Function} removeNestedCard - Remove nested card handler
 * @returns {TemplateResult} The card row template
 */
function renderCardRow(
  card,
  index,
  totalCards,
  hass,
  moveCard,
  editCard,
  removeCard,
  getCardDescriptor,
  hasNestedCards,
  getNestedCards,
  hasVisibilityConditions,
  moveNestedCard,
  editNestedCard,
  removeNestedCard,
) {
  const descriptor = getCardDescriptor(card);
  const hasNested = hasNestedCards(card);
  const nestedCards = hasNested ? getNestedCards(card) : [];
  const hasVisibility = hasVisibilityConditions(card);
  const isCurrentlyVisible = hass
    ? evaluateVisibilityConditions(card.visibility, hass)
    : true;

  return html`
    <div
      class="card-row ${!isCurrentlyVisible ? "hidden-card" : ""}"
      data-index=${index}
    >
      <div class="card-info">
        <span class="card-index">${index + 1}</span>
        <span class="card-type">${descriptor.typeName}</span>
        ${descriptor.isPictureElements
          ? html`<span class="picture-elements-badge">Elements</span>`
          : ""}
        ${hasVisibility && isCurrentlyVisible
          ? html`<span class="visibility-badge">Conditional</span>`
          : ""}
        ${descriptor.name
          ? html`<span class="card-name">(${descriptor.name})</span>`
          : ""}
      </div>
      <div class="card-actions">
        ${hasVisibility && !isCurrentlyVisible
          ? html`<ha-icon class="hidden-icon" icon="mdi:eye-off"></ha-icon>`
          : ""}
        <ha-icon-button
          label="Move Up"
          ?disabled=${index === 0}
          path="M7,15L12,10L17,15H7Z"
          @click=${() => moveCard(index, -1)}
        ></ha-icon-button>
        <ha-icon-button
          label="Move Down"
          ?disabled=${index === totalCards - 1}
          path="M7,9L12,14L17,9H7Z"
          @click=${() => moveCard(index, 1)}
        ></ha-icon-button>
        <ha-icon-button
          label="Edit Card"
          path="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
          @click=${() => editCard(index)}
        ></ha-icon-button>
        <ha-icon-button
          path="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
          @click=${() => removeCard(index)}
          style="color: var(--error-color);"
        ></ha-icon-button>
      </div>
    </div>
    ${hasNested
      ? renderNestedCards(
          nestedCards,
          index,
          getCardDescriptor,
          moveNestedCard,
          editNestedCard,
          removeNestedCard,
        )
      : ""}
  `;
}

/**
 * Renders nested cards container
 * @param {Array} nestedCards - Array of nested cards
 * @param {number} parentIndex - Parent card index
 * @param {Function} getCardDescriptor - Get card descriptor function
 * @param {Function} moveNestedCard - Move nested card handler
 * @param {Function} editNestedCard - Edit nested card handler
 * @param {Function} removeNestedCard - Remove nested card handler
 * @returns {TemplateResult} The nested cards template
 */
function renderNestedCards(
  nestedCards,
  parentIndex,
  getCardDescriptor,
  moveNestedCard,
  editNestedCard,
  removeNestedCard,
) {
  return html`
    <div class="nested-cards-container">
      ${nestedCards.map((nestedCard, nestedIndex) => {
        const nestedDescriptor = getCardDescriptor(nestedCard);
        return html`
          <div
            class="nested-card-row"
            data-parent-index=${parentIndex}
            data-nested-index=${nestedIndex}
          >
            <div class="nested-card-info">
              <span class="nested-card-index"
                >${parentIndex + 1}.${nestedIndex + 1}</span
              >
              <span class="nested-card-type">${nestedDescriptor.typeName}</span>
              ${nestedDescriptor.isPictureElements
                ? html`<span class="picture-elements-badge">Elements</span>`
                : ""}
              ${nestedDescriptor.name
                ? html`<span class="nested-card-name"
                    >(${nestedDescriptor.name})</span
                  >`
                : ""}
            </div>
            <div class="nested-card-actions">
              <ha-icon-button
                label="Move Up"
                ?disabled=${nestedIndex === 0}
                path="M7,15L12,10L17,15H7Z"
                @click=${() => moveNestedCard(parentIndex, nestedIndex, -1)}
              ></ha-icon-button>
              <ha-icon-button
                label="Move Down"
                ?disabled=${nestedIndex === nestedCards.length - 1}
                path="M7,9L12,14L17,9H7Z"
                @click=${() => moveNestedCard(parentIndex, nestedIndex, 1)}
              ></ha-icon-button>
              <ha-icon-button
                label="Edit Card"
                path="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                @click=${() => editNestedCard(parentIndex, nestedIndex)}
              ></ha-icon-button>
              <ha-icon-button
                label="Delete Card"
                path="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                @click=${() => removeNestedCard(parentIndex, nestedIndex)}
                style="color: var(--error-color);"
              ></ha-icon-button>
            </div>
          </div>
        `;
      })}
    </div>
  `;
}

/**
 * Renders the card picker section
 * @param {Object} hass - Home Assistant object
 * @param {Object} lovelace - Lovelace object
 * @param {Function} handleCardPicked - Card picked handler
 * @returns {TemplateResult} The card picker template
 */
export function renderCardPicker(hass, lovelace, handleCardPicked) {
  return html`
    <div id="card-picker-container">
      <hui-card-picker
        .hass=${hass}
        .lovelace=${lovelace}
        @config-changed=${handleCardPicked}
        label="Add Card"
      ></hui-card-picker>
    </div>
  `;
}

/**
 * Renders the version display section
 * @returns {TemplateResult} The version display template
 */
export function renderVersionDisplay() {
  return html`
    <div class="version-display">
      <div class="version-text">Simple Swipe Card</div>
      <div class="version-badge">v${CARD_VERSION}</div>
    </div>
  `;
}
