import { ColorVariant } from "./color";
import { Variant } from "./types";

export const BackgroundVariant = {
  none: "transparent",
  background: "background",
  card: "card",
  popover: "popover",
  muted: "muted",
  secondary: "secondary",
  ...ColorVariant,
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
    type:
      "'none' | 'background' | 'card' | 'popover' | 'muted' | 'secondary'" +
      " | '" +
      Object.keys(ColorVariant).join("' | '") +
      "'",
    required: false,
    description: "Background color; accepts a surface color token or a custom color value.",
  },

  // Format method to handle background colors
  format: (background: BackgroundProps["background"]): string => {
    if (background === undefined) return "";

    if (typeof background === "string") {
      if (background in BackgroundVariant) {
        return `bg-${BackgroundVariant[background as keyof typeof BackgroundVariant]}`;
      }

      // Otherwise treat as arbitrary CSS value
      return `bg-[${background}]`;
    }

    return "";
  },
};
