import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const imageVariants = cva("object-cover", {
  variants: {
    fit: {
      cover: "object-cover",
      contain: "object-contain",
      fill: "object-fill",
      "scale-down": "object-scale-down",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
    },
    aspect: {
      auto: "aspect-auto",
      square: "aspect-square",
      video: "aspect-video",
      "4/3": "aspect-[4/3]",
      "3/2": "aspect-[3/2]",
    },
  },
  defaultVariants: {
    fit: "cover",
    rounded: "md",
    aspect: "auto",
  },
});

export interface ImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof imageVariants> {
  fallback?: React.ReactNode;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, fit, rounded, aspect, fallback, onError, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setImageError(true);
      onError?.(e);
    };

    if (imageError && fallback) {
      return (
        <div
          className={cn(
            "flex items-center justify-center bg-muted",
            imageVariants({ fit, rounded, aspect, className })
          )}
        >
          {fallback}
        </div>
      );
    }

    return (
      <img
        className={cn(imageVariants({ fit, rounded, aspect, className }))}
        ref={ref}
        onError={handleError}
        {...props}
      />
    );
  }
);
Image.displayName = "Image";

export { Image, imageVariants };
