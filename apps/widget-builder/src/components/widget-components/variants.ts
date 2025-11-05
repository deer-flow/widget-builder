// Common variant definitions that can be reused across components
export const Variants = {
  // Text size variants
  textSize: {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  },

  // Font weight variants
  fontWeight: {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  },

  // Text alignment variants
  textAlign: {
    start: "text-start",
    center: "text-center",
    end: "text-end",
    left: "text-left",
    right: "text-right",
  },

  // Text color variants
  textColor: {
    prose: "text-foreground",
    primary: "text-primary",
    emphasis: "text-foreground",
    secondary: "text-muted-foreground",
    tertiary: "text-muted-foreground/60",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600",
  },

  // Font size variants
  fontSize: {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
    "6xl": "text-6xl",
    "7xl": "text-7xl",
    "8xl": "text-8xl",
    "9xl": "text-9xl",
  },

  size: {
    sm: "w-sm",
    md: "w-md",
    lg: "w-lg",
    xl: "w-xl",
    full: "w-full",
  },
  // Spacing variants
  spacing: {
    none: "0",
    xs: "1",
    sm: "2",
    md: "4",
    lg: "6",
    xl: "8",
    "2xl": "10",
    "3xl": "12",
  },

  // Gap variants
  gap: {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8",
    10: "gap-10",
    12: "gap-12",
  },

  // Padding variants
  padding: {
    none: "p-0",
    xs: "p-1",
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
    "2xl": "p-10",
    "3xl": "p-12",
  },

  // Margin variants
  margin: {
    none: "m-0",
    xs: "m-1",
    sm: "m-2",
    md: "m-4",
    lg: "m-6",
    xl: "m-8",
    "2xl": "m-10",
    "3xl": "m-12",
  },

  // Border radius variants
  radius: {
    none: "rounded-none",
    "2xs": "rounded-sm",
    xs: "rounded",
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
    "2xl": "rounded-3xl",
    "3xl": "rounded-[1.5rem]",
    "4xl": "rounded-[2rem]",
    full: "rounded-full",
    "100%": "rounded-full",
  },

  // Background variants
  background: {
    none: "bg-transparent",
    surface: "bg-background",
    "surface-secondary": "bg-muted",
    "surface-tertiary": "bg-muted/50",
    "surface-elevated": "bg-card",
    "surface-elevated-secondary": "bg-accent",
  },

  // Flexbox alignment variants
  align: {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    baseline: "items-baseline",
    stretch: "items-stretch",
  },

  // Flexbox justify variants
  justify: {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    stretch: "justify-stretch",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  },

  // Flex wrap variants
  wrap: {
    nowrap: "flex-nowrap",
    wrap: "flex-wrap",
    "wrap-reverse": "flex-wrap-reverse",
  },
};

// Common sizing type definitions
export type SpacingValue = string | number;
export type SizingValue = string | number;

// Helper function to convert spacing units to Tailwind classes
export const getSpacingClass = (
  value: SpacingValue | undefined,
  prefix: string
): string => {
  if (value === undefined) return "";

  if (typeof value === "number") {
    // Convert pixel values to arbitrary values
    return `${prefix}-[${value}px]`;
  }

  if (typeof value === "string") {
    // Check if it's a predefined spacing unit
    const spacingUnits = [
      "0",
      "px",
      "0.5",
      "1",
      "1.5",
      "2",
      "2.5",
      "3",
      "3.5",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "14",
      "16",
      "20",
      "24",
      "28",
      "32",
      "36",
      "40",
      "44",
      "48",
      "52",
      "56",
      "60",
      "64",
      "72",
      "80",
      "96",
    ];

    if (spacingUnits.includes(value)) {
      return `${prefix}-${value}`;
    }

    // Handle fractional values like "1/2", "1/3", etc.
    if (/^\d+\/\d+$/.test(value)) {
      return `${prefix}-${value}`;
    }

    // Otherwise treat as arbitrary CSS value
    return `${prefix}-[${value}]`;
  }

  return "";
};

// Helper function to handle border styles
export const getBorderClass = (border: number | object | undefined): string => {
  if (border === undefined) return "";

  if (typeof border === "number") {
    return `border-[${border}px]`;
  }

  if (typeof border === "object") {
    // Handle border object with width, color, style properties
    const borderObj = border as Record<string, any>;
    const classes: string[] = [];

    if (borderObj.width !== undefined) {
      if (typeof borderObj.width === "number") {
        classes.push(`border-[${borderObj.width}px]`);
      } else {
        classes.push(`border-${borderObj.width}`);
      }
    } else {
      classes.push("border");
    }

    if (borderObj.color) {
      classes.push(`border-${borderObj.color}`);
    }

    if (borderObj.style) {
      classes.push(`border-${borderObj.style}`);
    }

    return classes.join(" ");
  }

  return "";
};

