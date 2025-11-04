import { ComponentDefinition, ComponentProp } from "../types";

/**
 * Generate TypeScript type declaration for a single property
 */
const generatePropType = (prop: ComponentProp): string => {
  const optional = prop.required ? "" : "?";
  const description = prop.description
    ? `\n    /** ${prop.description} */`
    : "";

  // For union types with string literals, create a type alias for better Monaco support
  let propType = prop.type;
  if (prop.type.includes("|") && prop.type.includes('"')) {
    // This is a union type, keep it as is - Monaco should handle it
    propType = prop.type;
  }

  return `${description}
    ${prop.name}${optional}: ${propType};`;
};

/**
 * Generate property interface for a single component
 */
const generateComponentInterface = (component: ComponentDefinition): string => {
  const propsDeclaration = component.props
    .map((prop) => generatePropType(prop))
    .join("\n");
  const description = component.description
    ? `\n  /** ${component.description} */`
    : "";

  return `${description}
  interface ${component.name}Props {${propsDeclaration}
  }`;
};

/**
 * Generate entry for JSX.IntrinsicElements
 */
const generateIntrinsicElement = (component: ComponentDefinition): string => {
  return `    ${component.name}: ${component.name}Props;`;
};

/**
 * Generate global type declaration for the component
 */
const generateGlobalComponentDeclaration = (
  component: ComponentDefinition
): string => {
  const description = component.description
    ? `\n  /** ${component.description} */`
    : "";
  return `${description}
  const ${component.name}: React.ComponentType<${component.name}Props>;`;
};

/**
 * Generate type declarations for all components and register them in the JSX namespace
 */
export const generateComponentTypes = (
  components: ComponentDefinition[]
): string => {
  if (!components || components.length === 0) {
    return `
// No custom components defined
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // HTML elements are handled by the base TypeScript lib
    }
  }
}
`;
  }

  const componentInterfaces = components
    .map(generateComponentInterface)
    .join("\n\n");
  const intrinsicElements = components.map(generateIntrinsicElement).join("\n");
  const globalDeclarations = components
    .map(generateGlobalComponentDeclaration)
    .join("\n\n");

  return `
// Auto-generated component types for Monaco Editor
// Generated at: ${new Date().toISOString()}

declare global {
  // Component prop interfaces
  ${componentInterfaces}

  // Function component declarations with preserved prop types
  ${components
    .map((component) => {
      const description = component.description
        ? `\n  /** ${component.description} */`
        : "";
      return `${description}
  function ${component.name}(props: ${component.name}Props): JSX.Element;`;
    })
    .join("\n\n")}

  namespace JSX {
    interface IntrinsicElements {
${intrinsicElements}
    }
  }
}

export {};
`;
};

// 生成组件的代码片段
export function generateComponentSnippets(components: ComponentDefinition[]) {
  return components.map((def) => {
    const requiredProps = def.props
      .filter((prop) => prop.required)
      .map((prop) => {
        if (prop.type === "string") {
          return `${prop.name}="$\{1:${prop.defaultValue || "value"}}"`;
        } else if (prop.type === "boolean") {
          return `${prop.name}={$\{1:${prop.defaultValue || "true"}}}`;
        } else if (prop.type.includes("'")) {
          // Union type, use first option
          const firstOption = prop.type.split("|")[0].trim().replace(/'/g, "");
          return `${prop.name}="$\{1:${firstOption}}"`;
        }
        return `${prop.name}={$\{1:${prop.defaultValue || "value"}}}`;
      });

    const hasChildren = def.props.find((prop) => prop.name === "children");

    if (hasChildren) {
      return {
        name: def.name,
        description: def.description,
        insertText: `${def.name}${requiredProps.length > 0 ? " " + requiredProps.join(" ") : ""}>\n  $\{0:children}\n</${name}>`,
      };
    } else {
      return {
        name: def.name,
        description: def.description,
        insertText: `${def.name}${requiredProps.length > 0 ? " " + requiredProps.join(" ") : ""} />`,
      };
    }
  });
}
