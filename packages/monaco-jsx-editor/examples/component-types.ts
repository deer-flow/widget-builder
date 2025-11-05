import { ComponentDefinition } from "../src/types";

// 基础示例组件定义
const exampleComponents: ComponentDefinition[] = [
  {
    name: "Button",
    description: "A customizable button component for widgets",
    props: [
      {
        name: "text",
        type: "string",
        required: true,
        description: "The text displayed on the button",
      },
      {
        name: "variant",
        type: '"primary" | "secondary" | "danger"',
        required: false,
        description: "The visual style variant of the button",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        description: "Whether the button is disabled",
      },
      {
        name: "onClick",
        type: "() => void",
        required: false,
        description: "Click event handler",
      },
    ],
  },
  {
    name: "Card",
    description: "A card component to display content in a styled container",
    props: [
      {
        name: "title",
        type: "string",
        required: true,
        description: "The title of the card",
      },
    ],
  },
  {
    name: "Text",
    description: "A simple text display component",
    props: [
      {
        name: "label",
        type: "string",
        required: true,
        description: "The text content to display",
      },
    ],
  },
];

// 完整的 widget-components 定义（从 widget-builder 应用导入）
// 注意：实际项目中应该从 widget-builder 包导入
const widgetComponents: ComponentDefinition[] = [
  // 这里可以导入完整的 widget-components 定义
  // import { widgetComponentDefinitions } from "@widget-builder/widget-components";
];

export { exampleComponents, widgetComponents };
