import React from "react";
import { cn } from "@/lib/utils";
import { Background, Border, variants, Padding, Radius, VariantsProps } from "./variants";
import { ComponentDefinition } from "monaco-jsx-editor";

const Variants = variants({
  padding: Padding,
  background: Background,
  border: Border,
  radius: Radius,
});

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement>, VariantsProps<typeof Variants> {
  as?: React.ElementType;
}

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, children, as: Component = "div", style, padding, background, border, radius, ...props }, ref) => {
    // Merge with existing style prop
    const [variantClasses, variantStyles] = Variants.format({ padding, background, border, radius });
    return (
      <Component
        className={cn("block", variantClasses, className)}
        style={{ ...style, ...variantStyles }}
        ref={ref}
        {...props}
      />
    );
  }
);
Box.displayName = "Box";

const BoxDefinition: ComponentDefinition = {
  name: "Box",
  description: "A versatile container component with customizable styling.",
  props: Variants.definitions,
};

export { Box, BoxDefinition };
