/**
 * Template evaluation functionality for Simple Swipe Card
 * Self-contained Jinja2-like template rendering for Home Assistant
 */

import { logDebug } from "../utils/Debug.js";

/**
 * Template evaluator manager class
 * Provides lightweight Jinja2-like template evaluation for common HA patterns
 */
export class TemplateEvaluator {
  constructor(cardInstance) {
    this.card = cardInstance;

    // Track which config options contain templates
    this._templateOptions = new Set();

    // Original config values (before template evaluation)
    this._originalConfigValues = {};

    // List of config options that support templates
    this._supportedTemplateOptions = [
      "reset_target_card",
      "auto_swipe_interval",
      "reset_after_timeout",
    ];
  }

  /**
   * Initialize the template evaluator
   * @returns {Promise<boolean>} True if templates are supported
   */
  async initialize() {
    logDebug("TEMPLATE", "Template evaluator initialized (built-in)");
    return true;
  }

  /**
   * Check if a string contains a template
   * @param {*} value - Value to check
   * @returns {boolean} True if value contains a template
   */
  isTemplate(value) {
    if (typeof value !== "string") return false;

    // Check for Jinja2/Nunjucks template syntax
    return (
      (value.includes("{{") && value.includes("}}")) ||
      (value.includes("{%") && value.includes("%}"))
    );
  }

  /**
   * Check if templates are available
   * @returns {boolean} True (always available with built-in evaluator)
   */
  get isAvailable() {
    return true;
  }

  /**
   * Scan config for template values and store originals
   * @param {Object} config - Card configuration
   */
  scanConfig(config) {
    this._templateOptions.clear();
    this._originalConfigValues = {};

    for (const option of this._supportedTemplateOptions) {
      const value = config[option];
      if (this.isTemplate(value)) {
        this._templateOptions.add(option);
        this._originalConfigValues[option] = value;
        logDebug("TEMPLATE", `Found template in ${option}:`, value);
      }
    }

    if (this._templateOptions.size > 0) {
      logDebug(
        "TEMPLATE",
        `Config contains ${this._templateOptions.size} template option(s)`,
      );
    }
  }

  /**
   * Check if config has any template values
   * @returns {boolean} True if config contains templates
   */
  hasTemplates() {
    return this._templateOptions.size > 0;
  }

  /**
   * Get the list of template options in the current config
   * @returns {Array<string>} Array of option names that contain templates
   */
  getTemplateOptions() {
    return Array.from(this._templateOptions);
  }

  /**
   * Evaluate a single template value
   * @param {string} template - Template string to evaluate
   * @param {Object} hass - Home Assistant object
   * @returns {*} Evaluated value or original template on error
   */
  evaluateTemplate(template, hass) {
    if (!hass) {
      logDebug("TEMPLATE", "Cannot evaluate template - no hass object");
      return template;
    }

    if (!this.isTemplate(template)) {
      return template;
    }

    try {
      // Extract the expression from {{ ... }}
      const match = template.match(/\{\{\s*(.+?)\s*\}\}/);
      if (!match) {
        return template;
      }

      const expression = match[1].trim();
      const result = this._evaluateExpression(expression, hass);

      logDebug("TEMPLATE", `Evaluated "${template}" => "${result}"`);
      return result;
    } catch (error) {
      logDebug(
        "TEMPLATE",
        `Error evaluating template "${template}":`,
        error.message,
      );
      return template; // Return original on error
    }
  }

  /**
   * Evaluate a template expression
   * @param {string} expression - The expression inside {{ }}
   * @param {Object} hass - Home Assistant object
   * @returns {*} Evaluated result
   * @private
   */
  _evaluateExpression(expression, hass) {
    // Handle filters (pipe character)
    const parts = expression.split("|").map((p) => p.trim());
    let value = this._evaluateBaseExpression(parts[0], hass);

    // Apply filters
    for (let i = 1; i < parts.length; i++) {
      value = this._applyFilter(value, parts[i], hass);
    }

    return value;
  }

