const positions = {
  top: "Top",
  right: "Right",
  bottom: "Bottom",
  left: "Left",
} as const;

// Padding variants
export const PaddingVariant = {
  none: "0",
  px: "px",
  xs: "1",
  sm: "2",
  md: "4",
  lg: "6",
  xl: "8",
  "2xl": "12",
  "3xl": "16",
} as const;

export interface PaddingProps {
  padding?:
    | keyof typeof PaddingVariant
    | number
    | {
        top?: keyof typeof PaddingVariant | number;
        right?: keyof typeof PaddingVariant | number;
        bottom?: keyof typeof PaddingVariant | number;
        left?: keyof typeof PaddingVariant | number;
        x?: keyof typeof PaddingVariant | number;
        y?: keyof typeof PaddingVariant | number;
      };
}

export const Padding = {
  variant: PaddingVariant,
  definition: {
    name: "padding",
    type: '"none" | "px" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | {top?: string | number; right?: string | number; bottom?: string | number; left?: string | number; x?: string | number; y?: string | number;} | number',
    required: false,
    description: "Padding; accepts a padding token or a custom px number value.",
  },
  format: (padding: PaddingProps["padding"]): string | [string, React.CSSProperties] => {
    if (padding === undefined) return "";
    if (typeof padding === "number") {
      return ["", { padding: `${padding}px` }];
    }
    if (typeof padding === "object") {
      const classnames: string[] = [];
      const styles: React.CSSProperties = {};
      const keys = Object.keys(padding) as (keyof typeof padding)[];
      keys.forEach((key) => {
        const value = padding[key];
        if (value === undefined || value === null) return;
        const v = Padding.variant[value as keyof typeof Padding.variant];
        if (key === "x") {
          if (typeof value === "number") {
            styles.paddingLeft = `${value}px`;
            styles.paddingRight = `${value}px`;
          } else if (Padding.variant.hasOwnProperty(value)) {
            classnames.push(`px-${v}`);
          } else if (!isNaN(Number(value))) {
            classnames.push(`px-${value}`);
          }
          return;
        }

        if (key === "y") {
          if (typeof value === "number") {
            styles.paddingTop = `${value}px`;
            styles.paddingBottom = `${value}px`;
          } else if (Padding.variant.hasOwnProperty(value)) {
            classnames.push(`py-${v}`);
          } else if (!isNaN(Number(value))) {
            classnames.push(`py-${value}`);
          }
          return;
        }

        if (typeof value === "number") {
          const posKey = `padding${positions[key]}` as const;
          styles[posKey] = `${value}px`;
        } else if (Padding.variant.hasOwnProperty(value)) {
          const shortKey = `p${positions[key][0].toLowerCase()}`; // e.g., pt, pr, pb, pl
          classnames.push(`p${shortKey}-${v}`);
        }
      });
      return [classnames.join(" "), styles];
    }
    if (Padding.variant.hasOwnProperty(padding)) {
      return `p-${Padding.variant[padding as keyof typeof Padding.variant]}`;
    } else if (!isNaN(Number(padding))) {
      return `p-${padding}`;
    } else {
      return ["", { padding: `${padding}` }];
    }
  },
};

export interface MarginProps {
  margin?:
    | keyof typeof MarginVariant
    | {
        top?: keyof typeof MarginVariant | number;
        right?: keyof typeof MarginVariant | number;
        bottom?: keyof typeof MarginVariant | number;
        left?: keyof typeof MarginVariant | number;
        x?: keyof typeof MarginVariant | number;
        y?: keyof typeof MarginVariant | number;
      }
    | number;
}

// Margin variants
export const MarginVariant = {
  none: "0",
  auto: "auto",
  px: "px",
  xs: "1",
  sm: "2",
  md: "4",
  lg: "6",
  xl: "8",
  "2xl": "12",
  "3xl": "16",
} as const;

export const Margin = {
  variant: MarginVariant,
  definition: {
    name: "margin",
    type: '"none" | "px" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | {top?: string | number; right?: string | number; bottom?: string | number; left?: string | number; x?: string | number; y?: string | number;} | number',
    required: false,
    description: "Margin; accepts a margin token or a custom px number value.",
  },
  format: (margin: MarginProps["margin"]): string | [string, React.CSSProperties] => {
    if (margin === undefined) return "";
    if (typeof margin === "number") {
      return ["", { margin: `${margin}px` }];
    }
    const classnames: string[] = [];
    const styles: React.CSSProperties = {};
    if (typeof margin === "object") {
      const keys = Object.keys(margin) as (keyof typeof margin)[];
      keys.forEach((key) => {
        const value = margin[key];
        if (value === undefined || value === null) return;

        const v = Margin.variant[value as keyof typeof Margin.variant];
        if (key === "x") {
          if (typeof value === "number") {
            styles.marginLeft = `${value}px`;
            styles.marginRight = `${value}px`;
          } else if (Margin.variant.hasOwnProperty(value)) {
            classnames.push(`mx-${v}`);
          } else if (!isNaN(Number(value))) {
            classnames.push(`mx-${value}`);
          }
          return;
        }

        if (key === "y") {
          if (typeof value === "number") {
            styles.marginTop = `${value}px`;
            styles.marginBottom = `${value}px`;
          } else if (Margin.variant.hasOwnProperty(value)) {
            classnames.push(`my-${v}`);
          } else if (!isNaN(Number(value))) {
            classnames.push(`my-${value}`);
          }
          return;
        }

        if (typeof value === "number") {
          const posKey = `margin${positions[key]}` as const;
          styles[posKey] = `${value}px`;
        } else if (Margin.variant.hasOwnProperty(value)) {
          const shortKey = `m${positions[key][0].toLowerCase()}`; // e.g., mt, mr, mb, ml
          classnames.push(`m${shortKey}-${v}`);
        }
      });
      return [classnames.join(" "), styles];
    }
    if (Margin.variant.hasOwnProperty(margin)) {
      return `m-${Margin.variant[margin as keyof typeof Margin.variant]}`;
    } else if (!isNaN(Number(margin))) {
      return `m-${margin}`;
    } else {
      return ["", { margin: `${margin}` }];
    }
  },
};
