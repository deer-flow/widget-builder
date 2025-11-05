// Size variants
export const WidthVariant = {
  sm: "w-sm",
  md: "w-md",
  lg: "w-lg",
  xl: "w-xl",
  full: "w-full",
} as const;

export const HeightVariant = {
  sm: "h-sm",
  md: "h-md",
  lg: "h-lg",
  xl: "h-xl",
  full: "h-full",
} as const;

export interface SizingProps {
  width?: keyof typeof WidthVariant | number | string;
  height?: keyof typeof HeightVariant | number | string;
}

export const Width = {
  variant: WidthVariant,
  definition: {
    name: "width",
    type: '"sm" | "md" | "lg" | "xl" | "full" | number | string',
    required: false,
    description:
      "Width; accepts a width token, a custom px number value, or a percentage string.",
  },
  format: (width: SizingProps["width"]): string => {
    if (width === undefined) return "";

    if (typeof width === "number") {
      return `w-[${width}px]`;
    }

    if (typeof width === "string") {
      // Check if it's a percentage value
      if (width.endsWith("%")) {
        return `w-[${width}]`;
      }

      // Check if it's a predefined variant
      if (Width.variant.hasOwnProperty(width)) {
        return Width.variant[width as keyof typeof Width.variant];
      }
    }

    return "";
  },
};

export const Height = {
  variant: HeightVariant,
  definition: {
    name: "height",
    type: '"sm" | "md" | "lg" | "xl" | "full" | number | string',
    required: false,
    description:
      "Height; accepts a height token, a custom px number value, or a percentage string.",
  },
  format: (height: SizingProps["height"]): string => {
    if (height === undefined) return "";

    if (typeof height === "number") {
      return `h-[${height}px]`;
    }

    if (typeof height === "string") {
      // Check if it's a percentage value
      if (height.endsWith("%")) {
        return `h-[${height}]`;
      }

      // Check if it's a predefined variant
      if (Height.variant.hasOwnProperty(height)) {
        return Height.variant[height as keyof typeof Height.variant];
      }
    }

    return "";
  },
};