  /**
   * Evaluate the base expression (before filters)
   * @param {string} expression - Base expression
   * @param {Object} hass - Home Assistant object
   * @returns {*} Evaluated result
   * @private
   */
  _evaluateBaseExpression(expression, hass) {
    // Handle now().weekday() - returns 0-6 (Monday = 0)
    if (expression.includes("now()")) {
      return this._evaluateNowExpression(expression);
    }

    // Handle states('entity_id')
    const statesMatch = expression.match(/states\s*\(\s*['"]([^'"]+)['"]\s*\)/);
    if (statesMatch) {
      const entityId = statesMatch[1];
      const state = hass.states[entityId];
      if (state) {
        return state.state;
      }
      logDebug("TEMPLATE", `Entity not found: ${entityId}`);
      return "unknown";
    }

    // Handle state_attr('entity_id', 'attribute')
    const attrMatch = expression.match(
      /state_attr\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/,
    );
    if (attrMatch) {
      const entityId = attrMatch[1];
      const attribute = attrMatch[2];
      const state = hass.states[entityId];
      if (state && state.attributes) {
        return state.attributes[attribute];
      }
      return undefined;
    }

    // Handle is_state('entity_id', 'state')
    const isStateMatch = expression.match(
      /is_state\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/,
    );
    if (isStateMatch) {
      const entityId = isStateMatch[1];
      const expectedState = isStateMatch[2];
      const state = hass.states[entityId];
      return state && state.state === expectedState;
    }

    // Handle simple arithmetic with numbers
    if (/^[\d\s+\-*/().]+$/.test(expression)) {
      try {
        // Safe eval for simple math
        return this._safeEvalMath(expression);
      } catch {
        return expression;
      }
    }

    // Handle simple numbers
    if (/^\d+$/.test(expression)) {
      return parseInt(expression, 10);
    }

    // Return as-is if we can't parse it
    return expression;
  }

  /**
   * Evaluate now() expressions
   * @param {string} expression - Expression containing now()
   * @returns {*} Evaluated result
   * @private
   */
  _evaluateNowExpression(expression) {
    const now = new Date();

    // now().weekday() - Python weekday (Monday = 0, Sunday = 6)
    if (expression.includes(".weekday()")) {
      // JavaScript: Sunday = 0, Monday = 1, ..., Saturday = 6
      // Python: Monday = 0, Tuesday = 1, ..., Sunday = 6
      const jsDay = now.getDay();
      const pythonDay = jsDay === 0 ? 6 : jsDay - 1;

      // Check for arithmetic after weekday()
      const arithmeticMatch = expression.match(
        /\.weekday\(\)\s*([+\-*/])\s*(\d+)/,
      );
      if (arithmeticMatch) {
        const operator = arithmeticMatch[1];
        const operand = parseInt(arithmeticMatch[2], 10);
        return this._applyArithmetic(pythonDay, operator, operand);
      }

      return pythonDay;
    }

    // now().isoweekday() - Python isoweekday (Monday = 1, Sunday = 7)
    if (expression.includes(".isoweekday()")) {
      const jsDay = now.getDay();
      const isoDay = jsDay === 0 ? 7 : jsDay;

      const arithmeticMatch = expression.match(
        /\.isoweekday\(\)\s*([+\-*/])\s*(\d+)/,
      );
      if (arithmeticMatch) {
        const operator = arithmeticMatch[1];
        const operand = parseInt(arithmeticMatch[2], 10);
        return this._applyArithmetic(isoDay, operator, operand);
      }

      return isoDay;
    }

    // now().day - day of month
    if (expression.includes(".day")) {
      return now.getDate();
    }

    // now().month - month (1-12)
    if (expression.includes(".month")) {
      return now.getMonth() + 1;
    }

    // now().year
    if (expression.includes(".year")) {
      return now.getFullYear();
    }

    // now().hour
    if (expression.includes(".hour")) {
      return now.getHours();
    }

    // now().minute
    if (expression.includes(".minute")) {
      return now.getMinutes();
    }

    // Default: return timestamp
    return now.getTime();
  }

  /**
   * Apply arithmetic operation
   * @param {number} value - Base value
   * @param {string} operator - Operator (+, -, *, /)
   * @param {number} operand - Value to apply
   * @returns {number} Result
   * @private
   */
  _applyArithmetic(value, operator, operand) {
    switch (operator) {
      case "+":
        return value + operand;
      case "-":
        return value - operand;
      case "*":
        return value * operand;
      case "/":
        return operand !== 0 ? value / operand : value;
      default:
        return value;
    }
  }

