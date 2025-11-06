import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentDefinition } from "monaco-jsx-editor";

const Base = cva("font-semibold text-foreground", {
  variants: {
    level: {
      h1: "text-4xl lg:text-5xl",
      h2: "text-3xl lg:text-4xl",
      h3: "text-2xl lg:text-3xl",
      h4: "text-xl lg:text-2xl",
      h5: "text-lg lg:text-xl",
      h6: "text-base lg:text-lg",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    level: "h3",
    weight: "semibold",
  },
});

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof Base> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
}

const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, level, weight, as, children, ...props }, ref) => {
    const Component = as || level || "h3"; // Default to h3 if no level or as prop is provided);

    return (
      <Component className={cn(Base({ level, weight, className }))} ref={ref} {...props}>
        {children}
      </Component>
    );
  }
);
Title.displayName = "Title";

const TitleDefinition: ComponentDefinition = {
  name: "Title",
  description: "A title component with customizable levels and styles.",
  props: [
    {
      name: "level",
      type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6"',
      description: "The level of the title, determining its size.",
      defaultValue: '"h3"',
    },
    {
      name: "weight",
      type: '"normal" | "medium" | "semibold" | "bold"',
      description: "The font weight of the title.",
      defaultValue: '"semibold"',
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "The content of the title.",
    },
  ],
};

export { Title, TitleDefinition };
