import React from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
  Background,
  Border,
  combine,
  Padding,
  Radius,
  VariantsProps,
  Flex,
} from "./props";
import { ComponentDefinition } from "monaco-jsx-editor";

const colBase = cva("flex flex-col", {
  variants: {},
  defaultVariants: {},
});

const combined = combine({
  padding: Padding,
  background: Background,
  border: Border,
  radius: Radius,
  flex: Flex,
});

export interface ColProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantsProps<typeof combined> {
  children?: React.ReactNode;
}

const Col = React.forwardRef<HTMLDivElement, ColProps>(
  ({ className, children, style, ...props }, ref) => {
    return (
      <div
        className={cn(colBase(), combined.format(props), className)}
        style={style}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Col.displayName = "Col";

const definition: ComponentDefinition = {
  name: "Col",
  description: "A column flex container component with customizable styling.",
  props: combined.definitions,
};

export { Col, definition };
