import React from "react";
import { cn } from "@/lib/utils";
import {
  variants,
  FontSize,
  FontWeight,
  TextAlign,
  TextColor,
  Truncate,
  VariantsProps,
} from "./variants";

const Variants = variants({
  size: FontSize,
  weight: FontWeight,
  color: TextColor,
  textAlign: TextAlign,
  truncate: Truncate,
});

const VariantsDefault = {
  size: "md",
  weight: "normal",
  color: "secondary",
  textAlign: "start",
  truncate: false,
} as const;

export interface CaptionProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantsProps<typeof Variants> {
  as?: React.ElementType;
}

const Caption = React.forwardRef<HTMLSpanElement, CaptionProps>(
  (
    {
      className,
      children,
      style,
      as: Component = "span",
      size,
      weight,
      color,
      textAlign,
      truncate,
      ...props
    },
    ref
  ) => {
    const [variantClasses, variantStyles] = Variants.format({
      ...VariantsDefault,
      size,
      weight,
      color,
      textAlign,
      truncate,
    });
    return (
      <Component
        className={cn("leading-relaxed", variantClasses, className)}
        style={{ ...style, ...variantStyles }}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Caption.displayName = "Caption";

const CaptionDefinition = {
  name: "Caption",
  description:
    "A text component for displaying captions with customizable styling.",
  props: Variants.definitions,
};

export { Caption, CaptionDefinition };
