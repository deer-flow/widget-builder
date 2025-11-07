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
  MinWidth,
  MinHeight,
} from "./variants";

const Base = cva("flex flex-col", {
  variants: {},
  defaultVariants: {},
});

const Variants = variants({
  align: Align,
  padding: Padding,
  background: Background,
  border: Border,
  radius: Radius,
  flex: Flex,
  minWidth: MinWidth,
  minHeight: MinHeight,
});

export interface ColProps extends React.HTMLAttributes<HTMLDivElement>, VariantsProps<typeof Variants> {
  children?: React.ReactNode;
}

const Col = React.forwardRef<HTMLDivElement, ColProps>(
  (
    { className, children, style, align, padding, background, border, radius, flex, minWidth, minHeight, ...props },
    ref
  ) => {
    const [variantClasses, variantStyles] = Variants.format({
      align,
      padding,
      background,
      border,
      radius,
      flex,
      minWidth,
      minHeight,
    });
    return (
      <div
        className={cn("group/col", Base(), variantClasses, className)}
        data-widget-component="Col"
        style={{ ...style, ...variantStyles }}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Col.displayName = "Col";

const ColDefinition: ComponentDefinition = {
  name: "Col",
  description: "A column flex container component with customizable styling.",
  props: Variants.definitions,
  category: "Layout",
  usage: `<Row width="lg" gap={2}>
  <Col align="center" padding="md" background="muted" border="default" radius="md" flex="1" >
    Col 1
  </Col>
  <Col align="start" padding="md" background="muted" border="default" radius="md" flex="2" >
    Col 2
  </Col>
  <Col align="end" padding="md" background="muted" border="default" radius="md" flex="1">
    Col 3
  </Col>
</Row>`,
};

export { Col, ColDefinition };
