import { cva } from "class-variance-authority";
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
  Flex,
  Align,
  Gap,
  Width,
  Height,
  Size,
  Justify,
  Grow,
  Shrink,
  Margin,
} from "./variants";

const Base = cva("flex flex-row", {
  variants: {},
  defaultVariants: {},
});

const Variants = variants({
  flex: Flex,
  align: Align,
  justify: Justify,
  margin: Margin,
  padding: Padding,
  grow: Grow,
  shrink: Shrink,
  background: Background,
  border: Border,
  radius: Radius,
  gap: Gap,
  width: Width,
  height: Height,
  size: Size,
});

export interface RowProps extends React.HTMLAttributes<HTMLDivElement>, VariantsProps<typeof Variants> {
  children?: React.ReactNode;
}

const Row = React.forwardRef<HTMLDivElement, RowProps>(
  (
    {
      className,
      children,
      style,
      align,
      justify,
      grow,
      shrink,
      margin,
      padding,
      background,
      border,
      radius,
      flex,
      gap,
      width,
      height,
      size,
      ...props
    },
    ref
  ) => {
    const [variantClasses, variantStyles] = Variants.format({
      align,
      justify,
      margin,
      padding,
      grow,
      shrink,
      background,
      border,
      radius,
      flex,
      gap,
      width,
      height,
      size,
    });
    return (
      <div
        className={cn("group/row", Base(), variantClasses, className)}
        data-widget-component="Row"
        style={{ ...style, ...variantStyles }}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Row.displayName = "Row";

const RowDefinition: ComponentDefinition = {
  name: "Row",
  description: "A row flex container component with customizable styling.",
  props: Variants.definitions,
  category: "Layout",
  usage: `<Row width="lg" gap={4} align="center">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</Row>`,
};

export { Row, RowDefinition };
