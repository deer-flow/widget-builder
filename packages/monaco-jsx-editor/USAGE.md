# Monaco JSX Editor Usage

## Basic Usage

```tsx
import { JSXEditor } from "monaco-jsx-editor";
import { ComponentDefinition } from "monaco-jsx-editor";

const components: ComponentDefinition[] = [
  {
    name: "Button",
    description: "A customizable button component",
    props: [
      {
        name: "text",
        type: "string",
        required: true,
        description: "The button text",
      },
      {
        name: "variant",
        type: '"primary" | "secondary" | "danger"',
        required: false,
        description: "The button style variant",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        description: "Whether the button is disabled",
      },
    ],
  },
  {
    name: "TextInput",
    description: "A text input field",
    props: [
      {
        name: "value",
        type: "string",
        required: true,
        description: "The input value",
      },
      {
        name: "placeholder",
        type: "string",
        required: false,
        description: "Placeholder text",
      },
      {
        name: "onChange",
        type: "(value: string) => void",
        required: false,
        description: "Change handler",
      },
    ],
  },
];

function App() {
  const [code, setCode] = useState(`
<div>
  <Button text="Click me" variant="primary" />
  <TextInput value={data.userName} placeholder="Enter your name" />
</div>
  `);

  return (
    <JSXEditor
      value={code}
      onChange={(value) => setCode(value || "")}
      jsxOptions={{
        components,
        allowedHTMLElements: ["div", "span", "p", "h1", "h2"],
        disableAllHTMLElements: false,
      }}
      height="400px"
    />
  );
}
```

## Features

### 1. Component Type Generation

- Automatically generates TypeScript interfaces for component props
- Registers components in JSX namespace for proper type checking
- Provides IntelliSense support for component properties

### 2. Auto-completion

- Component name completion when typing `<`
- Property completion when typing inside component tags
- Support for both self-closing and regular tags

### 3. Type Checking

- Full TypeScript type checking for JSX code
- Validation of required vs optional props
- Type checking for prop values

### 4. Customization Options

- `components`: Array of component definitions
- `allowedHTMLElements`: Whitelist of allowed HTML elements
- `disableAllHTMLElements`: Disable all HTML elements if true
- `setupCompilerOptions`: Custom TypeScript compiler options

## Component Definition Schema

```typescript
interface ComponentProp {
  name: string; // Property name
  type: string; // TypeScript type as string
  required?: boolean; // Whether the prop is required
  description?: string; // Description for IntelliSense
}

interface ComponentDefinition {
  name: string; // Component name (PascalCase)
  props: ComponentProp[]; // Array of component properties
  description?: string; // Component description
}
```

## Generated Types Example

For the Button component above, the system generates:

```typescript
/** A customizable button component */
interface ButtonProps {
  /** The button text */
  text: string;
  /** The button style variant */
  variant?: "primary" | "secondary" | "danger";
  /** Whether the button is disabled */
  disabled?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      button: ButtonProps;
    }
  }

  /** A customizable button component */
  const Button: React.FC<ButtonProps>;
}
```

This enables full IntelliSense and type checking in the Monaco editor for your custom components.
