import { ComponentDefinition } from "../src/types";
import { generateComponentTypes } from "../src/jsx/ComponentTypes";

// 示例组件定义
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
];

export { exampleComponents };