// Helper function to handle margin/padding objects
export const getMarginPaddingClass = (
  value: SpacingValue | object | undefined,
  type: "margin" | "padding"
): string => {
  if (value === undefined) return "";

  const prefix = type === "margin" ? "m" : "p";

  if (typeof value === "string" || typeof value === "number") {
    return getSpacingClass(value, prefix);
  }

  if (typeof value === "object") {
    // Handle object with top, right, bottom, left properties
    const obj = value as Record<string, SpacingValue>;
    const classes: string[] = [];

    if (obj.top !== undefined)
      classes.push(getSpacingClass(obj.top, `${prefix}t`));
    if (obj.right !== undefined)
      classes.push(getSpacingClass(obj.right, `${prefix}r`));
    if (obj.bottom !== undefined)
      classes.push(getSpacingClass(obj.bottom, `${prefix}b`));
    if (obj.left !== undefined)
      classes.push(getSpacingClass(obj.left, `${prefix}l`));
    if (obj.x !== undefined) classes.push(getSpacingClass(obj.x, `${prefix}x`));
    if (obj.y !== undefined) classes.push(getSpacingClass(obj.y, `${prefix}y`));

    return classes.join(" ");
  }

  return "";
};

// Helper function to handle text color
export const getTextColorClass = (
  color: string | object | undefined
): string => {
  if (color === undefined) return "";

  if (typeof color === "string") {
    // Check if it's a text color token
    const textColorTokens = [
      "prose",
      "primary",
      "emphasis",
      "secondary",
      "tertiary",
      "success",
      "warning",
      "danger",
    ];

    if (textColorTokens.includes(color)) {
      return ""; // Will be handled by variants
    }

    // Check if it's a primitive color token (e.g., red-100, blue-900)
    if (/^[a-z]+-\d+$/.test(color)) {
      return `text-${color}`;
    }

    // Check for CSS color values
    if (
      /^#[0-9a-fA-F]+$/.test(color) ||
      /^rgb\(/.test(color) ||
      /^rgba\(/.test(color) ||
      /^hsl\(/.test(color) ||
      /^hsla\(/.test(color)
    ) {
      return `text-[${color}]`;
    }

    // Otherwise treat as arbitrary CSS value
    return `text-[${color}]`;
  }

  if (typeof color === "object") {
    // Handle theme-aware { light, dark } object
    const themeObj = color as { light?: string; dark?: string };
    if (themeObj.light || themeObj.dark) {
      // For now, use light value or fall back to first available
      const colorValue = themeObj.light || themeObj.dark;
      if (colorValue) {
        return getTextColorClass(colorValue);
      }
    }
    return "";
  }

  return "";
};

// Helper function to handle background colors
export const getBackgroundClass = (
  background: string | object | undefined
): string => {
  if (background === undefined) return "";

  if (typeof background === "string") {
    // Check if it's a surface color token
    const surfaceTokens = [
      "surface",
      "surface-secondary",
      "surface-tertiary",
      "surface-elevated",
      "surface-elevated-secondary",
    ];

    if (surfaceTokens.includes(background)) {
      return ""; // Will be handled by variants
    }

    // Check if it's a primitive color token (e.g., red-100, blue-900)
    if (/^[a-z]+-\d+$/.test(background)) {
      return `bg-${background}`;
    }

    // Check for CSS color values
    if (
      /^#[0-9a-fA-F]+$/.test(background) ||
      /^rgb\(/.test(background) ||
      /^rgba\(/.test(background) ||
      /^hsl\(/.test(background) ||
      /^hsla\(/.test(background)
    ) {
      return `bg-[${background}]`;
    }

    // Otherwise treat as arbitrary CSS value
    return `bg-[${background}]`;
  }

  if (typeof background === "object") {
    // Handle theme-aware { light, dark } object
    // This would need theme context implementation
    const themeObj = background as { light?: string; dark?: string };
    if (themeObj.light || themeObj.dark) {
      // For now, use light value or fall back to first available
      const color = themeObj.light || themeObj.dark;
      if (color) {
        return getBackgroundClass(color);
      }
    }
    return "";
  }

  return "";
};

// Helper function to handle sizing properties
export const getSizingClass = (
  value: SizingValue | undefined,
  property:
    | "width"
    | "height"
    | "min-width"
    | "min-height"
    | "max-width"
    | "max-height"
): string => {
  if (value === undefined) return "";

  if (typeof value === "string" && Variants.size.hasOwnProperty(value)) {
    return Variants.size[value as keyof typeof Variants.size];
  }

  const prefixMap = {
    width: "w",
    height: "h",
    "min-width": "min-w",
    "min-height": "min-h",
    "max-width": "max-w",
    "max-height": "max-h",
  };

  const prefix = prefixMap[property];
  return getSpacingClass(value, prefix);
};

// Helper function to handle flex properties
export const getFlexClass = (flex: string | number | undefined): string => {
  if (flex === undefined) return "";

  if (typeof flex === "number") {
    return `flex-[${flex}]`;
  }

  if (typeof flex === "string") {
    // Handle common flex values
    const commonFlexValues = {
      "1": "flex-1",
      auto: "flex-auto",
      initial: "flex-initial",
      none: "flex-none",
    };

    if (commonFlexValues[flex as keyof typeof commonFlexValues]) {
      return commonFlexValues[flex as keyof typeof commonFlexValues];
    }

    return `flex-[${flex}]`;
  }

  return "";
};

// Common prop types that can be extended by components
export interface CommonStylingProps {
  size?: keyof typeof Variants.size | string | number;
  gap?: keyof typeof Variants.gap | string | number;
  padding?: keyof typeof Variants.padding | string | number | object;
  margin?: keyof typeof Variants.margin | string | number | object;
  radius?: keyof typeof Variants.radius;
  background?: keyof typeof Variants.background | string | object;
  border?: number | object;
  width?: SizingValue;
  height?: SizingValue;
  minWidth?: SizingValue;
  minHeight?: SizingValue;
  minSize?: SizingValue;
  maxWidth?: SizingValue;
  maxHeight?: SizingValue;
  maxSize?: SizingValue;
  aspectRatio?: string | number;
}

export interface FlexProps {
  align?: keyof typeof Variants.align;
  justify?: keyof typeof Variants.justify;
  wrap?: keyof typeof Variants.wrap;
  flex?: string | number;
}

// Utility function to process common styling props
export const processCommonStylingProps = (
  props: CommonStylingProps & FlexProps
) => {
  const {
    gap,
    padding,
    margin,
    border,
    background,
    width,
    height,
    size,
    minWidth,
    minHeight,
    minSize,
    maxWidth,
    maxHeight,
    maxSize,
    aspectRatio,
    flex,
    ...restProps
  } = props;

  const additionalClasses: string[] = [];
  const inlineStyles: React.CSSProperties = {};

  // Handle flex
  if (flex !== undefined) {
    additionalClasses.push(getFlexClass(flex));
  }

  // Handle gap if it's not a predefined variant
  if (
    gap !== undefined &&
    typeof gap === "string" &&
    !Variants.gap.hasOwnProperty(gap)
  ) {
    additionalClasses.push(getSpacingClass(gap, "gap"));
  }

  // Handle sizing
  if (size !== undefined) {
    const sizeClass = getSizingClass(size, "width");
    additionalClasses.push(sizeClass);
  } else {
    if (width !== undefined) {
      additionalClasses.push(getSizingClass(width, "width"));
    }
    if (height !== undefined) {
      additionalClasses.push(getSizingClass(height, "height"));
    }
  }

  // Handle min sizing
  if (minSize !== undefined) {
    const minSizeClass = getSizingClass(minSize, "min-width");
    additionalClasses.push(minSizeClass);
    additionalClasses.push(minSizeClass.replace("min-w-", "min-h-"));
  } else {
    if (minWidth !== undefined) {
      additionalClasses.push(getSizingClass(minWidth, "min-width"));
    }
    if (minHeight !== undefined) {
      additionalClasses.push(getSizingClass(minHeight, "min-height"));
    }
  }

  // Handle max sizing
  if (maxSize !== undefined) {
    const maxSizeClass = getSizingClass(maxSize, "max-width");
    additionalClasses.push(maxSizeClass);
    additionalClasses.push(maxSizeClass.replace("max-w-", "max-h-"));
  } else {
    if (maxWidth !== undefined) {
      additionalClasses.push(getSizingClass(maxWidth, "max-width"));
    }
    if (maxHeight !== undefined) {
      additionalClasses.push(getSizingClass(maxHeight, "max-height"));
    }
  }

  // Handle margin
  if (margin !== undefined) {
    additionalClasses.push(getMarginPaddingClass(margin, "margin"));
  }

  // Handle padding if it's not a predefined variant
  if (
    padding !== undefined &&
    typeof padding === "string" &&
    !Variants.padding.hasOwnProperty(padding)
  ) {
    additionalClasses.push(getMarginPaddingClass(padding, "padding"));
  }

  // Handle border
  if (border !== undefined) {
    additionalClasses.push(getBorderClass(border));
  }

  // Handle background if it's not a predefined variant
  if (
    background !== undefined &&
    typeof background === "string" &&
    !Variants.background.hasOwnProperty(background)
  ) {
    additionalClasses.push(getBackgroundClass(background));
  }

  // Handle aspect ratio
  if (aspectRatio !== undefined) {
    inlineStyles.aspectRatio =
      typeof aspectRatio === "number" ? aspectRatio.toString() : aspectRatio;
  }

  return {
    additionalClasses: additionalClasses.filter(Boolean),
    inlineStyles,
    restProps,
  };
};
