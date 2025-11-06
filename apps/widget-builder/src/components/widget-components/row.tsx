import React from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Background, Border, variants, Padding, Radius, VariantsProps, Flex, Align, Gap } from "./variants";
import { ComponentDefinition } from "monaco-jsx-editor";

const Base = cva("flex flex-row mt-4", {
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
  gap: Gap,
});

export interface RowProps extends React.HTMLAttributes<HTMLDivElement>, VariantsProps<typeof Variants> {
  children?: React.ReactNode;
}

const Row = React.forwardRef<HTMLDivElement, RowProps>(
  ({ className, children, style, align, padding, background, border, radius, flex, gap, ...props }, ref) => {
    const [variantClasses, variantStyles] = Variants.format({ align, padding, background, border, radius, flex, gap });
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
};

export { Row, RowDefinition };
