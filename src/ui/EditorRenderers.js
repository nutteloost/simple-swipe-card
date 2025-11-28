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
            ${config.cards_visible !== undefined
              ? html`
                  <div class="option-info">
                    <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
                    <span
                      >Currently using legacy mode: cards_visible:
                      ${config.cards_visible}</span
                    >
                  </div>
                `
              : ""}

            <ha-textfield
              label="Minimum Card Width (px)"
              .value=${(config.card_min_width || 200).toString()}
              data-option="card_min_width"
              type="number"
              min="50"
              max="500"
              step="10"
              suffix="px"
              @change=${valueChanged}
              @keydown=${(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  e.target.blur();
                }
              }}
              @input=${(e) => {
                const value = parseFloat(e.target.value);
                if (value < 50 || value > 500 || isNaN(value)) {
                  e.target.style.borderColor = "var(--error-color, #f44336)";
                } else {
                  e.target.style.borderColor = "";
                }
              }}
              autoValidate
              required
            ></ha-textfield>
            <div class="help-text">
              ${config.cards_visible !== undefined
                ? "Changing this value will switch to responsive mode and remove the cards_visible setting"
                : "Minimum width per card in pixels. Number of visible cards adjusts automatically based on screen size."}
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
  const swipeBehavior = config.swipe_behavior || "single";
  const viewMode = config.view_mode || "single";
  const autoHeight = config.auto_height === true;
  const enableBackdropFilter = config.enable_backdrop_filter === true;

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
      <div class="help-text">Visual gap between cards</div>

      ${viewMode === "single"
        ? html`
            <div class="option-row">
              <div class="option-left">
                <div class="option-label">Swipe direction</div>
                <div class="option-help">
                  The direction to swipe between cards
                </div>
              </div>
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
          `
        : html`
            <!-- Carousel mode: Only horizontal direction supported -->
            <div class="option-info">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span>Carousel mode supports horizontal swiping only</span>
            </div>
          `}
      ${viewMode === "single" &&
      swipeDirection === "vertical" &&
      !config.grid_options
        ? html`
            <div class="option-info warning">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span>
                Vertical swiping without grid_options configured will use a
                default height of 250px. For better control, configure
                grid_options in the Layout tab or add it to your YAML.
              </span>
            </div>
          `
        : ""}

      <!-- AUTO HEIGHT TOGGLE - Always visible with smart disabling -->
      <div class="option-row">
        <div class="option-left">
          <div class="option-label">Auto Height</div>
          <div class="option-help">
            ${viewMode === "single" &&
            swipeDirection === "horizontal" &&
            config.loop_mode !== "infinite"
              ? "Automatically adjust card height to match each card's content"
              : "Not available in current mode"}
          </div>
        </div>
        <div class="option-control">
          <ha-switch
            .checked=${autoHeight}
            data-option="auto_height"
            @change=${valueChanged}
            .disabled=${viewMode !== "single" ||
            swipeDirection !== "horizontal" ||
            config.loop_mode === "infinite"}
          ></ha-switch>
        </div>
      </div>

      <!-- Warning messages when auto_height incompatible -->
      ${autoHeight && viewMode === "carousel"
        ? html`
            <div class="option-info warning">
              <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
              <span>
                Auto height is not compatible with carousel mode and has been
                disabled.
              </span>
            </div>
          `
        : ""}
      ${autoHeight && swipeDirection === "vertical"
        ? html`
            <div class="option-info warning">
              <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
              <span>
                Auto height is not compatible with vertical swiping and has been
                disabled.
              </span>
            </div>
          `
        : ""}
      ${autoHeight && config.loop_mode === "infinite"
        ? html`
            <div class="option-info warning">
              <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
              <span>
                Auto height is not compatible with infinite loop mode and has
                been disabled.
              </span>
            </div>
          `
        : ""}
      ${autoHeight && config.grid_options?.rows !== undefined
        ? html`
            <div class="option-info warning" style="display: block;">
              <div
                style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;"
              >
                <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
                <strong>Auto Height is blocked</strong>
              </div>
              <div style="font-size: 12px; line-height: 1.5;">
                Your configuration has
                <code>grid_options: rows: ${config.grid_options.rows}</code>
                which prevents auto height from working. <br /><br />
                Go to the Layout tab and remove
                <strong><code>rows: ${config.grid_options.rows}</code></strong>
                (or remove it from YAML). Keep only <code>columns</code> in
                grid_options.
              </div>
            </div>
          `
        : ""}

      <!-- Only show swipe behavior when infinite loop mode is selected -->
      ${config.loop_mode === "infinite"
        ? html`
            <div class="option-row">
              <div class="option-left">
                <div class="option-label">Swipe behavior</div>
                <div class="option-help">How many cards to swipe at once</div>
              </div>
              <div class="option-control">
                <ha-select
                  .value=${swipeBehavior}
                  data-option="swipe_behavior"
                  @change=${valueChanged}
                  @closed=${(ev) => ev.stopPropagation()}
                >
                  <ha-list-item .value=${"single"}>
                    Single card
                    <ha-icon
                      slot="graphic"
                      class="direction-icon"
                      icon="mdi:numeric-1-circle"
                    ></ha-icon>
                  </ha-list-item>
                  <ha-list-item .value=${"free"}>
                    Free swipe
                    <ha-icon
                      slot="graphic"
                      class="direction-icon"
                      icon="mdi:gesture-swipe"
                    ></ha-icon>
                  </ha-list-item>
                </ha-select>
              </div>
            </div>
          `
        : html`
            <!-- Show info when not in infinite mode -->
            <div class="option-info">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span
                >Free swipe behavior is only available with infinite loop
                mode</span
              >
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

      ${showPagination
        ? html`
            <div class="option-row">
              <div class="option-left">
                <div class="option-help">
                  Hide pagination dots after inactivity
                </div>
              </div>
              <div class="option-control">
                <div class="auto-hide-control">
                  <div class="auto-hide-value">
                    ${(config.auto_hide_pagination || 0) === 0
                      ? "Off"
                      : `${(config.auto_hide_pagination / 1000).toFixed(1)}s`}
                  </div>
                  <ha-slider
                    min="0"
                    max="30"
                    step="0.5"
                    .value=${(config.auto_hide_pagination || 0) / 1000}
                    data-option="auto_hide_pagination"
                    @change=${valueChanged}
                  ></ha-slider>
                </div>
              </div>
            </div>
            <div class="info-text">
              Pagination dots will automatically hide after the specified time
              of inactivity. Set to 0 to disable auto-hide.
            </div>
          `
        : ""}
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
  const loopMode = config.loop_mode || "none";
  const enableAutoSwipe = config.enable_auto_swipe === true;
  const autoSwipeInterval = config.auto_swipe_interval ?? 2000;
  const enableResetAfter = config.enable_reset_after === true;
  const resetAfterTimeout = config.reset_after_timeout ?? 30000;
  const resetTargetCard = config.reset_target_card ?? 1;
  const stateEntity = config.state_entity || "";
  const enableBackdropFilter = config.enable_backdrop_filter === true;

  // Count active and blocked advanced features (now works for both modes)
  let activeFeatures = 0;
  let blockedFeatures = 0;

  if (loopMode !== "none") activeFeatures++;

  // Count features for both single and carousel modes
  if (enableAutoSwipe) activeFeatures++;
  if (enableResetAfter && !enableAutoSwipe) activeFeatures++; // Only count if not blocked
  if (enableResetAfter && enableAutoSwipe) blockedFeatures++; // Count as blocked when auto-swipe is on
  if (stateEntity) activeFeatures++; // Count state sync as active feature
  if (enableBackdropFilter) activeFeatures++; // Count backdrop filter as active feature

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
        ${renderLoopModeOption(loopMode, valueChanged)}
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
        ${renderStateSynchronizationOptions(stateEntity, hass, valueChanged)}
        ${renderBackdropFilterOption(enableBackdropFilter, valueChanged)}
      </div>
    </div>
  `;
}

