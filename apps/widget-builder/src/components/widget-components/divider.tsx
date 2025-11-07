import React from "react";
import { cn } from "@/lib/utils";
import { BorderColor, variants, VariantsProps } from "./variants";
import { ComponentDefinition } from "monaco-jsx-editor";
import { Separator } from "@/components/ui/separator";

const Variants = variants({
  color: BorderColor,
});

export interface DividerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantsProps<typeof Variants> {
  orientation?: "horizontal" | "vertical";
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(({ className, orientation, color, ...props }, ref) => {
  const [variantClasses, variantStyles] = Variants.format({ color });
  return (
    <Separator
      className={cn(className, variantClasses)}
      style={variantStyles}
      ref={ref}
      orientation={orientation}
      {...props}
    />
  );
});

Divider.displayName = "Divider";

const DividerDefinition: ComponentDefinition = {
  name: "Divider",
  description: "A divider component to separate content with customizable styling.",
  props: [
    {
      name: "orientation",
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      description: "The orientation of the divider.",
    },
    ...Variants.definitions,
  ],
  category: "Layout",
  usage: `<Row height="4" gap={2} align="center">
  <Text>Left</Text>
  <Divider orientation="vertical" />
  <Text>Right</Text>
</Row>`,
};

export { Divider, DividerDefinition };
