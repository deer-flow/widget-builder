import { ComponentDefinition } from "monaco-jsx-editor";
import React from "react";

import { cn } from "@/lib/utils";

import { Background, Border, variants, Padding, Radius, VariantsProps, Size } from "./variants";

const Variants = variants({
  size: Size,
  padding: Padding,
  background: Background,
  border: Border,
  radius: Radius,
});

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement>, VariantsProps<typeof Variants> {
  as?: React.ElementType;
}

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, children, as: Component = "div", style, size, padding, background, border, radius, ...props }, ref) => {
    // Merge with existing style prop
    const [variantClasses, variantStyles] = Variants.format({ size, padding, background, border, radius });
    return (
      <Component
        className={cn("block", variantClasses, className)}
        style={{ ...style, ...variantStyles }}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Box.displayName = "Box";

const BoxDefinition: ComponentDefinition = {
  name: "Box",
  description: "A versatile container component with customizable styling.",
  props: Variants.definitions,
  category: "Layout",
  usage: `<Box size="md" padding="md" background="muted" border="default" radius="md">
  <Text>This is a box component.</Text>
</Box>`,
};

export { Box, BoxDefinition };
