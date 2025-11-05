// Font size variants
export const FontSizeVariant = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-md",
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
} as const;

// Font weight variants
export const FontWeightVariant = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const;

// Text alignment variants
export const TextAlignVariant = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
  left: "text-left",
  right: "text-right",
} as const;

// Text color variants
export const TextColorVariant = {
  prose: "text-foreground",
  primary: "text-primary",
  emphasis: "text-foreground",
  secondary: "text-muted-foreground",
  tertiary: "text-muted-foreground/60",
  success: "text-green-600",
  warning: "text-yellow-600",
  danger: "text-red-600",
} as const;

export interface TypographyProps {
  fontSize?: keyof typeof FontSizeVariant | number;
  fontWeight?: keyof typeof FontWeightVariant | number;
  textAlign?: keyof typeof TextAlignVariant;
  textColor?: keyof typeof TextColorVariant | string;
}

export const FontSize = {
  variant: FontSizeVariant,
  definition: {
    name: "size",
    type: '"xs" | "sm" | "md" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl" | number',
    required: false,
    description:
      "Font size; accepts a font size token or a custom px number value.",
  },
  format: (fontSize: TypographyProps["fontSize"]): string => {
    if (fontSize === undefined) return "";
    if (typeof fontSize === "number") {
      return `[${fontSize}px]`;
    }
    if (FontSize.variant.hasOwnProperty(fontSize)) {
      return FontSize.variant[fontSize as keyof typeof FontSize.variant];
    }
    return "";
  },
};

export const FontWeight = {
  variant: FontWeightVariant,
  definition: {
    name: "weight",
    type: '"normal" | "medium" | "semibold" | "bold" | number',
    required: false,
    description:
      "Font weight; accepts a font weight token or a custom numeric value (100-900).",
  },
  format: (fontWeight: TypographyProps["fontWeight"]): string => {
    if (fontWeight === undefined) return "";
    if (typeof fontWeight === "number") {
      return `font-[${fontWeight}]`;
    }
    if (FontWeight.variant.hasOwnProperty(fontWeight)) {
      return FontWeight.variant[fontWeight as keyof typeof FontWeight.variant];
    }
    return "";
  },
};

export const TextAlign = {
  variant: TextAlignVariant,
  definition: {
    name: "textAlign",
    type: '"start" | "center" | "end" | "left" | "right"',
    required: false,
    description: "Text alignment; accepts a text alignment token.",
  },
  format: (textAlign: TypographyProps["textAlign"]): string => {
    if (textAlign === undefined) return "";
    if (TextAlign.variant.hasOwnProperty(textAlign)) {
      return TextAlign.variant[textAlign as keyof typeof TextAlign.variant];
    }
    return "";
  },
};

export const TextColor = {
  variant: TextColorVariant,
  definition: {
    name: "color",
    type: '"prose" | "primary" | "emphasis" | "secondary" | "tertiary" | "success" | "warning" | "danger" | string',
    required: false,
    description:
      "Text color; accepts a text color token or a custom color string.",
  },
  format: (textColor: TypographyProps["textColor"]): string => {
    if (textColor === undefined) return "";
    if (TextColor.variant.hasOwnProperty(textColor)) {
      return TextColor.variant[textColor as keyof typeof TextColor.variant];
    }
    return textColor;
  },
};

export const Truncate = {
  variant: {
    true: "truncate",
    false: "",
  },
  definition: {
    name: "truncate",
    type: "boolean",
    required: false,
    description: "Truncate text with an ellipsis if it overflows.",
  },
  format: (truncate: boolean | undefined): string => {
    if (truncate) {
      return "truncate";
    }
    return "";
  },
};
