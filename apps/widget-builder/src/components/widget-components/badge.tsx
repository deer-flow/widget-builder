import { cva, type VariantProps } from "class-variance-authority";
import { ComponentDefinition } from "monaco-jsx-editor";
import React from "react";

import { cn } from "@/lib/utils";

const Base = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        success: "border-transparent bg-green-500 text-white hover:bg-green-500/80",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-500/80",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof Base> {
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, variant, size, ...props }, ref) => {
  return <div className={cn(Base({ variant, size, className }))} ref={ref} {...props} />;
});
Badge.displayName = "Badge";

const BadgeDefinition: ComponentDefinition = {
  name: "Badge",
  description: "A badge component for displaying status or notifications.",
  props: [
    {
      name: "variant",
      type: "'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'",
      defaultValue: "default",
      description: "The visual style of the badge.",
    },
    {
      name: "size",
      type: "'sm' | 'default' | 'lg'",
      defaultValue: "default",
      description: "The size of the badge.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Content to display inside the badge.",
    },
  ],
  category: "Display",
  usage: `<Badge variant="success" size="lg">New</Badge>`,
};

export { Badge, BadgeDefinition };
