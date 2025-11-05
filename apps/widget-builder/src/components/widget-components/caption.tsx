import React from "react";
import { cn } from "@/lib/utils";
import {
  combine,
  FontSize,
  FontWeight,
  TextAlign,
  TextColor,
  Truncate,
  VariantsProps,
} from "./props";

const combined = combine({
  size: FontSize,
  weight: FontWeight,
  color: TextColor,
  textAlign: TextAlign,
  truncate: Truncate,
});

const defaultVariants = {
  size: "md",
  weight: "normal",
  color: "secondary",
  textAlign: "start",
  truncate: false,
} as const;

export interface CaptionProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantsProps<typeof combined> {
  as?: React.ElementType;
}

const Caption = React.forwardRef<HTMLSpanElement, CaptionProps>(
  ({ className, children, style, as: Component = "span", ...props }, ref) => {
    // Build additional classes for properties not handled by variants
    const inlineStyles: React.CSSProperties = {};

    // Merge with existing style prop
    const mergedStyles = { ...inlineStyles, ...style };

    return (
      <Component
        className={cn(
          "leading-relaxed",
          combined.format({ ...defaultVariants, ...props }),
          className
        )}
        style={Object.keys(mergedStyles).length > 0 ? mergedStyles : undefined}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Caption.displayName = "Caption";

const definition = {
  name: "Caption",
  description:
    "A text component for displaying captions with customizable styling.",
  props: combined.definitions,
};

export { Caption, definition };