  /**
   * Safely evaluate simple math expressions
   * @param {string} expression - Math expression
   * @returns {number} Result
   * @private
   */
  _safeEvalMath(expression) {
    // Only allow numbers and basic operators
    const sanitized = expression.replace(/[^0-9+\-*/().]/g, "");
    if (sanitized !== expression.replace(/\s/g, "")) {
      throw new Error("Invalid characters in expression");
    }
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${sanitized})`)();
  }

  /**
   * Apply a filter to a value
   * @param {*} value - Value to filter
   * @param {string} filter - Filter expression
   * @param {Object} hass - Home Assistant object
   * @returns {*} Filtered value
   * @private
   */
  _applyFilter(value, filter, hass) {
    // int filter
    if (filter === "int" || filter.startsWith("int(")) {
      const parsed = parseInt(value, 10);
      // Handle fallback: int(0) means return 0 if parsing fails
      if (isNaN(parsed)) {
        const fallbackMatch = filter.match(/int\s*\(\s*(\d+)\s*\)/);
        return fallbackMatch ? parseInt(fallbackMatch[1], 10) : 0;
      }
      return parsed;
    }

    // float filter
    if (filter === "float" || filter.startsWith("float(")) {
      const parsed = parseFloat(value);
      if (isNaN(parsed)) {
        const fallbackMatch = filter.match(/float\s*\(\s*([\d.]+)\s*\)/);
        return fallbackMatch ? parseFloat(fallbackMatch[1]) : 0.0;
      }
      return parsed;
    }

    // round filter
    const roundMatch = filter.match(/round\s*\(\s*(\d+)\s*\)/);
    if (roundMatch || filter === "round") {
      const precision = roundMatch ? parseInt(roundMatch[1], 10) : 0;
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        return Number(numValue.toFixed(precision));
      }
      return value;
    }

    // abs filter
    if (filter === "abs") {
      const numValue = parseFloat(value);
      return isNaN(numValue) ? value : Math.abs(numValue);
    }

    // default filter
    const defaultMatch = filter.match(
      /default\s*\(\s*['"]?([^'")\s]+)['"]?\s*\)/,
    );
    if (defaultMatch) {
      return value === undefined || value === null || value === ""
        ? defaultMatch[1]
        : value;
    }

    // string filter
    if (filter === "string" || filter === "str") {
      return String(value);
    }

    // Unknown filter - return value as-is
    logDebug("TEMPLATE", `Unknown filter: ${filter}`);
    return value;
  }

  /**
   * Get the current evaluated value for an option
   * @param {string} option - Config option name
   * @param {Object} hass - Home Assistant object
   * @returns {*} Evaluated value or undefined
   */
  getEvaluatedValue(option, hass) {
    if (!this._templateOptions.has(option)) {
      return undefined;
    }

    const originalValue = this._originalConfigValues[option];
    if (!originalValue) {
      return undefined;
    }

    const evaluated = this.evaluateTemplate(originalValue, hass);
    return this._convertValue(option, evaluated);
  }

  /**
   * Convert evaluated template value to appropriate type
   * @param {string} option - Config option name
   * @param {*} value - Evaluated value
   * @returns {*} Converted value or null if invalid
   * @private
   */
  _convertValue(option, value) {
    // Numeric options
    const numericOptions = [
      "reset_target_card",
      "auto_swipe_interval",
      "reset_after_timeout",
    ];

    if (numericOptions.includes(option)) {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue)) {
        logDebug(
          "TEMPLATE",
          `Warning: ${option} template evaluated to non-numeric value: ${value}`,
        );
        return null;
      }

      // Apply option-specific constraints
      switch (option) {
        case "reset_target_card":
          return Math.max(1, numValue);
        case "auto_swipe_interval":
          return Math.max(500, numValue);
        case "reset_after_timeout":
          return Math.max(5000, numValue);
        default:
          return numValue;
      }
    }

    return value;
  }

  /**
   * Check if a specific option is a template
   * @param {string} option - Config option name
   * @returns {boolean} True if option contains a template
   */
  isTemplateOption(option) {
    return this._templateOptions.has(option);
  }

  /**
   * Get entities referenced in templates for tracking changes
   * @returns {Set<string>} Set of entity IDs found in templates
   */
  getReferencedEntities() {
    const entities = new Set();

    // Parse templates for entity references
    // Common patterns: states('entity.id'), is_state('entity.id', ...), state_attr('entity.id', ...)
    const entityPattern =
      /(?:states|is_state|state_attr|has_value)\s*\(\s*['"]([\w.]+)['"]/g;

    for (const template of Object.values(this._originalConfigValues)) {
      if (typeof template !== "string") continue;

      let match;
      while ((match = entityPattern.exec(template)) !== null) {
        entities.add(match[1]);
      }
    }

    if (entities.size > 0) {
      logDebug(
        "TEMPLATE",
        "Found referenced entities in templates:",
        Array.from(entities),
      );
    }

    return entities;
  }

  /**
   * Clear template cache
   */
  clearCache() {
    // No cache in this implementation
  }
}
