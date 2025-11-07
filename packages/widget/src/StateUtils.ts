import { JSONSchema4, JSONSchema4TypeName } from "json-schema";

import { WidgetState } from "./Widget";

/**
 * Infers a JSON schema from the widget's state definitions
 *
 * This function analyzes multiple state objects and creates a unified JSON Schema that:
 * - Supports multi-level nested objects and arrays
 * - Handles union types when the same key has different data types across states
 * - Uses primitive type arrays (e.g., type: ['string', 'number']) for simple unions
 * - Uses anyOf for complex unions involving objects/arrays
 * - Sets default values from the specified defaultKey state
 * - Marks properties as required only if they appear in ALL states
 * - Throws errors for unsupported types (functions, Map, Set, RegExp, Symbol)
 *
 * @param states - Record of state objects, each either raw data or { value: data }
 * @param defaultKey - Key of the state to use for default values (default: "default")
 * @returns JSONSchema4 object describing the unified schema
 *
 * @example
 * ```typescript
 * const states = {
 *   state1: { name: 'John', age: 30 },
 *   state2: { name: 'Jane', age: 25 },
 *   default: { name: 'Default', age: 0 }
 * };
 *
 * const schema = inferDataSchemaFromState(states;
 * // Returns:
 * // {
 * //   type: 'object',
 * //   properties: {
 * //     name: { type: 'string', default: 'Default' },
 * //     age: { type: 'number', default: 0 }
 * //   },
 * //   required: ['name', 'age']
 * // }
 * ```
 */
export function inferDataSchemaFromState(states: WidgetState[]): JSONSchema4 {
  if (states.length === 0) {
    return { type: "object", properties: {} };
  }
  const objects = states.map((state) => state.data);
  const schema = inferObjectsSchema(objects, states[0].data);
  return schema;
}

function inferObjectsSchema(states: object[], defaults?: object): JSONSchema4 {
  const properties: JSONSchema4["properties"] = {};
  const required: string[] = [];
  const schema: JSONSchema4 = { type: "object", properties, required };

  // Filter out non-object states
  const validStates = states.filter((state) => typeof state === "object" && state !== null);

  if (validStates.length === 0) {
    return schema;
  }

  const keys = new Set<string>();
  validStates.forEach((state) => {
    Object.keys(state).forEach((key) => keys.add(key));
  });

  keys.forEach((key) => {
    const values = validStates.map((state) => (state as any)[key]);
    const allHaveKey = validStates.every((state) => (state as any).hasOwnProperty(key));
    if (allHaveKey) {
      required.push(key);
    }

    // Infer type
    const types = new Set<JSONSchema4TypeName>();
    const objectValues: WidgetState[] = [];
    const arrayValues: any[][] = [];
    values.forEach((value) => {
      const valueType = Array.isArray(value) ? "array" : typeof value;
      if (
        valueType === "function" ||
        valueType === "symbol" ||
        valueType === "bigint" ||
        value instanceof Map ||
        value instanceof Set ||
        value instanceof RegExp
      ) {
        throw new Error(`Unsupported type for key "${key}"`);
      } else {
        types.add(valueType as JSONSchema4TypeName);
      }

      if (valueType === "array") {
        arrayValues.push(value as any[]);
      } else if (valueType === "object" && value !== null) {
        objectValues.push(value as WidgetState);
      }
    });

    if (objectValues.length === 0 && arrayValues.length === 0 && types.size > 0) {
      const propertySchema: JSONSchema4 = { type: Array.from(types) };
      if (defaults && (defaults as any).hasOwnProperty(key)) {
        propertySchema.default = (defaults as any)[key];
      }
      properties[key] = propertySchema;
    } else if (objectValues.length > 0) {
      // Complex type - object
      const objectSchema = inferObjectsSchema(objectValues, (defaults as any)?.[key]);
      properties[key] =
        types.size > 1
          ? {
              anyOf: [
                objectSchema,
                ...Array.from(types)
                  .filter((t) => t !== "object")
                  .map((type) => ({ type })),
              ],
            }
          : objectSchema;
    } else if (arrayValues.length > 0) {
      // Complex type - array
      const arraySchema: JSONSchema4 = { type: "array" };
      if (defaults && (defaults as any).hasOwnProperty(key)) {
        arraySchema.default = (defaults as any)[key];
      }
      properties[key] = arraySchema;
    }
  });

  return schema;
}
