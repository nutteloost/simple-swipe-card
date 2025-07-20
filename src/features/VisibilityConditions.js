/**
 * Visibility conditions evaluation for Simple Swipe Card
 */

import { logDebug } from "../utils/Debug.js";

/**
 * Evaluates visibility conditions for a card
 * @param {Array} conditions - Array of visibility conditions
 * @param {Object} hass - Home Assistant object
 * @returns {boolean} True if the card should be visible
 */
export function evaluateVisibilityConditions(conditions, hass) {
  if (!conditions || !Array.isArray(conditions) || conditions.length === 0) {
    return true; // No conditions means always visible
  }

  if (!hass) {
    logDebug("VISIBILITY", "No hass object available for condition evaluation");
    return true; // Default to visible if we can't evaluate
  }

  // All conditions must be true for the card to be visible (AND logic)
  return conditions.every((condition) => {
    try {
      return evaluateSingleCondition(condition, hass);
    } catch (error) {
      logDebug("VISIBILITY", "Error evaluating condition:", condition, error);
      return true; // Default to visible on error
    }
  });
}

/**
 * Evaluates a single visibility condition
 * @param {Object} condition - The condition to evaluate
 * @param {Object} hass - Home Assistant object
 * @returns {boolean} True if the condition is met
 */
function evaluateSingleCondition(condition, hass) {
  if (!condition || typeof condition !== "object") {
    return true;
  }

  const { condition: conditionType, entity, state, state_not } = condition;

  switch (conditionType) {
    case "state": {
      if (!entity || !hass.states[entity]) {
        logDebug(
          "VISIBILITY",
          `Entity ${entity} not found for state condition`,
        );
        return false;
      }

      const entityState = hass.states[entity].state;

      if (state !== undefined) {
        const expectedState = String(state);
        const actualState = String(entityState);
        const result = actualState === expectedState;
        logDebug(
          "VISIBILITY",
          `State condition: ${entity} = ${actualState}, expected: ${expectedState}, result: ${result}`,
        );
        return result;
      }

      if (state_not !== undefined) {
        const notExpectedState = String(state_not);
        const actualState = String(entityState);
        const result = actualState !== notExpectedState;
        logDebug(
          "VISIBILITY",
          `State not condition: ${entity} = ${actualState}, not expected: ${notExpectedState}, result: ${result}`,
        );
        return result;
      }

      return true;
    }

    case "numeric_state": {
      if (!entity || !hass.states[entity]) {
        logDebug(
          "VISIBILITY",
          `Entity ${entity} not found for numeric_state condition`,
        );
        return false;
      }

      const numericValue = parseFloat(hass.states[entity].state);
      if (isNaN(numericValue)) {
        return false;
      }

      let result = true;
      if (condition.above !== undefined) {
        result = result && numericValue > parseFloat(condition.above);
      }
      if (condition.below !== undefined) {
        result = result && numericValue < parseFloat(condition.below);
      }

      logDebug(
        "VISIBILITY",
        `Numeric state condition: ${entity} = ${numericValue}, result: ${result}`,
      );
      return result;
    }

    case "screen": {
      // Screen size conditions
      const media = condition.media_query;
      if (media && window.matchMedia) {
        const mediaQuery = window.matchMedia(media);
        const result = mediaQuery.matches;
        logDebug("VISIBILITY", `Screen condition: ${media}, result: ${result}`);
        return result;
      }
      return true;
    }

    case "user": {
      // User-based conditions
      if (condition.users && Array.isArray(condition.users)) {
        const currentUser = hass.user;
        if (currentUser && currentUser.id) {
          const result = condition.users.includes(currentUser.id);
          logDebug(
            "VISIBILITY",
            `User condition: current user ${currentUser.id}, allowed users: ${condition.users}, result: ${result}`,
          );
          return result;
        }
      }
      return true;
    }

    default:
      logDebug("VISIBILITY", `Unknown condition type: ${conditionType}`);
      return true; // Unknown conditions default to visible
  }
}
