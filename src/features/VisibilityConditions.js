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
    case "and": {
      // All nested conditions must be true
      if (!condition.conditions || !Array.isArray(condition.conditions)) {
        logDebug("VISIBILITY", "AND condition missing 'conditions' array");
        return false;
      }

      if (condition.conditions.length === 0) {
        logDebug("VISIBILITY", "AND condition has empty 'conditions' array");
        return true; // Empty AND is considered true
      }

      const result = condition.conditions.every((nestedCondition) => {
        try {
          return evaluateSingleCondition(nestedCondition, hass);
        } catch (error) {
          logDebug(
            "VISIBILITY",
            "Error evaluating nested AND condition:",
            nestedCondition,
            error,
          );
          return false; // Fail the AND on any error
        }
      });

      logDebug(
        "VISIBILITY",
        `AND condition result: ${result} (${condition.conditions.length} nested conditions)`,
      );
      return result;
    }

    case "or": {
      // At least one nested condition must be true
      if (!condition.conditions || !Array.isArray(condition.conditions)) {
        logDebug("VISIBILITY", "OR condition missing 'conditions' array");
        return false;
      }

      if (condition.conditions.length === 0) {
        logDebug("VISIBILITY", "OR condition has empty 'conditions' array");
        return false; // Empty OR is considered false
      }

      const result = condition.conditions.some((nestedCondition) => {
        try {
          return evaluateSingleCondition(nestedCondition, hass);
        } catch (error) {
          logDebug(
            "VISIBILITY",
            "Error evaluating nested OR condition:",
            nestedCondition,
            error,
          );
          return false; // Ignore errors in OR, continue with other conditions
        }
      });

      logDebug(
        "VISIBILITY",
        `OR condition result: ${result} (${condition.conditions.length} nested conditions)`,
      );
      return result;
    }

    case "not": {
      // The nested condition must be false
      if (!condition.condition) {
        logDebug("VISIBILITY", "NOT condition missing 'condition' property");
        return false;
      }

      try {
        const nestedResult = evaluateSingleCondition(condition.condition, hass);
        const result = !nestedResult;
        logDebug(
          "VISIBILITY",
          `NOT condition result: ${result} (nested was ${nestedResult})`,
        );
        return result;
      } catch (error) {
        logDebug(
          "VISIBILITY",
          "Error evaluating nested NOT condition:",
          condition.condition,
          error,
        );
        return false; // Default to false on error
      }
    }

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

    case "time": {
      // Time-based visibility conditions
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      // Check weekdays if specified
      if (
        condition.weekdays &&
        Array.isArray(condition.weekdays) &&
        condition.weekdays.length > 0
      ) {
        const weekdayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        const currentWeekday = weekdayMap[now.getDay()];
        if (!condition.weekdays.includes(currentWeekday)) {
          logDebug(
            "VISIBILITY",
            `Time condition: weekday ${currentWeekday} not in ${condition.weekdays}, result: false`,
          );
          return false;
        }
      }

      // Parse time string (HH:MM or HH:MM:SS) to minutes since midnight
      const parseTimeToMinutes = (timeStr) => {
        if (!timeStr) return null;
        const parts = timeStr.split(":");
        if (parts.length < 2) return null;
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        if (isNaN(hours) || isNaN(minutes)) return null;
        return hours * 60 + minutes;
      };

      const afterMinutes = parseTimeToMinutes(condition.after);
      const beforeMinutes = parseTimeToMinutes(condition.before);

      // At least one of after or before must be specified
      if (afterMinutes === null && beforeMinutes === null) {
        logDebug("VISIBILITY", "Time condition: no after or before specified");
        return true;
      }

      let result = true;

      // Handle time ranges that may span midnight
      if (afterMinutes !== null && beforeMinutes !== null) {
        if (afterMinutes < beforeMinutes) {
          // Normal range (e.g., 08:00 to 17:00)
          result = currentTime >= afterMinutes && currentTime < beforeMinutes;
        } else {
          // Range spans midnight (e.g., 22:00 to 06:00)
          result = currentTime >= afterMinutes || currentTime < beforeMinutes;
        }
      } else if (afterMinutes !== null) {
        result = currentTime >= afterMinutes;
      } else if (beforeMinutes !== null) {
        result = currentTime < beforeMinutes;
      }

      logDebug(
        "VISIBILITY",
        `Time condition: current=${Math.floor(currentTime / 60)}:${currentTime % 60}, after=${condition.after}, before=${condition.before}, result: ${result}`,
      );
      return result;
    }

    default:
      logDebug("VISIBILITY", `Unknown condition type: ${conditionType}`);
      return true; // Unknown conditions default to visible
  }
}
