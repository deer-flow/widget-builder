import { describe, it, expect } from "vitest";
import { JSONSchema4 } from "json-schema";
import { inferDataSchemaFromState } from "../StateUtils";
import { WidgetState } from "../Widget";

describe("inferDataSchemaFromState", () => {
  it("should return empty object schema when no states provided", () => {
    const result = inferDataSchemaFromState([{ name: "default", data: {} }]);

    expect(result).toEqual({
      type: "object",
      properties: {},
    });
  });

  it("should infer schema from simple primitive types", () => {
    const states: WidgetState[] = [
      { name: "default", data: { name: "Default", age: 0, active: true } },
      { name: "state1", data: { name: "John", age: 30, active: true } },
      { name: "state2", data: { name: "Jane", age: 25, active: false } },
    ];

    const result = inferDataSchemaFromState(states);

    expect(result).toEqual({
      type: "object",
      properties: {
        name: { type: ["string"], default: "Default" },
        age: { type: ["number"], default: 0 },
        active: { type: ["boolean"], default: true },
      },
      required: ["name", "age", "active"],
    });
  });

  it("should handle union types with primitive arrays", () => {
    const states = [
      { name: "default", data: { value: "default" } },
      { name: "state1", data: { value: "text" } },
      { name: "state2", data: { value: 42 } },
    ];

    const result = inferDataSchemaFromState(states);

    expect(result).toEqual({
      type: "object",
      properties: {
        value: { type: ["string", "number"], default: "default" },
      },
      required: ["value"],
    });
  });

  it("should handle nested objects", () => {
    const states = [
      { name: "default", data: { user: { name: "Default", details: { age: 0 } } } },
      { name: "state1", data: { user: { name: "John", details: { age: 30 } } } },
      { name: "state2", data: { user: { name: "Jane", details: { age: 25 } } } },
    ];

    const result = inferDataSchemaFromState(states);

    expect(result).toEqual({
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            name: { type: ["string"], default: "Default" },
            details: {
              type: "object",
              properties: {
                age: { type: ["number"], default: 0 },
              },
              required: ["age"],
            },
          },
          required: ["name", "details"],
        },
      },
      required: ["user"],
    });
  });

  it("should handle arrays", () => {
    const states = [
      { name: "default", data: { items: [] } },
      { name: "state1", data: { items: [1, 2, 3] } },
      { name: "state2", data: { items: ["a", "b", "c"] } },
    ];

    const result = inferDataSchemaFromState(states);

    expect(result).toEqual({
      type: "object",
      properties: {
        items: { type: "array", default: [] },
      },
      required: ["items"],
    });
  });

  it("should handle complex union types with anyOf", () => {
    const states: WidgetState[] = [
      { name: "default", data: { data: { nested: "default" } } },
      { name: "state1", data: { data: { nested: "object" } } },
      { name: "state2", data: { data: "simple string" } },
    ];

    const result = inferDataSchemaFromState(states);

    expect(result).toEqual({
      type: "object",
      properties: {
        data: {
          anyOf: [
            {
              type: "object",
              properties: {
                nested: { type: ["string"], default: "default" },
              },
              required: ["nested"],
            },
            { type: "string" },
          ],
        },
      },
      required: ["data"],
    });
  });

  it("should mark properties as optional if not present in all states", () => {
    const states = [
      { name: "default", data: { name: "Default", age: 0 } },
      { name: "state1", data: { name: "John", age: 30 } },
      { name: "state2", data: { name: "Jane" } }, // missing age
    ];

    const result = inferDataSchemaFromState(states);

    expect(result).toEqual({
      type: "object",
      properties: {
        name: { type: ["string"], default: "Default" },
        age: { type: ["number", "undefined"], default: 0 },
      },
      required: ["name"], // age is not required since it's missing in state2
    });
  });

  it("should handle null values", () => {
    const states = [
      { name: "default", data: { value: null } },
      { name: "state1", data: { value: null } },
      { name: "state2", data: { value: "text" } },
    ];

    const result = inferDataSchemaFromState(states);

    expect(result).toEqual({
      type: "object",
      properties: {
        value: { type: ["object", "string"], default: null }, // null is typeof "object"
      },
      required: ["value"],
    });
  });

  it("should throw error for unsupported types", () => {
    const states = [
      { name: "default", data: { func: () => {} } },
      { name: "state1", data: { func: () => {} } },
    ];

    expect(() => {
      inferDataSchemaFromState(states);
    }).toThrow('Unsupported type for key "func"');
  });

  it("should throw error for Map instances", () => {
    const states = [
      { name: "default", data: { mapValue: new Map() } },
      { name: "state1", data: { mapValue: new Map() } },
    ];

    expect(() => {
      inferDataSchemaFromState(states);
    }).toThrow('Unsupported type for key "mapValue"');
  });

  it("should throw error for Set instances", () => {
    const states = [
      { name: "default", data: { setValue: new Set() } },
      { name: "state1", data: { setValue: new Set() } },
    ];

    expect(() => {
      inferDataSchemaFromState(states);
    }).toThrow('Unsupported type for key "setValue"');
  });

  it("should throw error for RegExp instances", () => {
    const states = [
      { name: "default", data: { regexValue: /test/ } },
      { name: "state1", data: { regexValue: /test/ } },
    ];

    expect(() => {
      inferDataSchemaFromState(states);
    }).toThrow('Unsupported type for key "regexValue"');
  });

  it("should throw error for Symbol values", () => {
    const states = [
      { name: "default", data: { symbolValue: Symbol("test") } },
      { name: "state1", data: { symbolValue: Symbol("test") } },
    ];

    expect(() => {
      inferDataSchemaFromState(states);
    }).toThrow('Unsupported type for key "symbolValue"');
  });

  it("should throw error for Symbol values", () => {
    const states = [
      { name: "default", data: { symbolValue: Symbol("test") } },
      { name: "state1", data: { symbolValue: Symbol("test") } },
    ];

    expect(() => {
      inferDataSchemaFromState(states);
    }).toThrow('Unsupported type for key "symbolValue"');
  });

  it("should handle complex nested structures with mixed types", () => {
    const data = {
      state1: {
        config: {
          settings: { theme: "dark", notifications: true },
          metadata: { version: "1.0.0", tags: ["prod"] },
        },
        status: "active",
      },
      state2: {
        config: {
          settings: { theme: "light", notifications: false },
          metadata: { version: "2.0.0", tags: ["dev", "test"] },
        },
        status: "inactive",
      },
      default: {
        config: {
          settings: { theme: "auto", notifications: true },
          metadata: { version: "0.0.1", tags: [] },
        },
        status: "pending",
      },
    };

    const states = [
      { name: "state1", data: data["state1"] },
      { name: "state2", data: data["state2"] },
      { name: "default", data: data["default"] },
    ];

    const result = inferDataSchemaFromState(states);

    expect(result).toEqual({
      type: "object",
      properties: {
        config: {
          type: "object",
          properties: {
            settings: {
              type: "object",
              properties: {
                theme: { type: ["string"], default: "auto" },
                notifications: { type: ["boolean"], default: true },
              },
              required: ["theme", "notifications"],
            },
            metadata: {
              type: "object",
              properties: {
                version: { type: ["string"], default: "0.0.1" },
                tags: { type: "array", default: [] },
              },
              required: ["version", "tags"],
            },
          },
          required: ["settings", "metadata"],
        },
        status: { type: ["string"], default: "pending" },
      },
      required: ["config", "status"],
    });
  });

  it("should skip non-object states gracefully", () => {
    const states = [
      { name: "state1", data: { name: "John" } },
      { name: "default", data: { name: "Default" } },
    ];

    const result = inferDataSchemaFromState(states);

    expect(result).toEqual({
      type: "object",
      properties: {
        name: { type: ["string"], default: "Default" },
      },
      required: ["name"],
    });
  });
});
