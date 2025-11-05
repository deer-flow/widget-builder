export type BorderSetting = {
  size?: number;
  color?: string;
  style?:
    | "solid"
    | "dashed"
    | "dotted"
    | "double"
    | "groove"
    | "ridge"
    | "inset"
    | "outset";
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
  top: "border-t",
  right: "border-r",
  bottom: "border-b",
  left: "border-l",
} as const;

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
  format: (border: BorderProps["border"]): string => {
    if (border === undefined) return "";

    if (border === true) {
      return "border";
    }

    if (border === false) {
      return "";
    }

    if (typeof border === "number") {
      return `border-[${border}px]`;
    }

    if (typeof border === "object") {
      // Handle border object with width, color, style properties
      const borderObj = border;
      const classes: string[] = [];

      for (const side of Object.keys(sides) as (keyof typeof sides)[]) {
        if (side in borderObj) {
          const sideBorder = (borderObj as SideBorderSetting)[side];
          if (sideBorder?.size !== undefined) {
            classes.push(`${sides[side]}-[${sideBorder.size}px]`);
          }
          if (sideBorder?.color !== undefined) {
            classes.push(`${sides[side]}-[${sideBorder.color}]`);
          }
          if (sideBorder?.style !== undefined) {
            classes.push(`${sides[side]}-${sideBorder.style}`);
          }
        }
      }

      if ("size" in borderObj && borderObj.size !== undefined) {
        classes.push(`border-[${borderObj.size}px]`);
      }
      if ("color" in borderObj && borderObj.color !== undefined) {
        classes.push(`border-[${borderObj.color}]`);
      }
      if ("style" in borderObj && borderObj.style !== undefined) {
        classes.push(`border-${borderObj.style}`);
      }

      return classes.join(" ");
    }

    return "";
  },
};
