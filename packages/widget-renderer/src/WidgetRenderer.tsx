import { JSXElementSchema, executeExpression, parseJSXTemplate } from "@deer-flow/widget";
import React from "react";
import { ComponentType } from "react";

export type WidgetRendererProps = {
  schema?: JSXElementSchema;
  components: Record<string, ComponentType<unknown>>;
  data?: Record<string, unknown>;
  template?: string;
};

// Helper to resolve expression values from data context
function resolveValue(value: JSXElementSchema["value"], data: Record<string, unknown>): unknown {
  if (typeof value === "object" && value !== null && value.__expression) {
    const expression = value.__expression;
    try {
      return executeExpression(expression, data);
    } catch (error) {
      console.warn(`Failed to evaluate expression "${expression}":`, error);
      return undefined;
    }
  }
  return value;
}

export function WidgetRenderer({ schema, components, data, template }: WidgetRendererProps): React.ReactElement | null {
  // If schema is not provided but template is, parse the template to get the schema
  let effectiveSchema = schema;
  if (!effectiveSchema && template) {
    const parseResult = parseJSXTemplate(template);
    if (parseResult.success && parseResult.schema) {
      effectiveSchema = parseResult.schema;
    } else {
      console.warn("Failed to parse template:", parseResult.errors);
      return null;
    }
  }

  if (!effectiveSchema) {
    return null;
  }

  switch (effectiveSchema.type) {
    case "text": {
      const content = resolveValue(effectiveSchema.value, data ?? {});
      return <>{content}</>;
    }
    case "expression": {
      const content = resolveValue(effectiveSchema.value, data ?? {});
      return <>{content}</>;
    }
    case "element": {
      if (!effectiveSchema.name) {
        console.warn("Element schema missing 'name' property:", effectiveSchema);
        return null;
      }

      // Resolve component from the map, or fall back to a string for native HTML elements
      const Component = components[effectiveSchema.name] || effectiveSchema.name;

      const props: Record<string, unknown> = {};
      if (effectiveSchema.props) {
        for (const key in effectiveSchema.props) {
          if (Object.prototype.hasOwnProperty.call(effectiveSchema.props, key)) {
            // Resolve prop values, which might be expressions
            props[key] = resolveValue(effectiveSchema.props[key] as JSXElementSchema["value"], data ?? {});
          }
        }
      }

      // Recursively render children
      const children = effectiveSchema.children
        ? effectiveSchema.children.map((child, index) => (
            <WidgetRenderer key={index} schema={child} components={components} data={data} />
          ))
        : undefined;

      return React.createElement(Component, props, children);
    }

    default:
      console.warn("Unknown schema node type:", effectiveSchema.type);
      return null;
  }
}
