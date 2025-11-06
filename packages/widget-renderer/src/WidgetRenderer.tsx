import { JSXElementSchema, executeExpression } from "@deer-flow/widget";
import React from "react";
import { ComponentType } from "react";

export type WidgetRendererProps = {
  schema?: JSXElementSchema;
  components: Record<string, ComponentType<unknown>>;
  data?: object;
};

// Helper to resolve expression values from data context
function resolveValue(value: any, data: Record<string, any>): any {
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

export function WidgetRenderer({
  schema,
  components,
  data,
}: WidgetRendererProps): React.ReactElement | null {
  if (!schema) {
    return null;
  }

  switch (schema.type) {
    case "text": {
      const content = resolveValue(schema.value, data ?? {});
      return <>{content}</>;
    }
    case "expression": {
      const content = resolveValue(schema.value, data ?? {});
      return <>{content}</>;
    }
    case "element": {
      if (!schema.name) {
        console.warn("Element schema missing 'name' property:", schema);
        return null;
      }

      // Resolve component from the map, or fall back to a string for native HTML elements
      const Component = components[schema.name] || schema.name;

      const props: Record<string, any> = {};
      if (schema.props) {
        for (const key in schema.props) {
          if (Object.prototype.hasOwnProperty.call(schema.props, key)) {
            // Resolve prop values, which might be expressions
            props[key] = resolveValue(schema.props[key], data ?? {});
          }
        }
      }

      // Recursively render children
      const children = schema.children
        ? schema.children.map((child, index) => (
            <WidgetRenderer
              key={index}
              schema={child}
              components={components}
              data={data}
            />
          ))
        : undefined;

      return React.createElement(Component, props, children);
    }

    default:
      console.warn("Unknown schema node type:", schema.type);
      return null;
  }
}
