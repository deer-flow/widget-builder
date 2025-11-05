import { parse } from "@babel/parser";
import * as t from "@babel/types";

export interface JSXElementSchema {
  type: "element" | "text" | "expression";
  name?: string; // Component name
  props?: Record<string, any>; // Component props
  children?: JSXElementSchema[]; // Child elements
  value?: string | number | boolean | { __expression: string }; // For text/expression nodes
  position?: {
    start: number;
    end: number;
    line: number;
    column: number;
  };
}

export interface ParseResult {
  success: boolean;
  schema?: JSXElementSchema;
  errors?: string[];
}

class BabelJSXParser {
  private input: string;

  constructor(input: string) {
    this.input = input.trim();
  }

  parse(): ParseResult {
    try {
      if (!this.input) {
        return {
          success: false,
          errors: ["Empty JSX template"],
        };
      }

      // Parse with Babel parser
      const ast = parse(this.input, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
        allowImportExportEverywhere: true,
        allowReturnOutsideFunction: true,
      });

      // Find the first JSX element in the AST
      const jsxElement = this.findJSXElement(ast);
      if (!jsxElement) {
        return {
          success: false,
          errors: ["No JSX element found in template"],
        };
      }

      const schema = this.convertToSchema(jsxElement);
      return {
        success: true,
        schema,
      };
    } catch (error) {
      return {
        success: false,
        errors: [
          error instanceof Error ? error.message : "Unknown parsing error",
        ],
      };
    }
  }

  private findJSXElement(ast: t.File): t.JSXElement | t.JSXFragment | null {
    let jsxElement: t.JSXElement | t.JSXFragment | null = null;

    const visitor = (node: any) => {
      if (t.isJSXElement(node) || t.isJSXFragment(node)) {
        if (!jsxElement) {
          jsxElement = node;
        }
        return;
      }

      // Recursively visit child nodes
      for (const key of Object.keys(node)) {
        const child = node[key];
        if (child && typeof child === "object") {
          if (Array.isArray(child)) {
            child.forEach(visitor);
          } else if (child.type) {
            visitor(child);
          }
        }
      }
    };

    visitor(ast);
    return jsxElement;
  }

  private convertToSchema(
    node:
      | t.JSXElement
      | t.JSXFragment
      | t.JSXText
      | t.JSXExpressionContainer
      | any
  ): JSXElementSchema {
    if (t.isJSXElement(node)) {
      return this.convertJSXElement(node);
    } else if (t.isJSXFragment(node)) {
      return this.convertJSXFragment(node);
    } else if (t.isJSXText(node)) {
      return this.convertJSXText(node);
    } else if (t.isJSXExpressionContainer(node)) {
      return this.convertJSXExpression(node);
    } else {
      // Fallback for unknown nodes
      return {
        type: "text",
        value: String(node),
        position: this.getNodePosition(node),
      };
    }
  }

  private convertJSXElement(element: t.JSXElement): JSXElementSchema {
    const name = this.getElementName(element.openingElement.name);
    const props = this.convertProps(element.openingElement.attributes);
    const children = element.children
      .map((child) => this.convertToSchema(child))
      .filter((child) => !(child.type === "text" && !child.value)); // Filter out empty text nodes

    return {
      type: "element",
      name,
      props,
      children,
      position: this.getNodePosition(element),
    };
  }

  private convertJSXFragment(fragment: t.JSXFragment): JSXElementSchema {
    const children = fragment.children
      .map((child) => this.convertToSchema(child))
      .filter((child) => !(child.type === "text" && !child.value)); // Filter out empty text nodes

    return {
      type: "element",
      name: "Fragment",
      props: {},
      children,
      position: this.getNodePosition(fragment),
    };
  }

  private convertJSXText(textNode: t.JSXText): JSXElementSchema {
    const text = textNode.value.trim();

    return {
      type: "text",
      value: text,
      position: this.getNodePosition(textNode),
    };
  }

  private convertJSXExpression(
    expression: t.JSXExpressionContainer
  ): JSXElementSchema {
    let expressionCode = "";

    if (
      expression.expression &&
      !t.isJSXEmptyExpression(expression.expression)
    ) {
      // Extract the expression code from the original input
      const start = expression.expression.start || 0;
      const end = expression.expression.end || 0;
      expressionCode = this.input.slice(start, end);
    }

    return {
      type: "expression",
      value: { __expression: expressionCode },
      position: this.getNodePosition(expression),
    };
  }

  private getElementName(
    name: t.JSXIdentifier | t.JSXMemberExpression | t.JSXNamespacedName
  ): string {
    if (t.isJSXIdentifier(name)) {
      return name.name;
    } else if (t.isJSXMemberExpression(name)) {
      return `${this.getElementName(name.object)}.${name.property.name}`;
    } else if (t.isJSXNamespacedName(name)) {
      return `${name.namespace.name}:${name.name.name}`;
    }
    return "Unknown";
  }

  private convertProps(
    attributes: Array<t.JSXAttribute | t.JSXSpreadAttribute>
  ): Record<string, any> {
    const props: Record<string, any> = {};

    for (const attr of attributes) {
      if (t.isJSXAttribute(attr)) {
        const name = t.isJSXIdentifier(attr.name) ? attr.name.name : "unknown";

        if (!attr.value) {
          // Boolean prop (no value)
          props[name] = true;
        } else if (t.isStringLiteral(attr.value)) {
          props[name] = attr.value.value;
        } else if (t.isJSXExpressionContainer(attr.value)) {
          if (
            attr.value.expression &&
            !t.isJSXEmptyExpression(attr.value.expression)
          ) {
            const start = attr.value.expression.start || 0;
            const end = attr.value.expression.end || 0;
            const expressionCode = this.input.slice(start, end);
            props[name] = { __expression: expressionCode };
          }
        }
      } else if (t.isJSXSpreadAttribute(attr)) {
        // Handle spread attributes {...props}
        if (attr.argument) {
          const start = attr.argument.start || 0;
          const end = attr.argument.end || 0;
          const expressionCode = this.input.slice(start, end);
          props["...spread"] = { __expression: expressionCode };
        }
      }
    }

    return props;
  }

  private getNodePosition(node: any): {
    start: number;
    end: number;
    line: number;
    column: number;
  } {
    return {
      start: node.start || 0,
      end: node.end || 0,
      line: node.loc?.start?.line || 1,
      column: node.loc?.start?.column || 1,
    };
  }
}

