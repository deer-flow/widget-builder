import { ColorVariant } from "./color";

export const BorderColorVariant = {
  default: "border",
  ...ColorVariant,
} as const;

export const BorderColor = {
  variant: BorderColorVariant,
  definition: {
    name: "borderColor",
    type:
      "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'muted' | 'light' | 'dark'" +
      " | '" +
      Object.keys(ColorVariant).join("' | '") +
      "'",
    required: false,
    description: "Sets the border color based on predefined color variants.",
  },
  format: (variant: keyof typeof BorderColorVariant | string): string => {
    if (variant in BorderColorVariant) {
      return BorderColorVariant[variant as keyof typeof BorderColorVariant];
    }
    return `border-[${variant}]`;
  },
};

export type BorderSetting = {
  size?: number;
  color?: keyof typeof BorderColorVariant | string;
  style?: "solid" | "dashed" | "dotted" | "double" | "groove" | "ridge" | "inset" | "outset";
};

export type SideBorderSetting = {
  top?: BorderSetting;
  right?: BorderSetting;
  bottom?: BorderSetting;
  left?: BorderSetting;
};

export interface BorderProps {
  border?: number | boolean | BorderSetting | SideBorderSetting;
}

const sides = {
  top: "borderTop",
  right: "borderRight",
  bottom: "borderBottom",
  left: "borderLeft",
} as const;

const shortSides = {
  top: "t",
  right: "r",
  bottom: "b",
  left: "l",
} as const;

function formatBorderColor(
  color: keyof typeof BorderColorVariant | string,
  side?: keyof typeof sides
): [string, React.CSSProperties] {
  if (color in BorderColorVariant) {
    const className = side
      ? `border-${shortSides[side]}-${BorderColorVariant[color as keyof typeof BorderColorVariant]}`
      : `border-${BorderColorVariant[color as keyof typeof BorderColorVariant]}`;
    return [className, {}];
  } else {
    if (side) {
      const key = `${sides[side]}Color` as const;
      return [``, { [key]: color }];
    } else {
      return [``, { borderColor: color }];
    }
  }
}

// Helper function to handle border styles
export const Border = {
  variant: {
    true: "border",
    false: "",
  },
  definition: {
    name: "border",
    type: "number | { size?: number; color?: string; style?: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' } | { top?: BorderSetting; right?: BorderSetting; bottom?: BorderSetting; left?: BorderSetting }",
    required: false,
    description:
      "Border; accepts a border width in px, a border object with size, color, and style, or a side-specific border object.",
  },
  format: (border: BorderProps["border"]): string | [string, React.CSSProperties] => {
    if (border === undefined) return "";

    if (border === true) {
      return "border";
    }

    if (border === false) {
      return "";
    }

    if (typeof border === "number") {
      return ["", { borderWidth: `${border}px` }];
    }

    if (typeof border === "object") {
      // Handle border object with width, color, style properties
      const borderObj = border;
      const classes: string[] = [];
      const styles: React.CSSProperties = {};

      for (const side of Object.keys(sides) as (keyof typeof sides)[]) {
        if (side in borderObj) {
          const sideBorder = (borderObj as SideBorderSetting)[side];
          const key = sides[side];

          if (sideBorder?.size !== undefined) {
            styles[`${key}Width` as const] = `${sideBorder.size}px`;
          }
          if (sideBorder?.color !== undefined) {
            const [className, style] = formatBorderColor(sideBorder.color, side);
            if (className) {
              classes.push(className);
            }
            Object.assign(styles, style);
          }
          if (sideBorder?.style !== undefined) {
            classes.push(`border-${shortSides[side]}-${sideBorder.style}`);
          }
        }
      }

      if ("size" in borderObj && borderObj.size !== undefined) {
        styles.borderWidth = `${borderObj.size}px`;
      }
      if ("color" in borderObj && borderObj.color !== undefined) {
        const [className, style] = formatBorderColor(borderObj.color);
        if (className) {
          classes.push(className);
        }
        Object.assign(styles, style);
      }
      if ("style" in borderObj && borderObj.style !== undefined) {
        classes.push(`border-${borderObj.style}`);
      }

      return [classes.join(" "), styles];
    }

    return "";
  },
};
