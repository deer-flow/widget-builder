// Spacing variants
export const SpacingVariant = {
  none: "0",
  xs: "1",
  sm: "2",
  md: "4",
  lg: "6",
  xl: "8",
  "2xl": "10",
  "3xl": "12",
} as const;

export interface SpacingProps {
  spacing?: keyof typeof SpacingVariant | number;
}

export const Spacing = {
  variant: SpacingVariant,
  definition: {
    name: "spacing",
    type: '"none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | number',
    required: false,
    description:
      "Spacing; accepts a spacing token or a custom px number value.",
  },
  format: (spacing: SpacingProps["spacing"]): string => {
    if (spacing === undefined) return "";
    if (typeof spacing === "number") {
      return `[${spacing}px]`;
    }
    if (Spacing.variant.hasOwnProperty(spacing)) {
      return Spacing.variant[spacing as keyof typeof Spacing.variant];
    }
    return "";
  },
};

// Gap variants
export const GapVariant = {
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
} as const;

export interface GapProps {
  gap?: keyof typeof GapVariant | number;
}

export const Gap = {
  variant: GapVariant,
  definition: {
    name: "gap",
    type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | number",
    required: false,
    description: "Gap; accepts a gap token or a custom px number value.",
  },
  format: (gap: GapProps["gap"]): string => {
    if (gap === undefined) return "";
    if (Gap.variant.hasOwnProperty(gap)) {
      return Gap.variant[gap as keyof typeof Gap.variant];
    }
    if (typeof gap === "number") {
      return `gap-[${gap}px]`;
    }
    return "";
  },
};
