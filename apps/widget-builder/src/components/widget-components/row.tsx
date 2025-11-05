import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Variants,
  processCommonStylingProps,
  type CommonStylingProps,
  type FlexProps,
} from "./props";

const rowVariants = cva("flex flex-row", {
  variants: {
    align: Variants.align,
    justify: Variants.justify,
    wrap: Variants.wrap,
    gap: Variants.gap,
    padding: Variants.padding,
    radius: Variants.radius,
    background: Variants.background,
  },
  defaultVariants: {
    align: undefined,
    justify: undefined,
    wrap: "nowrap",
    gap: 0,
    padding: "none",
    radius: "none",
    background: "none",
  },
});

export interface RowProps
  extends React.HTMLAttributes<HTMLDivElement>,
    CommonStylingProps,
    FlexProps {
  children?: React.ReactNode;
}

const Row = React.forwardRef<HTMLDivElement, RowProps>(
  ({ className, children, style, ...props }, ref) => {
    // Process common styling props using the shared utility
    const { additionalClasses, inlineStyles, restProps } =
      processCommonStylingProps(props);

    // Merge with existing style prop
    const mergedStyles = { ...inlineStyles, ...style };

    return (
      <div
        className={cn(additionalClasses.join(" "), className)}
        style={Object.keys(mergedStyles).length > 0 ? mergedStyles : undefined}
        ref={ref}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

Row.displayName = "Row";

export { Row, rowVariants };
