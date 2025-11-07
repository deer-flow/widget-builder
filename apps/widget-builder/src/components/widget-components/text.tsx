import { cva, type VariantProps } from "class-variance-authority";
import { ComponentDefinition } from "monaco-jsx-editor";
import React from "react";

import { cn } from "@/lib/utils";

import { FontSize, FontWeight, Truncate, variants, VariantsProps } from "./variants";

const Base = cva("text-foreground", {
  variants: {
    variant: {
      body: "text-sm",
      label: "text-sm font-medium",
      caption: "text-xs text-muted-foreground",
      muted: "text-sm text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

const Variants = variants({
  size: FontSize,
  weight: FontWeight,
  truncate: Truncate,
});

export interface TextProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof Base>,
    VariantsProps<typeof Variants> {
  as?: React.ElementType;
  children: React.ReactNode;
}

const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  ({ className, variant, as: Component = "span", style, size, weight, truncate, ...props }, ref) => {
    const [variantClasses, variantStyles] = Variants.format({ size, weight, truncate });
    return (
      <Component
        className={cn(Base({ variant, className }), variantClasses)}
        style={{ ...variantStyles, ...style }}
        ref={ref}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";

const TextDefinition: ComponentDefinition = {
  name: "Text",
  description: "A text component with customizable variants and styles.",
  props: [
    {
      name: "variant",
      type: "'body' | 'label' | 'caption' | 'muted'",
      defaultValue: "body",
      description: "The variant style of the text.",
    },
    ...Variants.definitions,
  ],
  category: "Typography",
  usage: `<Text variant="label" size="lg" weight="bold" truncate={true}>
  This is a label text.
</Text>`,
};
export { Text, TextDefinition };
