import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const listVariants = cva("space-y-1", {
  variants: {
    variant: {
      default: "space-y-1",
      compact: "space-y-0",
      spaced: "space-y-2",
    },
    divided: {
      true: "divide-y divide-border",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    divided: false,
  },
});

const listItemVariants = cva("flex items-center", {
  variants: {
    variant: {
      default: "py-2",
      compact: "py-1",
      comfortable: "py-3",
    },
    interactive: {
      true: "cursor-pointer hover:bg-muted/50 rounded-md px-2 transition-colors",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    interactive: false,
  },
});

export interface ListProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof listVariants> {
  as?: "ul" | "ol" | "div";
}

export interface ListItemProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof listItemVariants> {
  as?: "li" | "div";
}

const List = React.forwardRef<HTMLElement, ListProps>(
  ({ className, variant, divided, as: Component = "ul", ...props }, ref) => {
    return (
      <Component
        className={cn(listVariants({ variant, divided, className }))}
        ref={ref as any}
        {...props}
      />
    );
  }
);
List.displayName = "List";

const ListItem = React.forwardRef<HTMLElement, ListItemProps>(
  (
    { className, variant, interactive, as: Component = "li", ...props },
    ref
  ) => {
    return (
      <Component
        className={cn(listItemVariants({ variant, interactive, className }))}
        ref={ref as any}
        {...props}
      />
    );
  }
);
ListItem.displayName = "ListItem";

export { List, ListItem, listVariants, listItemVariants };
