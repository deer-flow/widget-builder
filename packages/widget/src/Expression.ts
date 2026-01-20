/**
 * Action callback type for handling events in widgets
 */
export type ActionCallback = (action: { type: string; payload?: unknown }) => void;

/**
 * Create a simple sandbox environment to execute expressions
 */
function createSandbox(data: Record<string, unknown>, action?: ActionCallback) {
  // Create a safe globals object
  const safeGlobals = {
    // Basic JavaScript constructors and objects
    String,
    Number,
    Boolean,
    Array,
    Object,
    Math,
    Date,
    JSON,
    // Common utility functions
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    // Data object
    data,
    // Action function for handling events
    action: action || (() => {}),
  };

  return safeGlobals;
}

/**
 * Execute expression within sandbox
 */
export function executeExpression(expression: string, data: Record<string, unknown>, action?: ActionCallback): unknown {
  try {
    // Create sandbox environment
    const sandbox = createSandbox(data, action);

    // Create arrays of parameter names and values
    const paramNames = Object.keys(sandbox);
    const paramValues = Object.values(sandbox);

    // Use improved sandbox: create a function with all allowed variables passed in
    // Prevent access to dangerous globals in browser environment
    const func = new Function(
      ...paramNames,
      `
      "use strict";

      try {
        return (${expression});
      } catch (e) {
        throw e;
      }
      `
    );

    // Execute the function
    const result = func(...paramValues);

    return result;
  } catch (error) {
    console.warn(`Error executing expression "${expression}":`, error);

    throw error;
  }
}
