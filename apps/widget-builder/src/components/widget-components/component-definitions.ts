import { ComponentDefinition } from "monaco-jsx-editor/src/types/Component";

/**
 * Component definitions for widget-components
 * Used by Monaco JSX editor for autocomplete and property panels
 */
export const ComponentDefinitions: ComponentDefinition[] = [
  {
    name: "Box",
    description:
      "A flexible container component with layout and styling options",
    props: [
      {
        name: "padding",
        type: '"none" | "sm" | "md" | "lg"',
        required: false,
        description: "Padding variant",
        defaultValue: "none",
      },
      {
        name: "background",
        type: '"none" | "white" | "muted" | "card"',
        required: false,
        description: "Background color variant",
        defaultValue: "none",
      },
      {
        name: "border",
        type: '"none" | "default" | "rounded"',
        required: false,
        description: "Border variant",
        defaultValue: "none",
      },
      {
        name: "as",
        type: "string",
        required: false,
        description: "HTML element type to render as",
        defaultValue: "div",
      },
    ],
  },
  {
    name: "Row",
    description: "Horizontal flex layout container",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        required: false,
        description: "Child components to render inside the container",
      },
      {
        name: "align",
        type: '"start" | "center" | "end" | "baseline" | "stretch"',
        required: false,
        description: "Cross-axis alignment of children",
      },
      {
        name: "justify",
        type: '"start" | "center" | "end" | "stretch" | "between" | "around" | "evenly"',
        required: false,
        description: "Main-axis distribution of children",
      },
      {
        name: "wrap",
        type: '"nowrap" | "wrap" | "wrap-reverse"',
        required: false,
        description: "Wrap behavior for flex items",
        defaultValue: "nowrap",
      },
      {
        name: "flex",
        type: "string | number",
        required: false,
        description: "Flex growth/shrink factor",
      },
      {
        name: "gap",
        type: "string | number",
        required: false,
        description:
          "Gap between direct children; accepts a spacing unit or a CSS string",
      },
      {
        name: "padding",
        type: "string | number | object",
        required: false,
        description:
          "Inner padding; accepts a spacing unit, a CSS string, or a padding object",
      },
      {
        name: "border",
        type: "number | object",
        required: false,
        description:
          "Border applied to the container; accepts a numeric pixel value or a border object",
      },
      {
        name: "background",
        type: "string | object",
        required: false,
        description:
          "Background color; accepts surface color token, a primitive color token, a CSS string, or theme-aware { light, dark }",
      },
      {
        name: "height",
        type: "string | number",
        required: false,
        description:
          "Explicit height; accepts a numeric pixel value or a CSS string",
      },
      {
        name: "width",
        type: "string | number",
        required: false,
        description:
          "Explicit width; accepts a numeric pixel value or a CSS string",
      },
      {
        name: "size",
        type: "string | number",
        required: false,
        description:
          "Shorthand to set both width and height; accepts a numeric pixel value or a CSS string",
      },
      {
        name: "minHeight",
        type: "string | number",
        required: false,
        description:
          "Minimum height constraint; accepts a numeric pixel value or a CSS string",
      },
      {
        name: "minWidth",
        type: "string | number",
        required: false,
        description:
          "Minimum width constraint; accepts a numeric pixel value or a CSS string",
      },
      {
        name: "minSize",
        type: "string | number",
        required: false,
        description:
          "Shorthand to set both minWidth and minHeight; accepts a numeric pixel value or a CSS string",
      },
      {
        name: "maxHeight",
        type: "string | number",
        required: false,
        description:
          "Maximum height constraint; accepts a numeric pixel value or a CSS string",
      },
      {
        name: "maxWidth",
        type: "string | number",
        required: false,
        description:
          "Maximum width constraint; accepts a numeric pixel value or a CSS string",
      },
      {
        name: "maxSize",
        type: "string | number",
        required: false,
        description:
          "Shorthand to set both maxWidth and maxHeight; accepts a numeric pixel value or a CSS string",
      },
      {
        name: "aspectRatio",
        type: "string | number",
        required: false,
        description:
          "Aspect ratio of the box (e.g., 16/9); accepts a numeric value or a CSS string",
      },
      {
        name: "radius",
        type: '"2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full" | "100%" | "none"',
        required: false,
        description: "Border radius; accepts a radius token",
      },
      {
        name: "margin",
        type: "string | number | object",
        required: false,
        description:
          "Outer margin; accepts a spacing unit, a CSS string, or a margin object",
      },
    ],
  },
  {
    name: "Col",
    description: "Vertical flex layout container",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        required: false,
        description: "Child components to render inside the container",
      },
      {
        name: "align",
        type: '"start" | "center" | "end" | "baseline" | "stretch"',
        required: false,
        description: "Cross-axis alignment of children",
      },
      {
        name: "justify",
        type: '"start" | "center" | "end" | "stretch" | "between" | "around" | "evenly"',
        required: false,
        description: "Main-axis distribution of children",
      },
      {
        name: "wrap",
        type: '"nowrap" | "wrap" | "wrap-reverse"',
        required: false,
        description: "Wrap behavior for flex items",
        defaultValue: "nowrap",
      },
      {
        name: "flex",
        type: "string | number",
        required: false,
        description: "Flex growth/shrink factor",
      },
      {
        name: "gap",
        type: "string | number",
        required: false,
        description:
          "Gap between direct children; accepts a spacing unit or a CSS string",
      },
      {
        name: "padding",
        type: "string | number | object",
        required: false,
        description:
          "Inner padding; accepts a spacing unit, a CSS string, or a padding object",
      },
      {
        name: "border",
        type: "number | object",
        required: false,
        description:
          "Border applied to the container; accepts a numeric pixel value or a border object",
      },
      {
        name: "background",
        type: "string | object",
        required: false,
        description:
          "Background color; accepts surface color token, a primitive color token, a CSS string, or theme-aware { light, dark }",
      },
      {
        name: "height",
        type: "string | number",
        required: false,
        description:
          "Explicit height; accepts a numeric pixel value or a CSS string",
      },
      {
        name: "width",
        type: "string | number",
        required: false,
        description:
          "Explicit width; accepts a numeric pixel value or a CSS string",
      },
      {
        name: "size",
        type: "string | number",
        required: false,
        description:
          "Shorthand to set both width and height; accepts a numeric pixel value or a CSS string",
      },
      {
        name: "minHeight",
        type: "string | number",
        required: false,
        description:
          "Minimum height constraint; accepts a numeric pixel value or a CSS string",
      },
      {
        name: "minWidth",
        type: "string | number",
        required: false,
        description:
          "Minimum width constraint; accepts a numeric pixel value or a CSS string",
      },
      {
        name: "minSize",
        type: "string | number",
        required: false,
        description:
          "Shorthand to set both minWidth and minHeight; accepts a numeric pixel value or a CSS string",
      },
      {
        name: "maxHeight",
        type: "string | number",
        required: false,
        description:
          "Maximum height constraint; accepts a numeric pixel value or a CSS string",
      },
      {
        name: "maxWidth",
        type: "string | number",
        required: false,
        description:
          "Maximum width constraint; accepts a numeric pixel value or a CSS string",
      },
      {
        name: "maxSize",
        type: "string | number",
        required: false,
        description:
          "Shorthand to set both maxWidth and maxHeight; accepts a numeric pixel value or a CSS string",
      },
      {
        name: "aspectRatio",
        type: "string | number",
        required: false,
        description:
          "Aspect ratio of the box (e.g., 16/9); accepts a numeric value or a CSS string",
      },
      {
        name: "radius",
        type: '"2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full" | "100%" | "none"',
        required: false,
        description: "Border radius; accepts a radius token",
      },
      {
        name: "margin",
        type: "string | number | object",
        required: false,
        description:
          "Outer margin; accepts a spacing unit, a CSS string, or a margin object",
      },
    ],
  },
  {
    name: "Card",
    description:
      "A container with background, border, and shadow for grouping content",
    props: [
      {
        name: "variant",
        type: '"default" | "elevated" | "outlined"',
        required: false,
        description: "Card visual variant",
        defaultValue: "default",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "full"',
        required: false,
        description: "Card size variant",
        defaultValue: "md",
      },
      {
        name: "background",
        type: '"none" | "white" | "muted" | string',
        required: false,
        description: "Background color variant",
        defaultValue: "none",
      },
      {
        name: "padding",
        type: '"none" | "sm" | "md" | "lg" | number',
        required: false,
        description: "Internal padding (preset sizes or custom pixel value)",
        defaultValue: "md",
      },
    ],
  },
  {
    name: "CardHeader",
    description: "Header section of a card",
    props: [],
  },
  {
    name: "CardTitle",
    description: "Title element for card header",
    props: [],
  },
  {
    name: "CardDescription",
    description: "Description element for card header",
    props: [],
  },
  {
    name: "CardContent",
    description: "Main content area of a card",
    props: [],
  },
  {
    name: "CardFooter",
    description: "Footer section of a card",
    props: [],
  },
  {
    name: "Text",
    description: "A text component with typography variants",
    props: [
      {
        name: "variant",
        type: '"body" | "label" | "caption" | "muted"',
        required: false,
        description: "Text style variant",
        defaultValue: "body",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "base" | "lg" | "xl"',
        required: false,
        description: "Text size",
      },
      {
        name: "weight",
        type: '"normal" | "medium" | "semibold" | "bold"',
        required: false,
        description: "Font weight",
      },
      {
        name: "children",
        type: "string",
        required: true,
        description: "Text content to display",
      },
    ],
  },
  {
    name: "Title",
    description: "A heading component with level variants",
    props: [
      {
        name: "level",
        type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6"',
        required: false,
        description: "Heading level",
        defaultValue: "h3",
      },
      {
        name: "weight",
        type: '"normal" | "medium" | "semibold" | "bold"',
        required: false,
        description: "Font weight",
        defaultValue: "semibold",
      },
      {
        name: "children",
        type: "React.ReactNode",
        required: true,
        description: "Title text",
      },
    ],
  },
  {
    name: "Caption",
    description: "Supplemental text for descriptions or hints",
    props: [
      {
        name: "value",
        type: "string",
        required: true,
        description: "Text content to display",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        required: false,
        description: "Size of the caption text; accepts a caption size token",
        defaultValue: "md",
      },
      {
        name: "weight",
        type: '"normal" | "medium" | "semibold" | "bold"',
        required: false,
        description: "Font weight; accepts a font weight token",
        defaultValue: "normal",
      },
      {
        name: "color",
        type: "string | object",
        required: false,
        description:
          "Text color; accepts text color token, a primitive color token, a CSS string, or theme-aware { light, dark }",
        defaultValue: "secondary",
      },
      {
        name: "textAlign",
        type: '"start" | "center" | "end"',
        required: false,
        description: "Horizontal text alignment",
        defaultValue: "start",
      },
      {
        name: "truncate",
        type: "boolean",
        required: false,
        description: "Truncate overflow with ellipsis",
        defaultValue: false,
      },
      {
        name: "maxLines",
        type: "number",
        required: false,
        description:
          "Limit text to a maximum number of lines (applies a line clamp)",
      },
    ],
  },
  {
    name: "Divider",
    description: "A separator line between content sections",
    props: [
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        required: false,
        description: "Divider orientation",
        defaultValue: "horizontal",
      },
      {
        name: "variant",
        type: '"default" | "muted" | "subtle"',
        required: false,
        description: "Divider style variant",
        defaultValue: "default",
      },
    ],
  },
  {
    name: "Badge",
    description: "A small status indicator or label",
    props: [
      {
        name: "variant",
        type: '"default" | "secondary" | "destructive" | "outline" | "success" | "warning"',
        required: false,
        description: "Badge color variant",
        defaultValue: "default",
      },
      {
        name: "size",
        type: '"sm" | "default" | "lg"',
        required: false,
        description: "Badge size",
        defaultValue: "default",
      },
      {
        name: "children",
        type: "string",
        required: true,
        description: "Badge text",
      },
    ],
  },
  {
    name: "Avatar",
    description: "A user avatar with image and fallback support",
    props: [
      {
        name: "src",
        type: "string",
        required: false,
        description: "Avatar image URL",
      },
      {
        name: "alt",
        type: "string",
        required: false,
        description: "Alt text for avatar image",
      },
      {
        name: "fallback",
        type: "string",
        required: false,
        description: "Fallback text when image fails to load",
      },
      {
        name: "size",
        type: '"sm" | "default" | "lg" | "xl"',
        required: false,
        description: "Avatar size",
        defaultValue: "default",
      },
    ],
  },
  {
    name: "Image",
    description: "An image component with responsive options",
    props: [
      {
        name: "src",
        type: "string",
        required: true,
        description: "Image source URL",
      },
      {
        name: "alt",
        type: "string",
        required: false,
        description: "Alt text for accessibility",
      },
      {
        name: "fit",
        type: '"cover" | "contain" | "fill" | "scale-down"',
        required: false,
        description: "Object fit behavior",
        defaultValue: "cover",
      },
      {
        name: "rounded",
        type: '"none" | "sm" | "md" | "lg" | "xl" | "full"',
        required: false,
        description: "Border radius",
        defaultValue: "md",
      },
      {
        name: "aspect",
        type: '"auto" | "square" | "video" | "4/3" | "3/2"',
        required: false,
        description: "Aspect ratio",
        defaultValue: "auto",
      },
    ],
  },
  {
    name: "Progress",
    description: "A progress bar component",
    props: [
      {
        name: "value",
        type: "number",
        required: false,
        description: "Current progress value",
        defaultValue: 0,
      },
      {
        name: "max",
        type: "number",
        required: false,
        description: "Maximum progress value",
        defaultValue: 100,
      },
      {
        name: "size",
        type: '"sm" | "default" | "lg"',
        required: false,
        description: "Progress bar size",
        defaultValue: "default",
      },
      {
        name: "color",
        type: '"primary" | "secondary" | "success" | "warning" | "danger"',
        required: false,
        description: "Progress bar color",
        defaultValue: "primary",
      },
      {
        name: "showValue",
        type: "boolean",
        required: false,
        description: "Show progress value text",
        defaultValue: false,
      },
    ],
  },
  {
    name: "List",
    description: "A list container component",
    props: [
      {
        name: "variant",
        type: '"default" | "compact" | "spaced"',
        required: false,
        description: "List spacing variant",
        defaultValue: "default",
      },
      {
        name: "divided",
        type: "boolean",
        required: false,
        description: "Add dividers between items",
        defaultValue: false,
      },
    ],
  },
  {
    name: "ListItem",
    description: "An individual list item",
    props: [
      {
        name: "variant",
        type: '"default" | "compact" | "comfortable"',
        required: false,
        description: "List item spacing",
        defaultValue: "default",
      },
      {
        name: "interactive",
        type: "boolean",
        required: false,
        description: "Make item clickable with hover effects",
        defaultValue: false,
      },
    ],
  },
  {
    name: "Button",
    description: "A button component with variants and sizes",
    props: [
      {
        name: "variant",
        type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
        required: false,
        description: "Button visual variant",
        defaultValue: "default",
      },
      {
        name: "size",
        type: '"default" | "sm" | "lg" | "icon"',
        required: false,
        description: "Button size",
        defaultValue: "default",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        description: "Disable the button",
        defaultValue: false,
      },
      {
        name: "children",
        type: "string",
        required: true,
        description: "Button text or content",
      },
    ],
  },
];
