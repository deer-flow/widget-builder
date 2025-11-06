import { Variant } from "./types";

export const BackgroundVariant = {
  none: "bg-transparent",
  surface: "bg-background",
  "surface-secondary": "bg-muted",
  "surface-tertiary": "bg-muted/50",
  "surface-elevated": "bg-card",
  "surface-elevated-secondary": "bg-accent",
} as const;

export interface BackgroundProps {
  background?: keyof typeof BackgroundVariant | string;
}

// Background object with variants and format methods
export const Background: Variant = {
  // Background variants
  variant: BackgroundVariant,

  definition: {
    name: "background",
    type: '"none" | "surface" | "surface-secondary" | "surface-tertiary" | "surface-elevated" | "surface-elevated-secondary" | string',
    required: false,
    description: "Background color; accepts a surface color token or a custom color value.",
  },

  // Format method to handle background colors
  format: (background: BackgroundProps["background"]): string => {
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

    return "";
  },
};