/**
 * Parse JSX template string into a JSON schema representation using Babel parser
 */
export function parseJSXTemplate(template: string): ParseResult {
  const parser = new BabelJSXParser(template);
  return parser.parse();
}

/**
 * Convert JSX schema back to JSX string (for debugging/visualization)
 */
export function schemaToJSX(
  schema: JSXElementSchema,
  indent: number = 0
): string {
  const spacing = "  ".repeat(indent);

  if (schema.type === "text") {
    return String(schema.value || "");
  }

  if (schema.type === "expression") {
    const expr = schema.value as { __expression: string };
    return `{${expr.__expression}}`;
  }

  if (schema.type === "element") {
    const name = schema.name || "div";
    const props = schema.props || {};
    const children = schema.children || [];

    // Build props string
    const propsStr = Object.entries(props)
      .map(([key, value]) => {
        if (key === "...spread") {
          const expr = value as { __expression: string };
          return `{...${expr.__expression}}`;
        }

        if (value === true) {
          return key;
        }

        if (typeof value === "string") {
          return `${key}="${value}"`;
        }

        if (value && typeof value === "object" && "__expression" in value) {
          const expr = value as { __expression: string };
          return `${key}={${expr.__expression}}`;
        }

        return `${key}={${JSON.stringify(value)}}`;
      })
      .join(" ");

    const propsWithSpace = propsStr ? ` ${propsStr}` : "";

    if (children.length === 0) {
      return `<${name}${propsWithSpace} />`;
    }

    const childrenStr = children
      .map((child) => schemaToJSX(child, indent + 1))
      .join("");

    const hasTextOnlyChild =
      children.length === 1 && children[0].type === "text";

    if (hasTextOnlyChild) {
      return `<${name}${propsWithSpace}>${childrenStr}</${name}>`;
    }

    return `<${name}${propsWithSpace}>
${children.map((child) => spacing + "  " + schemaToJSX(child, indent + 1)).join("\n")}
${spacing}</${name}>`;
  }

  return "";
}

// Export the main parser class as well
export { BabelJSXParser };
