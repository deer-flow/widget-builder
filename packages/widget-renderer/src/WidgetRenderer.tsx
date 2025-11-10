import { JSXElementSchema, executeExpression, parseJSXTemplate, ActionCallback } from "@deer-flow/widget";
import React, { useRef, useEffect } from "react";
import { ComponentType } from "react";
import { ActionContext } from "./ActionContext";

export type WidgetRendererProps = {
  schema?: JSXElementSchema;
  components: Record<string, ComponentType<unknown>>;
  data?: Record<string, unknown>;
  template?: string;
  onAction?: ActionCallback;
};

// Helper to resolve expression values from data context
function resolveValue(
  value: JSXElementSchema["value"],
  data: Record<string, unknown>,
  action?: ActionCallback
): unknown {
  if (typeof value === "object" && value !== null && value.__expression) {
    const expression = value.__expression;
    try {
      return executeExpression(expression, data, action);
    } catch (error) {
      console.warn(`Failed to evaluate expression "${expression}":`, error);
      return undefined;
    }
  }
  return value;
}

// Internal component that has access to action context
function WidgetRendererInternal({
  schema,
  components,
  data,
  action,
}: {
  schema: JSXElementSchema;
  components: Record<string, ComponentType<unknown>>;
  data: Record<string, unknown>;
  action?: ActionCallback;
}): React.ReactElement | null {
  switch (schema.type) {
    case "text": {
      const content = resolveValue(schema.value, data, action);
      return <>{content}</>;
    }
    case "expression": {
      const content = resolveValue(schema.value, data, action);
      return <>{content}</>;
    }
    case "element": {
      if (!schema.name) {
        console.warn("Element schema missing 'name' property:", schema);
        return null;
      }

      // Resolve component from the map, or fall back to a string for native HTML elements
      const Component = components[schema.name] || schema.name;

      const props: Record<string, unknown> = {};
      if (schema.props) {
        for (const key in schema.props) {
          if (Object.prototype.hasOwnProperty.call(schema.props, key)) {
            // Resolve prop values, which might be expressions
            props[key] = resolveValue(schema.props[key] as JSXElementSchema["value"], data, action);
          }
        }
      }

      // Recursively render children
      const children = schema.children
        ? schema.children.map((child, index) => (
            <WidgetRendererInternal
              key={index}
              schema={child}
              components={components}
              data={data}
              action={action}
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

export function WidgetRenderer({
  schema,
  components,
  data,
  template,
  onAction,
}: WidgetRendererProps): React.ReactElement | null {
  // Cache the parsed schema to avoid re-parsing on every render
  const schemaRef = useRef<JSXElementSchema | null>(schema);
  const lastTemplateRef = useRef<string | undefined>(template);

  if (!schemaRef.current && template) {
    const parseResult = parseJSXTemplate(template);
    if (parseResult.success && parseResult.schema) {
      schemaRef.current = parseResult.schema;
    } else {
      console.warn("Failed to parse template:", parseResult.errors);
    }
  }

  // Parse template only when it changes
  useEffect(() => {
    if (template !== lastTemplateRef.current) {
      if (template) {
        const parseResult = parseJSXTemplate(template);
        if (parseResult.success && parseResult.schema) {
          schemaRef.current = parseResult.schema;
        } else {
          console.warn("Failed to parse template:", parseResult.errors);
          schemaRef.current = null;
        }
      } else {
        schemaRef.current = null;
      }
      lastTemplateRef.current = template;
    }
  }, [template]);

  // Determine effective schema
  const effectiveSchema = schema || schemaRef.current;

  if (!effectiveSchema) {
    return null;
  }

  return (
    <ActionContext.Provider value={onAction}>
      <WidgetRendererInternal
        schema={effectiveSchema}
        components={components}
        data={data ?? {}}
        action={onAction}
      />
    </ActionContext.Provider>
  );
}