/**
 * Renders the loop mode options
 * @param {string} loopMode - Current loop mode setting
 * @param {Function} valueChanged - Value change handler
 * @returns {TemplateResult} The loop mode options template
 */
function renderLoopModeOption(loopMode, valueChanged) {
  return html`
    <div class="option-row">
      <div class="option-left">
        <div class="option-label">Loop behavior</div>
        <div class="option-help">
          ${loopMode === "none"
            ? "Stop at first/last card (no looping)"
            : loopMode === "loopback"
              ? "Jump back to first/last card"
              : "Continuous loop navigation"}
        </div>
      </div>
      <div class="option-control">
        <ha-select
          .value=${loopMode}
          data-option="loop_mode"
          @change=${valueChanged}
          @closed=${(ev) => ev.stopPropagation()}
        >
          <ha-list-item .value=${"none"}> No looping </ha-list-item>
          <ha-list-item .value=${"loopback"}> Jump to start/end </ha-list-item>
          <ha-list-item .value=${"infinite"}> Continuous loop </ha-list-item>
        </ha-select>
      </div>
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
    <div class="help-text">Automatically cycle through cards</div>

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
          <div class="help-text">Time between swipes (min. 500ms).</div>
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
  // Check if reset_target_card is a template
  const isTemplate =
    typeof resetTargetCard === "string" &&
    (resetTargetCard.includes("{{") || resetTargetCard.includes("{%"));

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
        ? "Disabled when auto-swipe is on"
        : "Auto-return after inactivity"}
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
            Time of inactivity before resetting (5s to 1h)
          </div>

          <ha-textfield
            label="Target card"
            .value=${resetTargetCard.toString()}
            type=${isTemplate ? "text" : "number"}
            min=${isTemplate ? undefined : "1"}
            max=${isTemplate
              ? undefined
              : (Math.max(0, cards.length - 1) + 1).toString()}
            @change=${handleTargetChange}
            ?disabled=${cards.length === 0}
            autoValidate
            ?required=${!isTemplate}
          ></ha-textfield>
          <div class="help-text">
            ${isTemplate
              ? html`Template: <code>${resetTargetCard}</code>`
              : cards.length === 0
                ? "Add cards first to set a target."
                : `Card number (1-${cards.length}) or template like {{ states('sensor.day') }}`}
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
  // Get all input_select and input_number entities
  const inputEntities = Object.keys(hass.states || {})
    .filter(
      (entityId) =>
        entityId.startsWith("input_select.") ||
        entityId.startsWith("input_number."),
    )
    .sort()
    .map((entityId) => ({
      entityId,
      friendlyName:
        hass.states[entityId].attributes.friendly_name ||
        entityId
          .replace(/^(input_select\.|input_number\.)/, "")
          .replace(/_/g, " "),
    }));

  return html`
    <div class="option-row">
      <div class="option-left">
        <div class="option-label">State synchronization entity</div>
        <div class="option-help">
          Two-way sync with input_select/input_number entity
        </div>
      </div>
      <div class="option-control">
        <ha-select
          .value=${stateEntity || ""}
          data-option="state_entity"
          @change=${valueChanged}
          @closed=${(ev) => ev.stopPropagation()}
        >
          <ha-list-item .value=${""}>
            <span style="color: var(--secondary-text-color);"
              >Select an entity</span
            >
          </ha-list-item>
          ${inputEntities.map(
            (entity) => html`
              <ha-list-item .value=${entity.entityId}>
                ${entity.friendlyName}
                <span
                  style="color: var(--secondary-text-color); font-size: 0.9em; margin-left: 8px;"
                >
                  (${entity.entityId})
                </span>
              </ha-list-item>
            `,
          )}
        </ha-select>
      </div>
    </div>
  `;
}

/**
 * Renders the backdrop filter support option
 * @param {boolean} enableBackdropFilter - Current backdrop filter setting
 * @param {Function} valueChanged - Value change handler
 * @returns {TemplateResult} The backdrop filter option template
 */
function renderBackdropFilterOption(enableBackdropFilter, valueChanged) {
  return html`
    <div class="option-row">
      <div class="option-left">
        <div class="option-label">Enable Backdrop Filter (Advanced)</div>
        <div class="option-help">
          For card-mod users: Allow CSS backdrop-filter blur effects
        </div>
      </div>
      <div class="option-control">
        <ha-switch
          .checked=${enableBackdropFilter}
          data-option="enable_backdrop_filter"
          @change=${valueChanged}
        ></ha-switch>
      </div>
    </div>

    <!-- Info/Warning when backdrop filter is enabled/disabled -->
    ${enableBackdropFilter
      ? html`
          <div class="option-info warning">
            <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
            <span>
              Trade-off: Disables clip-path, which may prevent dropdown menus
              from overflowing card boundaries. Only enable if you're using
              <code>backdrop-filter: blur()</code> in card-mod CSS.
            </span>
          </div>
        `
      : html`
          <div
            class="option-help"
            style="margin-top: -4px; margin-bottom: 12px;"
          >
            When to enable: Only if you're using card-mod with
            <code>backdrop-filter: blur()</code> CSS
          </div>
        `}
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
 * @returns {HTMLElement} The version display element
 */
export function renderVersionDisplay() {
  // Create the main container
  const versionDisplay = document.createElement("div");
  versionDisplay.className = "version-display";

  // Create the text part
  const versionText = document.createElement("div");
  versionText.className = "version-text";
  versionText.textContent = "Simple Swipe Card";

  // Create the badges container
  const versionBadges = document.createElement("div");
  versionBadges.className = "version-badges";

  // Create the version badge
  const versionBadge = document.createElement("div");
  versionBadge.className = "version-badge";
  versionBadge.textContent = `v${CARD_VERSION}`;

  // Create the GitHub badge link
  const githubBadge = document.createElement("a");
  githubBadge.href = "https://github.com/nutteloost/simple-swipe-card";
  githubBadge.target = "_blank";
  githubBadge.rel = "noopener noreferrer";
  githubBadge.className = "github-badge";

  // Create the GitHub icon
  const githubIcon = document.createElement("ha-icon");
  githubIcon.icon = "mdi:github";

  // Create the GitHub text
  const githubText = document.createElement("span");
  githubText.textContent = "GitHub";

  // Assemble the GitHub badge
  githubBadge.appendChild(githubIcon);
  githubBadge.appendChild(githubText);

  // Assemble the badges container
  versionBadges.appendChild(versionBadge);
  versionBadges.appendChild(githubBadge);

  // Assemble the main container
  versionDisplay.appendChild(versionText);
  versionDisplay.appendChild(versionBadges);

  return versionDisplay;
}
