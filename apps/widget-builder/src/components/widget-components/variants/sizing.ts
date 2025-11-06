// Size variants
// Canonical sizing tokens (no prefixes)
export const SizingVariant = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  full: "full",
} as const;

export const WidthVariant = {
  ...SizingVariant,
  auto: "auto",
} as const;

export const HeightVariant = {
  ...SizingVariant,
  auto: "auto",
} as const;

export const MinWidthVariant = {
  ...SizingVariant,
  auto: "auto",
};

export const MinHeightVariant = {
  ...SizingVariant,
  auto: "auto",
};

export interface SizingProps {
  width?: keyof typeof WidthVariant | number | `${number}%`;
  height?: keyof typeof HeightVariant | number | `${number}%`;
  minWidth?: keyof typeof MinWidthVariant | number | `${number}%`;
  minHeight?: keyof typeof MinHeightVariant | number | `${number}%`;
}

export const Width = {
  variant: WidthVariant,
  definition: {
    name: "width",
    type: '"sm" | "md" | "lg" | "xl" | "xs" | "auto" | "full" | number | `${number}%`',
    required: false,
    description: "Width; accepts a width token, a custom px number value, or a percentage string.",
  },
  format: (width: SizingProps["width"]): string | [string, React.CSSProperties] => {
    if (width === undefined) return "";

    if (typeof width === "number") {
      return ["", { width: `${width}px` }];
    }

    if (typeof width === "string") {
      // Check if it's a percentage value
      if (width.endsWith("%")) {
        return ["", { width }];
      }

      // Check if it's a WidthVariant token
      if (WidthVariant.hasOwnProperty(width)) {
        return [`w-${WidthVariant[width as keyof typeof WidthVariant]}`, {}];
      }
    }

    return "";
  },
};

export const MinWidth = {
  variant: MinWidthVariant,
  definition: {
    name: "minWidth",
    type: '"auto" | "full" | "xs" | "sm" | "md" | "lg" | "xl" | number | `${number}%`',
    required: false,
    description: "Minimum Width; accepts a min-width token, a custom px number value, or a percentage string.",
  },
  format: (minWidth: SizingProps["minWidth"]): string | [string, React.CSSProperties] => {
    if (minWidth === undefined) return "";

    const styles: React.CSSProperties = {};
    const classnames: string[] = [];

    if (typeof minWidth === "number") {
      styles.minWidth = `${minWidth}px`;
    }

    if (typeof minWidth === "string") {
      // Check if it's a percentage value
      if (minWidth.endsWith("%")) {
        styles.minWidth = minWidth;
      } else if (MinWidth.variant.hasOwnProperty(minWidth)) {
        classnames.push(`min-w-${MinWidth.variant[minWidth as keyof typeof MinWidth.variant]}`);
      }
    }

    return [classnames.join(" "), styles];
  },
};

export const Height = {
  variant: HeightVariant,
  definition: {
    name: "height",
    type: '"xs" | "sm" | "md" | "lg" | "xl" | "auto" | "full" | number | `${number}%`',
    required: false,
    description: "Height; accepts a height token, a custom px number value, or a percentage string.",
  },
  format: (height: SizingProps["height"]): string | [string, React.CSSProperties] => {
    if (height === undefined) return "";

    if (typeof height === "number") {
      return ["", { height: `${height}px` }];
    }

    if (typeof height === "string") {
      // Check if it's a percentage value
      if (height.endsWith("%")) {
        return ["", { height }];
      }

      // Check if it's a SizingVariant token
      if (HeightVariant.hasOwnProperty(height)) {
        return [`h-${HeightVariant[height as keyof typeof HeightVariant]}`, {}];
      }
    }

    return "";
  },
};

export const MinHeight = {
  variant: MinHeightVariant,
  definition: {
    name: "minHeight",
    type: '"auto" | "full" | "xs" | "sm" | "md" | "lg" | "xl" | number | `${number}%`',
    required: false,
    description: "Minimum Height; accepts a min-height token, a custom px number value, or a percentage string.",
  },
  format: (minHeight: SizingProps["minHeight"]): string | [string, React.CSSProperties] => {
    if (minHeight === undefined) return "";

    if (typeof minHeight === "number") {
      return ["", { minHeight: `${minHeight}px` }];
    }

    if (typeof minHeight === "string") {
      // Check if it's a percentage value
      if (minHeight.endsWith("%")) {
        return ["", { minHeight }];
      }

      // Fallback to predefined variant for compatibility
      if (MinHeight.variant.hasOwnProperty(minHeight)) {
        return [`min-h-${MinHeight.variant[minHeight as keyof typeof MinHeight.variant]}`, {}];
      }
    }

    return "";
  },
};

export const SizeVariant = {
  ...SizingVariant,
} as const;

export const Size = {
  variant: SizeVariant,
  definition: {
    name: "size",
    type: '"xs" | "sm" | "md" | "lg" | "xl" | "full" | number | `${number}%`',
    required: false,
    description: "Size; sets both width and height.",
  },
  format: (size: keyof typeof SizingVariant | number | `${number}%`): string | [string, React.CSSProperties] => {
    if (typeof size === "number") {
      return ["", { width: `${size}px`, height: `${size}px` }];
    }

    if (typeof size === "string") {
      // Check if it's a percentage value
      if (size.endsWith("%")) {
        return ["", { width: size, height: size }];
      }

      // Check if it's a SizingVariant token
      if (SizeVariant.hasOwnProperty(size)) {
        const token = SizeVariant[size as keyof typeof SizeVariant];
        return [`w-${token} h-${token}`, {}];
      }
    }

    return "";
  },
};
