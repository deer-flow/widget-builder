import { describe, it, expect } from "vitest";
import { JSONSchema4 } from "json-schema";
import { inferDataSchemaFromState } from "../StateUtils";
import { WidgetState } from "../Widget";

describe("inferDataSchemaFromState", () => {
  it("should return empty object schema when no states provided", () => {
    const result = inferDataSchemaFromState({});

    expect(result).toEqual({
      type: "object",
      properties: {},
    });
  });

  it("should infer schema from simple primitive types", () => {
    const states = {
      state1: { name: "John", age: 30, active: true },
      state2: { name: "Jane", age: 25, active: false },
      default: { name: "Default", age: 0, active: true },
    };

    const result = inferDataSchemaFromState(states, "default");

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
    const states = {
      state1: { value: "text" },
      state2: { value: 42 },
      default: { value: "default" },
    };

    const result = inferDataSchemaFromState(states, "default");

    expect(result).toEqual({
      type: "object",
      properties: {
        value: { type: ["string", "number"], default: "default" },
      },
      required: ["value"],
    });
  });

  it("should handle nested objects", () => {
    const states = {
      state1: {
        user: { name: "John", details: { age: 30 } },
      },
      state2: {
        user: { name: "Jane", details: { age: 25 } },
      },
      default: {
        user: { name: "Default", details: { age: 0 } },
      },
    };

    const result = inferDataSchemaFromState(states, "default");

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
    const states = {
      state1: { items: [1, 2, 3] },
      state2: { items: ["a", "b", "c"] },
      default: { items: [] },
    };

    const result = inferDataSchemaFromState(states, "default");

    expect(result).toEqual({
      type: "object",
      properties: {
        items: { type: "array", default: [] },
      },
      required: ["items"],
    });
  });

  it("should handle complex union types with anyOf", () => {
    const states = {
      state1: { data: { nested: "object" } },
      state2: { data: "simple string" },
      default: { data: { nested: "default" } },
    };

    const result = inferDataSchemaFromState(states, "default");

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
    const states = {
      state1: { name: "John", age: 30 },
      state2: { name: "Jane" }, // missing age
      default: { name: "Default", age: 0 },
    };

    const result = inferDataSchemaFromState(states, "default");

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
    const states = {
      state1: { value: null },
      state2: { value: "text" },
      default: { value: null },
    };

    const result = inferDataSchemaFromState(states, "default");

    expect(result).toEqual({
      type: "object",
      properties: {
        value: { type: ["object", "string"], default: null }, // null is typeof "object"
      },
      required: ["value"],
    });
  });

  it("should throw error for unsupported types", () => {
    const states = {
      state1: { func: () => {} },
      default: { func: () => {} },
    };

    expect(() => {
      inferDataSchemaFromState(states, "default");
    }).toThrow('Unsupported type for key "func"');
  });

  it("should throw error for Map instances", () => {
    const states = {
      state1: { mapValue: new Map() },
      default: { mapValue: new Map() },
    };

    expect(() => {
      inferDataSchemaFromState(states, "default");
    }).toThrow('Unsupported type for key "mapValue"');
  });

  it("should throw error for Set instances", () => {
    const states = {
      state1: { setValue: new Set() },
      default: { setValue: new Set() },
    };

    expect(() => {
      inferDataSchemaFromState(states, "default");
    }).toThrow('Unsupported type for key "setValue"');
  });

  it("should throw error for RegExp instances", () => {
    const states = {
      state1: { regexValue: /test/ },
      default: { regexValue: /test/ },
    };

    expect(() => {
      inferDataSchemaFromState(states, "default");
    }).toThrow('Unsupported type for key "regexValue"');
  });

  it("should throw error for Symbol values", () => {
    const states = {
      state1: { symbolValue: Symbol("test") },
      default: { symbolValue: Symbol("test") },
    };

    expect(() => {
      inferDataSchemaFromState(states, "default");
    }).toThrow('Unsupported type for key "symbolValue"');
  });

  it("should use default key for default values", () => {
    const states = {
      production: { name: "Prod", count: 100 },
      development: { name: "Dev", count: 1 },
      staging: { name: "Stage", count: 10 },
    };

    const result = inferDataSchemaFromState(states, "staging");

    expect(result).toEqual({
      type: "object",
      properties: {
        name: { type: ["string"], default: "Stage" },
        count: { type: ["number"], default: 10 },
      },
      required: ["name", "count"],
    });
  });

  it("should handle complex nested structures with mixed types", () => {
    const states = {
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

    const result = inferDataSchemaFromState(states, "default");

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
    const states = {
      state1: { name: "John" },
      default: { name: "Default" },
    };

    const result = inferDataSchemaFromState(states, "default");

    expect(result).toEqual({
      type: "object",
      properties: {
        name: { type: ["string"], default: "Default" },
      },
      required: ["name"],
    });
  });
});
