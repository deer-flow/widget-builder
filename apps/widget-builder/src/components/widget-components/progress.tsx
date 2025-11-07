import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentDefinition } from "monaco-jsx-editor";

const ProgressBase = cva("relative overflow-hidden rounded-full bg-secondary", {
  variants: {
    size: {
      sm: "h-2",
      default: "h-4",
      lg: "h-6",
    },
    variant: {
      default: "bg-secondary",
      muted: "bg-muted",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

const ProgressBarBase = cva("h-full w-full flex-1 transition-all", {
  variants: {
    color: {
      primary: "bg-primary",
      secondary: "bg-secondary-foreground",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      danger: "bg-red-500",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

export interface ProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof ProgressBase> {
  value?: number;
  max?: number;
  color?: VariantProps<typeof ProgressBarBase>["color"];
  showValue?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, size, variant, color, showValue, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div className="w-full space-y-2">
        <div className={cn(ProgressBase({ size, variant, className }))} ref={ref} {...props}>
          <div className={cn(ProgressBarBase({ color }))} style={{ transform: `translateX(-${100 - percentage}%)` }} />
        </div>
        {showValue && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{Math.round(percentage)}%</span>
            <span>
              {value}/{max}
            </span>
          </div>
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";

const ProgressDefinition: ComponentDefinition = {
  name: "Progress",
  description: "A progress bar component",
  props: [
    {
      name: "value",
      type: "number",
      required: false,
      description: "Current progress value",
      defaultValue: 0,
    },
    {
      name: "max",
      type: "number",
      required: false,
      description: "Maximum progress value",
      defaultValue: 100,
    },
    {
      name: "size",
      type: '"sm" | "default" | "lg"',
      required: false,
      description: "Progress bar size",
      defaultValue: "default",
    },
    {
      name: "color",
      type: '"primary" | "secondary" | "success" | "warning" | "danger"',
      required: false,
      description: "Progress bar color",
      defaultValue: "primary",
    },
    {
      name: "showValue",
      type: "boolean",
      required: false,
      description: "Show progress value text",
      defaultValue: false,
    },
  ],
  category: "Display",
  usage: `<Progress value={40} max={100} color="success" showValue={true} />`,
};

export { Progress, ProgressDefinition };
