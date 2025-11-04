# Monaco JSX Editor

A powerful Monaco-based code editor with enhanced JSX support, custom component types, and intelligent auto-completion for widget development.

## Features

- 🎯 **Custom Component Types**: Automatically generate TypeScript interfaces for your components
- 🚀 **JSX Namespace Registration**: Components are properly registered in the JSX global namespace
- 💡 **Intelligent Auto-completion**: Smart suggestions for component names and properties
- 🔍 **Type Checking**: Full TypeScript type checking for JSX code with custom components
- ⚙️ **Customizable**: Configure allowed HTML elements and TypeScript compiler options
- 📝 **Rich IntelliSense**: Detailed documentation and type information on hover

## Installation

```bash
pnpm add monaco-jsx-editor
```

## Quick Start

```tsx
import { JSXEditor, ComponentDefinition } from "monaco-jsx-editor";

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
    ],
  },
];

function App() {
  const [code, setCode] = useState('<Button text="Hello" variant="primary" />');

  return (
    <JSXEditor
      value={code}
      onChange={setCode}
      jsxOptions={{ components }}
      height="400px"
    />
  );
}
```

## Component Type Generation

The editor automatically generates TypeScript interfaces and JSX namespace declarations for your components:

**Input (Component Definition):**

```typescript
{
  name: 'Button',
  props: [
    { name: 'text', type: 'string', required: true },
    { name: 'variant', type: '"primary" | "secondary"', required: false }
  ]
}
```

**Generated Output:**

```typescript
interface ButtonProps {
  text: string;
  variant?: "primary" | "secondary";
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      button: ButtonProps;
    }
  }

  const Button: React.FC<ButtonProps>;
}
```

## API Reference

### JSXEditor Props

All Monaco Editor props are supported, plus:

- `jsxOptions?: JSXLanguageOptions` - Configuration for JSX language features

### JSXLanguageOptions

- `components?: ComponentDefinition[]` - Array of custom component definitions
- `allowedHTMLElements?: string[]` - Whitelist of allowed HTML elements
- `disableAllHTMLElements?: boolean` - Disable all HTML elements
- `setupCompilerOptions?: (monaco) => CompilerOptions` - Custom TypeScript options

### ComponentDefinition

- `name: string` - Component name (PascalCase)
- `props: ComponentProp[]` - Array of component properties
- `description?: string` - Component description for IntelliSense

### ComponentProp

- `name: string` - Property name
- `type: string` - TypeScript type as string
- `required?: boolean` - Whether the prop is required
- `description?: string` - Description for IntelliSense

## Advanced Usage

See [USAGE.md](./USAGE.md) for detailed examples and advanced configuration options.

## License

MIT
