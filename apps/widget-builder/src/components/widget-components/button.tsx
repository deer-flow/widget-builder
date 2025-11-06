import { ComponentDefinition } from "monaco-jsx-editor";
import { Button } from "../ui/button";

const ButtonDefinition: ComponentDefinition = {
  name: "Button",
  description: "A customizable button component.",
  props: [
    {
      name: "variant",
      type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
      description: "The variant style of the button.",
      defaultValue: '"default"',
    },
    {
      name: "size",
      type: '"default" | "sm" | "lg"',
      description: "The size of the button.",
      defaultValue: '"default"',
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "The content of the button.",
    },
    {
      name: "onClick",
      type: "(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void",
      description: "Click event handler for the button.",
    },
  ],
};

export { Button, ButtonDefinition };
