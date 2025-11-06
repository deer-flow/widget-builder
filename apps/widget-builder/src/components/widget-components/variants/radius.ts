// Border radius variants
export const RadiusVariant = {
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
} as const;

export interface RadiusProps {
  radius?: keyof typeof RadiusVariant | number | string;
}

export const Radius = {
  variant: RadiusVariant,
  definition: {
    name: "radius",
    type: '"none" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full" | number | string',
    required: false,
    description:
      "Border radius; accepts a radius token, a custom px number value, or a percentage string.",
  },
  format: (
    radius: RadiusProps["radius"]
  ): string | [string, React.CSSProperties] => {
    if (radius === undefined) return "";

    if (typeof radius === "number") {
      return ["", { borderRadius: `${radius}px` }];
    }

    if (typeof radius === "string") {
      // Check if it's a percentage value
      if (radius.endsWith("%")) {
        return ["", { borderRadius: `${radius}` }];
      }

      // Check if it's a predefined variant
      if (Radius.variant.hasOwnProperty(radius)) {
        return Radius.variant[radius as keyof typeof Radius.variant];
      }
    }

    return "";
  },
};
