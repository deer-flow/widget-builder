// Padding variants
export const PaddingVariant = {
  none: "p-0",
  xs: "p-1",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
  "2xl": "p-10",
  "3xl": "p-12",
} as const;

export interface PaddingProps {
  padding?: keyof typeof PaddingVariant | number;
}

export const Padding = {
  variant: PaddingVariant,
  definition: {
    name: "padding",
    type: '"none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | number',
    required: false,
    description:
      "Padding; accepts a padding token or a custom px number value.",
  },
  format: (
    padding: PaddingProps["padding"]
  ): string | [string, React.CSSProperties] => {
    if (padding === undefined) return "";
    if (typeof padding === "number") {
      return ["", { padding: `${padding}px` }];
    }
    if (Padding.variant.hasOwnProperty(padding)) {
      return Padding.variant[padding as keyof typeof Padding.variant];
    }
    return "";
  },
};

export interface MarginProps {
  margin?: keyof typeof MarginVariant | number;
}

// Margin variants
export const MarginVariant = {
  none: "m-0",
  xs: "m-1",
  sm: "m-2",
  md: "m-4",
  lg: "m-6",
  xl: "m-8",
  "2xl": "m-10",
  "3xl": "m-12",
} as const;

export const Margin = {
  variant: MarginVariant,
  definition: {
    name: "margin",
    type: '"none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | number',
    required: false,
    description: "Margin; accepts a margin token or a custom px number value.",
  },
  format: (
    margin: MarginProps["margin"]
  ): string | [string, React.CSSProperties] => {
    if (margin === undefined) return "";
    if (typeof margin === "number") {
      return ["", { margin: `${margin}px` }];
    }
    if (Margin.variant.hasOwnProperty(margin)) {
      return Margin.variant[margin as keyof typeof Margin.variant];
    }
    return "";
  },
};
