import { ComponentDefinition } from "monaco-jsx-editor";
import React from "react";

import { cn } from "@/lib/utils";

import {
  Background,
  Border,
  variants,
  Padding,
  Radius,
  VariantsProps,
  Size,
  Align,
  Justify,
  Grow,
  Shrink,
  Margin,
  Gap,
  Hidden,
} from "./variants";

const Variants = variants({
  size: Size,
  margin: Margin,
  padding: Padding,
  background: Background,
  border: Border,
  radius: Radius,
  align: Align,
  justify: Justify,
  grow: Grow,
  shrink: Shrink,
  gap: Gap,
  hidden: Hidden,
});

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement>, VariantsProps<typeof Variants> {
  as?: React.ElementType;
}

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      className,
      children,
      as: Component = "div",
      style,
      size,
      margin,
      padding,
      background,
      border,
      radius,
      align,
      justify,
      grow,
      shrink,
      gap,
      hidden,
      ...props
    },
    ref
  ) => {
    // Return null if hidden is true
    if (hidden) {
      return null;
    }
    
    // Merge with existing style prop
    const [variantClasses, variantStyles] = Variants.format({
      size,
      margin,
      padding,
      background,
      border,
      radius,
      align,
      justify,
      grow,
      shrink,
      gap,
    });
    return (
      <Component
        className={cn("flex", variantClasses, className)}
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
