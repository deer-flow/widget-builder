import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Border, BorderColor, variants, VariantsProps } from "./variants";
import { ComponentDefinition } from "monaco-jsx-editor";

const Variants = variants({
  color: BorderColor,
});

const Base = cva("border-border", {
  variants: {
    orientation: {
      horizontal: "w-full border-t",
      vertical: "h-full border-l",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export interface DividerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof Base>,
    VariantsProps<typeof Variants> {}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation, color, ...props }, ref) => {
    const [variantClasses, variantStyles] = Variants.format({ color });
    return (
      <div
        className={cn(className, Base({ orientation }), variantClasses)}
        style={variantStyles}
        ref={ref}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";

const DividerDefinition: ComponentDefinition = {
  name: "Divider",
  description:
    "A divider component to separate content with customizable styling.",
  props: [
    {
      name: "orientation",
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      description: "The orientation of the divider.",
    },
    ...Variants.definitions,
  ],
};

export { Divider, DividerDefinition };
