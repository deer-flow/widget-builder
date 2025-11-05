import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const progressVariants = cva(
  "relative overflow-hidden rounded-full bg-secondary",
  {
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
  }
);

const progressBarVariants = cva("h-full w-full flex-1 transition-all", {
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
    VariantProps<typeof progressVariants> {
  value?: number;
  max?: number;
  color?: VariantProps<typeof progressBarVariants>["color"];
  showValue?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      size,
      variant,
      color,
      showValue,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div className="w-full space-y-2">
        <div
          className={cn(progressVariants({ size, variant, className }))}
          ref={ref}
          {...props}
        >
          <div
            className={cn(progressBarVariants({ color }))}
            style={{ transform: `translateX(-${100 - percentage}%)` }}
          />
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

export { Progress, progressVariants, progressBarVariants };
