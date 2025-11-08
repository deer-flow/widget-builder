import { cva, VariantProps } from "class-variance-authority";
import { ComponentDefinition } from "monaco-jsx-editor";
import React from "react";

import { cn } from "@/lib/utils";

import { Background, Border, variants, Padding, Radius, VariantsProps, Width } from "./variants";

const Base = cva("rounded-2xl border bg-card text-card-foreground shadow p-4 max-w-full", {
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

const Variants = variants({
  size: Width,
  padding: Padding,
  background: Background,
  border: Border,
  radius: Radius,
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof Base>,
    VariantsProps<typeof Variants> {
  children?: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, style, variant, size, padding, background, border, radius, ...props }, ref) => {
    const [variantClasses, variantStyles] = Variants.format({
      size,
      padding,
      background,
      border,
      radius,
    });
    return (
      <div
        className={cn(Base({ variant }), variantClasses, className)}
        data-widget-component="Card"
        style={{ ...style, ...variantStyles }}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

const CardDefinition: ComponentDefinition = {
  name: "Card",
  description: "A container component with customizable styling and variants.",
  props: [
    {
      name: "variant",
      type: "'default' | 'elevated' | 'outlined'",
      defaultValue: "'default'",
      description: "The variant style of the Card component.",
    },
    ...Variants.definitions,
  ],
  category: "Layout",
  usage: `<Card size="3xl" padding="md" background="sky-500" border="default" radius="md">
  <Text>This is a card component.</Text>
</Card>`,
};

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
);
CardFooter.displayName = "CardFooter";

export { Card, CardDefinition, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
