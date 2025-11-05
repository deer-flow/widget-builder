# Widget Components

A collection of lightweight UI components designed for use with the widget renderer system. These components are built with shadcn/ui patterns, TailwindCSS, and provide a bridge between JSXSchema definitions and rendered React components.

## Overview

Widget Components are specifically designed for:

- **Widget Renderer**: Rendering JSXSchema-based widget definitions
- **Monaco JSX Editor**: Providing component definitions for autocomplete and property panels
- **Platform UI**: Separate from the main app's shadcn components to avoid conflicts

## Components

### Layout Components

- **Box**: Flexible container with padding, background, and border variants
- **Row**: Horizontal flex layout container with alignment, gap, and comprehensive styling options
- **Col**: Vertical flex layout container with alignment, gap, and comprehensive styling options
- **Stack**: Flexbox container for row/column layouts with gap and alignment options

### Card Components

- **Card**: Container with background, border, and shadow
- **CardHeader, CardContent, CardFooter**: Semantic card sections
- **CardTitle, CardDescription**: Typography for card headers

### Typography

- **Text**: Text with size, weight, and variant options
- **Title**: Heading component with level variants (h1-h6)
- **Caption**: Secondary text with size and opacity variants

### UI Elements

- **Button**: Re-exported from shadcn/ui for consistency
- **Badge**: Status indicators with color variants
- **Avatar**: User avatars with image and fallback support
- **Image**: Responsive images with aspect ratio and border radius options
- **Progress**: Progress bars with color and size variants
- **Divider**: Horizontal/vertical separators
- **List, ListItem**: List containers with spacing and interactive variants

## Usage

### With WidgetRendererAdapter

```tsx
import { WidgetRendererAdapter } from "@/components/widget-components/WidgetRendererAdapter";

const schema = {
  version: "1.0",
  root: {
    type: "element",
    tag: "Card",
    props: { variant: "default" },
    children: [
      {
        type: "element",
        tag: "Title",
        props: {
          children: { type: "expression", value: "data.title" },
        },
      },
    ],
  },
};

const data = { title: "Hello World" };

<WidgetRendererAdapter schema={schema} data={data} />;
```

### With Monaco JSX Editor

```tsx
import { widgetComponentDefinitions } from "@/components/widget-components/component-definitions";

// Use with Monaco editor for autocomplete
editor.setComponentDefinitions(widgetComponentDefinitions);
```

## Component Props

Each component supports:

- Standard HTML attributes
- Tailwind className overrides
- Variant-based styling (using class-variance-authority)
- forwardRef for proper ref handling

### Expression Props

Components support JSXSchema expression props:

```typescript
// Static prop
{ children: "Hello World" }

// Expression prop (evaluated against data context)
{ children: { type: "expression", value: "data.user.name" } }
```

## Styling

Components use:

- **TailwindCSS**: For utility classes and responsive design
- **CSS Variables**: From shadcn/ui theme tokens
- **CVA**: Class-variance-authority for variant management
- **cn**: Utility for merging classnames with tailwind-merge

## Architecture

```
widget-components/
├── index.ts                    # Barrel exports
├── componentsMap.ts           # Tag -> Component mapping
├── WidgetRendererAdapter.tsx  # Schema -> React renderer
├── component-definitions.ts   # Monaco editor metadata
├── examples/                  # Sample schemas and data
└── [component].tsx           # Individual components
```

## Expression Evaluation

The WidgetRendererAdapter automatically:

1. Normalizes expression props from `{ type: "expression", value: string }` to legacy `{ __expression: string }` format
2. Evaluates expressions using the sandboxed `executeExpression` from `@deer-flow/widget`
3. Provides resolved values to components as regular props

## Development

### Adding New Components

1. Create component file with shadcn patterns:

```tsx
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const componentVariants = cva(/* styles */);

export interface ComponentProps extends VariantProps<typeof componentVariants> {
  // props
}

export const Component = React.forwardRef<
  HTMLElement,
  ComponentProps
>(/* impl */);
```

2. Export from `index.ts`
3. Add to `componentsMap.ts`
4. Add ComponentDefinition to `component-definitions.ts`

### Testing

Run the dev server to see components in action:

```bash
cd apps/widget-builder
pnpm dev
```

The App.tsx includes demo widgets that exercise most components.

## Integration

### Package Dependencies

- `@deer-flow/widget`: Schema types and expression evaluation
- `@deer-flow/widget-renderer`: Base renderer functionality
- `@deer-flow/monaco-jsx-editor`: Component definitions type

### Path Aliases

Uses `@/` alias configured in tsconfig.json for imports within the app.
