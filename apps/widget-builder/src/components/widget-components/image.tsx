import { cva, type VariantProps } from "class-variance-authority";
import { ComponentDefinition } from "monaco-jsx-editor";
import React from "react";

import { cn } from "@/lib/utils";

import { variants, Margin, Radius, Size, VariantsProps, Hidden } from "./variants";

const Base = cva("object-cover", {
  variants: {
    fit: {
      cover: "object-cover",
      contain: "object-contain",
      fill: "object-fill",
      "scale-down": "object-scale-down",
    },
    aspect: {
      auto: "aspect-auto",
      square: "aspect-square",
      video: "aspect-video",
      "4/3": "aspect-[4/3]",
      "3/2": "aspect-[3/2]",
    },
    position: {
      center: "object-center",
      top: "object-top",
      bottom: "object-bottom",
      left: "object-left",
      right: "object-right",
    },
  },
  defaultVariants: {
    fit: "cover",
    aspect: "auto",
    position: "center",
  },
});

const Variants = variants({
  radius: Radius,
  margin: Margin,
  size: Size,
  hidden: Hidden,
});

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "hidden">,
    VariantProps<typeof Base>,
    VariantsProps<typeof Variants> {
  fallback?: React.ReactNode;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, style, fit, aspect, position, fallback, radius, margin, size, hidden, onError, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    // Return null if hidden is true
    if (hidden) {
      return null;
    }

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setImageError(true);
      onError?.(e);
    };

    const [variantClasses, variantStyles] = Variants.format({ radius, margin, size });

    if (imageError && fallback) {
      return (
        <div
          className={cn(
            "flex items-center justify-center bg-muted",
            Base({ fit, aspect, position, className }),
            variantClasses
          )}
          style={{ ...style, ...variantStyles }}
        >
          {fallback}
        </div>
      );
    }

    return (
      <img
        className={cn(Base({ fit, aspect, position, className }), variantClasses)}
        style={{ ...style, ...variantStyles }}
        ref={ref}
        onError={handleError}
        {...props}
      />
    );
  }
);
Image.displayName = "Image";

const ImageDefinition: ComponentDefinition = {
  name: "Image",
  description: "An image component with customizable object fit, aspect ratio, and error fallback.",
  props: [
    {
      name: "src",
      type: "string",
      description: "The source URL of the image.",
      required: true,
    },
    {
      name: "fit",
      type: "'cover' | 'contain' | 'fill' | 'scale-down'",
      defaultValue: "'cover'",
      description: "Defines how the image should fit within its container.",
    },
    {
      name: "position",
      type: "'center' | 'top' | 'bottom' | 'left' | 'right'",
      defaultValue: "'center'",
      description: "Sets the position of the image within its container.",
    },
    {
      name: "aspect",
      type: "'auto' | 'square' | 'video' | '4/3' | '3/2'",
      defaultValue: "'auto'",
      description: "Sets the aspect ratio of the image.",
    },
    {
      name: "fallback",
      type: "React.ReactNode",
      description: "Content to display if the image fails to load.",
    },
    ...Variants.definitions,
  ],
  category: "Display",
  usage: `<Image 
  src="https://picsum.photos/200/200" 
  fit="contain" 
  position="top" 
  radius="md" 
  size={200} 
  margin="sm" 
/>`,
};

export { Image, ImageDefinition };
