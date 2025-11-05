import React from "react";
import { cn } from "@/lib/utils";
import {
  Background,
  Border,
  combine,
  Padding,
  Radius,
  VariantsProps,
} from "./props";
import { ComponentDefinition } from "monaco-jsx-editor";

const combined = combine({
  padding: Padding,
  background: Background,
  border: Border,
  radius: Radius,
});

export interface BoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantsProps<typeof combined> {
  as?: React.ElementType;
}

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, children, as: Component = "div", style, ...props }, ref) => {
    // Merge with existing style prop

    return (
      <Component
        className={cn("block", combined.format(props), className)}
        style={style}
        ref={ref}
        {...props}
      />
    );
  }
);
Box.displayName = "Box";

const definition: ComponentDefinition = {
  name: "Box",
  description: "A versatile container component with customizable styling.",
  props: combined.definitions,
};

export { Box, definition };
