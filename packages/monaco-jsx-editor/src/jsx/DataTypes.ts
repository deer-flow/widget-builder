import { JSONSchema4 } from "json-schema";

/**
 * Convert a JSON Schema to TypeScript interface string
 * Browser-compatible implementation that doesn't require Node.js dependencies
 */
export function generateDataTypes(schema: JSONSchema4): string {
  try {
    // Simple TypeScript interface generation from JSON Schema
    const interfaceBody = generateInterfaceBody(schema);

    return `
declare const data: {
${interfaceBody}
};
`;
  } catch (error) {
    console.error("Error generating types from schema:", error);
    // Fallback to a basic interface
    return `declare const data: {
  [key: string]: any;
};
`;
  }
}

/**
 * Generate TypeScript interface body from JSON Schema
 */
function generateInterfaceBody(schema: JSONSchema4, indent: string = "  "): string {
  if (!schema.properties) {
    return `${indent}[key: string]: any;`;
  }

  const lines: string[] = [];

  for (const [propName, propSchema] of Object.entries(schema.properties)) {
    const prop = propSchema as JSONSchema4;
    const optional =
      !(Array.isArray(schema.required) && schema.required.includes(propName)) && prop.default === undefined;
    const propType = getTypeScriptType(prop);
    const questionMark = optional ? "?" : "";

    // Add JSDoc comment if description exists
    if (prop.description) {
      lines.push(`${indent}/** ${prop.description} */`);
    }

    lines.push(`${indent}${propName}${questionMark}: ${propType};`);
  }

  return lines.join("\n");
}

/**
 * Convert JSON Schema property to TypeScript type
 */
function getTypeScriptType(schema: JSONSchema4): string {
  if (Array.isArray(schema.type)) {
    const types = schema.type.map((t) => {
      return getTypeScriptType({ ...schema, type: t } as JSONSchema4);
    });
    return types.join(" | ");
  }

  // Handle union types
  if (schema.anyOf) {
    const types = schema.anyOf.map((s) => getTypeScriptType(s as JSONSchema4));
    return types.join(" | ");
  }

  // Handle array type
  if (schema.type === "array") {
    if (schema.items) {
      const itemType = getTypeScriptType(schema.items as JSONSchema4);
      return `${itemType}[]`;
    }
    return "any[]";
  }

  // Handle object type
  if (schema.type === "object") {
    if (schema.properties) {
      const nested = generateInterfaceBody(schema, "    ");
      return `{\n${nested}\n  }`;
    }
    return "Record<string, any>";
  }

  // Handle enum
  if (schema.enum) {
    const enumValues = schema.enum.map((val) => (typeof val === "string" ? `'${val}'` : String(val)));
    return enumValues.join(" | ");
  }

  // Handle basic types
  switch (schema.type) {
    case "string":
      return "string";
    case "number":
    case "integer":
      return "number";
    case "boolean":
      return "boolean";
    case "null":
      return "null";
    default:
      return "any";
  }
}
