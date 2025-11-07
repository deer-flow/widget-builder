import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { executeExpression } from "../Expression";

describe("executeExpression", () => {
  // Mock console methods to avoid cluttering test output
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Basic data access", () => {
    it("should access simple data properties", () => {
      const data = { name: "John", age: 30 };

      expect(executeExpression("data.name", data)).toBe("John");
      expect(executeExpression("data.age", data)).toBe(30);
    });

    it("should access nested data properties", () => {
      const data = {
        user: {
          name: "John",
          profile: {
            email: "john@example.com",
          },
        },
      };

      expect(executeExpression("data.user.name", data)).toBe("John");
      expect(executeExpression("data.user.profile.email", data)).toBe(
        "john@example.com"
      );
    });

    it("should return undefined for non-existent properties", () => {
      const data = { name: "John" };

      expect(executeExpression("data.nonExistent", data)).toBeUndefined();
    });
  });

  describe("Default value expressions", () => {
    it("should return default value when property is undefined", () => {
      const data = { name: "John" };

      expect(executeExpression("data.age || 25", data)).toBe(25);
      expect(executeExpression("data.city || 'Unknown'", data)).toBe("Unknown");
    });

    it("should return actual value when property exists", () => {
      const data = { name: "John", age: 30, city: "New York" };

      expect(executeExpression("data.age || 25", data)).toBe(30);
      expect(executeExpression("data.city || 'Unknown'", data)).toBe(
        "New York"
      );
    });

    it("should handle falsy values correctly", () => {
      const data = { count: 0, active: false, message: "" };

      expect(executeExpression("data.count || 10", data)).toBe(10);
      expect(executeExpression("data.active || true", data)).toBe(true);
      expect(executeExpression("data.message || 'default'", data)).toBe(
        "default"
      );
    });
  });

  describe("Mathematical operations", () => {
    it("should perform basic arithmetic", () => {
      const data = { price: 100, tax: 0.1, quantity: 3 };

      expect(executeExpression("data.price * data.quantity", data)).toBe(300);
      expect(
        executeExpression("data.price + data.price * data.tax", data)
      ).toBe(110);
      expect(executeExpression("data.price - 20", data)).toBe(80);
      expect(executeExpression("data.price / 2", data)).toBe(50);
    });

    it("should use Math functions", () => {
      const data = { value: 4.7, price: 99.99 };

      expect(executeExpression("Math.round(data.value)", data)).toBe(5);
      expect(executeExpression("Math.floor(data.price)", data)).toBe(99);
      expect(executeExpression("Math.ceil(data.value)", data)).toBe(5);
      expect(executeExpression("Math.max(data.value, 10)", data)).toBe(10);
    });
  });

  describe("String operations", () => {
    it("should concatenate strings", () => {
      const data = { firstName: "John", lastName: "Doe" };

      expect(
        executeExpression("data.firstName + ' ' + data.lastName", data)
      ).toBe("John Doe");
      expect(executeExpression("'Hello, ' + data.firstName + '!'", data)).toBe(
        "Hello, John!"
      );
    });

    it("should use string methods", () => {
      const data = { name: "john doe", text: "  hello world  " };

      expect(executeExpression("data.name.toUpperCase()", data)).toBe(
        "JOHN DOE"
      );
      expect(executeExpression("data.text.trim()", data)).toBe("hello world");
      expect(executeExpression("data.name.length", data)).toBe(8);
    });
  });

  describe("Conditional expressions", () => {
    it("should evaluate ternary operators", () => {
      const data = { age: 30, isActive: true, score: 85 };

      expect(
        executeExpression("data.age >= 18 ? 'Adult' : 'Minor'", data)
      ).toBe("Adult");
      expect(executeExpression("data.isActive ? 'Yes' : 'No'", data)).toBe(
        "Yes"
      );
      expect(executeExpression("data.score >= 90 ? 'A' : 'B'", data)).toBe("B");
    });

    it("should evaluate logical operators", () => {
      const data = { a: true, b: false, x: 10, y: 5 };

      expect(executeExpression("data.a && data.b", data)).toBe(false);
      expect(executeExpression("data.a || data.b", data)).toBe(true);
      expect(executeExpression("!data.b", data)).toBe(true);
      expect(executeExpression("data.x > 5 && data.y < 10", data)).toBe(true);
    });
  });

  describe("Array operations", () => {
    it("should access array elements and properties", () => {
      const data = {
        items: ["apple", "banana", "cherry"],
        numbers: [1, 2, 3, 4, 5],
      };

      expect(executeExpression("data.items[0]", data)).toBe("apple");
      expect(executeExpression("data.items.length", data)).toBe(3);
      expect(
        executeExpression("data.numbers[data.numbers.length - 1]", data)
      ).toBe(5);
    });

    it("should use array methods", () => {
      const data = { items: ["apple", "banana", "cherry"] };

      expect(executeExpression("data.items.join(', ')", data)).toBe(
        "apple, banana, cherry"
      );
      expect(executeExpression("data.items.includes('banana')", data)).toBe(
        true
      );
      expect(executeExpression("data.items.indexOf('cherry')", data)).toBe(2);
    });
  });

  describe("Type conversion and checking", () => {
    it("should perform type conversions", () => {
      const data = {
        numString: "123",
        boolString: "true",
        floatString: "45.67",
      };

      expect(executeExpression("Number(data.numString)", data)).toBe(123);
      expect(executeExpression("parseInt(data.numString)", data)).toBe(123);
      expect(executeExpression("parseFloat(data.floatString)", data)).toBe(
        45.67
      );
      expect(executeExpression("String(123)", data)).toBe("123");
    });

    it("should check for NaN and finite values", () => {
      const data = { validNumber: 42, invalidNumber: NaN };

      expect(executeExpression("isNaN(data.invalidNumber)", data)).toBe(true);
      expect(executeExpression("isNaN(data.validNumber)", data)).toBe(false);
      expect(executeExpression("isFinite(data.validNumber)", data)).toBe(true);
    });
  });

  describe("JSON operations", () => {
    it("should parse and stringify JSON", () => {
      const data = {
        jsonString: '{"name":"John","age":30}',
        obj: { name: "Jane", age: 25 },
      };

      const parsed = executeExpression("JSON.parse(data.jsonString)", data);
      expect(parsed).toEqual({ name: "John", age: 30 });

      const stringified = executeExpression("JSON.stringify(data.obj)", data);
      expect(stringified).toBe('{"name":"Jane","age":25}');
    });
  });

  describe("Error handling", () => {
    it("should handle syntax errors gracefully", () => {
      const data = { name: "John" };

      expect(() => executeExpression("data.name +", data)).toThrow();
      expect(() => executeExpression("invalid syntax +++", data)).toThrow();
    });

    it("should handle runtime errors gracefully", () => {
      const data = { name: "John" };

      expect(() =>
        executeExpression("data.nonExistent.property", data)
      ).toThrow();
      expect(() =>
        executeExpression("data.name.nonExistentMethod()", data)
      ).toThrow();
    });

    it("should warn about execution errors", () => {
      const data = { name: "John" };
      const consoleSpy = vi.spyOn(console, "warn");

      expect(() => executeExpression("invalid.expression", data)).toThrow();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Error executing expression "invalid.expression"'
        ),
        expect.any(Error)
      );
    });
  });

  describe("Complex expressions", () => {
    it("should handle complex nested expressions", () => {
      const data = {
        user: {
          name: "John Doe",
          age: 30,
          preferences: {
            theme: "dark",
            notifications: true,
          },
        },
        settings: {
          maxAge: 65,
          defaultTheme: "light",
        },
      };

      const result = executeExpression(
        "data.user.age < data.settings.maxAge ? data.user.preferences.theme : data.settings.defaultTheme",
        data
      );
      expect(result).toBe("dark");
    });

    it("should handle expressions with multiple operations", () => {
      const data = {
        products: [
          { name: "Product A", price: 100, discount: 0.1 },
          { name: "Product B", price: 200, discount: 0.15 },
        ],
      };

      const result = executeExpression(
        "data.products[0].price * (1 - data.products[0].discount)",
        data
      );
      expect(result).toBe(90);
    });
  });

  describe("Sandbox security", () => {
    it("should handle browser-specific globals gracefully", () => {
      const data = { test: "value" };

      // Browser-specific globals should not be accessible (these don't exist in Node.js)
      expect(executeExpression("eval", data)).toBe(undefined);
      expect(executeExpression("window", data)).toBe(undefined);
      expect(executeExpression("document", data)).toBe(undefined);
      expect(executeExpression("navigator", data)).toBe(undefined);
      expect(executeExpression("location", data)).toBe(undefined);
      expect(executeExpression("history", data)).toBe(undefined);
    });

    it("should have access to safe globals", () => {
      const data = { num: "42.5", date: "2023-01-01" };

      expect(executeExpression("Math.PI", data)).toBe(Math.PI);
      expect(executeExpression("Number(data.num)", data)).toBe(42.5);
      expect(executeExpression("Date.parse(data.date)", data)).toBe(
        Date.parse("2023-01-01")
      );
    });
  });
});
