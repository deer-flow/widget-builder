import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentDefinition } from "monaco-jsx-editor";
import { Height, MinHeight, MinWidth, variants, VariantsProps, Width } from "./variants";

const Base = cva("flex-1", {
  variants: {},
  defaultVariants: {},
});

const Variants = variants({
  width: Width,
  height: Height,
  minWidth: MinWidth,
  minHeight: MinHeight,
});

export interface SpacerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof Base>,
    VariantsProps<typeof Variants> {}

const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ className, style, width, height, minWidth, minHeight, ...props }, ref) => {
    const [variantClasses, variantStyles] = Variants.format({ width, height, minWidth, minHeight });
    return (
      <div
        className={cn(className, Base(), variantClasses)}
        style={{ ...style, ...variantStyles }}
        ref={ref}
        {...props}
      />
    );
  }
);

Spacer.displayName = "Spacer";

const SpacerDefinition: ComponentDefinition = {
  name: "Spacer",
  description: "Flexible space to separate content within a layout.",
  props: [...Variants.definitions],
};

export { Spacer, SpacerDefinition };
