import React from "react";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import {
  Background,
  Border,
  combine,
  Padding,
  Radius,
  VariantsProps,
} from "./props";
import { ComponentDefinition } from "monaco-jsx-editor";

const cardBase = cva("rounded-xl border bg-card text-card-foreground shadow", {
  variants: {
    variant: {
      default: "border-border",
      elevated: "border-border shadow-lg",
      outlined: "border-2 border-border shadow-none",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const combined = combine({
  padding: Padding,
  background: Background,
  border: Border,
  radius: Radius,
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardBase>,
    VariantsProps<typeof combined> {
  children?: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, style, variant, ...props }, ref) => {
    return (
      <div
        className={cn(cardBase({ variant }), combined.format(props), className)}
        style={style}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

const definition: ComponentDefinition = {
  name: "Card",
  description: "A container component with customizable styling and variants.",
  props: [
    {
      name: "variant",
      type: "'default' | 'elevated' | 'outlined'",
      defaultValue: "'default'",
      description: "The variant style of the Card component.",
    },
    ...combined.definitions,
  ],
};

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  definition,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  combined as cardVariants,
};
