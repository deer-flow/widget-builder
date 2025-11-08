import { Variant } from "./types";

export const AlignVariant = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
  stretch: "items-stretch",
} as const;

export type AlignProps = {
  align?: keyof typeof AlignVariant;
};

export const Align = {
  variant: AlignVariant,
  definition: {
    name: "align",
    type: "'start' | 'center' | 'end' | 'baseline' | 'stretch'",
    description: "Sets the align-items property of the flex container.",
  },
  format: (align: AlignProps["align"]): string => {
    if (align === undefined) return "";

    if (align in Align.variant) {
      return Align.variant[align as keyof typeof Align.variant];
    }

    return "";
  },
};

// Flexbox justify variants
export const JustifyVariant = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  stretch: "justify-stretch",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
} as const;

export interface JustifyProps {
  justify?: keyof typeof JustifyVariant;
}

export const Justify = {
  variant: JustifyVariant,
  definition: {
    name: "justify",
    type: "'start' | 'center' | 'end' | 'stretch' | 'between' | 'around' | 'evenly'",
    description: "Sets the justify-content property of the flex container.",
  },
  format: (justify: JustifyProps["justify"]): string => {
    if (justify === undefined) return "";

    if (justify in Justify.variant) {
      return Justify.variant[justify as keyof typeof Justify.variant];
    }

    return "";
  },
};

// Flex wrap variants
export const WrapVariant = {
  nowrap: "flex-nowrap",
  wrap: "flex-wrap",
  "wrap-reverse": "flex-wrap-reverse",
} as const;

export interface WrapProps {
  wrap?: keyof typeof WrapVariant;
}

export const Wrap = {
  variant: WrapVariant,
  definition: {
    name: "wrap",
    type: "'nowrap' | 'wrap' | 'wrap-reverse'",
    description: "Sets the flex-wrap property of the flex container.",
  },
  format: (wrap: WrapProps["wrap"]): string => {
    if (wrap === undefined) return "";

    if (wrap in Wrap.variant) {
      return Wrap.variant[wrap as keyof typeof Wrap.variant];
    }

    return "";
  },
};

export const FlexVariant = {
  none: "none",
  auto: "auto",
} as const;

export interface FlexProps {
  flex?: keyof typeof FlexVariant | number;
}

export const Flex = {
  variant: FlexVariant,
  definition: {
    name: "flex",
    type: "'auto' | 'none' | string | number",
    defaultValue: "undefined",
    description:
      "Sets the flex property of the flex item. Can be a number (e.g., 1) or a string (e.g., 'auto', 'none', '2').",
  },
  format: (flex: FlexProps["flex"]): string => {
    if (flex === undefined) return "";

    if (typeof flex === "number") {
      return `flex-${flex}`;
    }

    if (typeof flex === "string") {
      if (flex in Flex.variant) {
        return `flex-${Flex.variant[flex as keyof typeof Flex.variant]}`;
      }
      if (!isNaN(Number(flex))) {
        return `flex-${flex}`;
      }
      return `flex-(${flex})`;
    }

    return "";
  },
};

export const Shrink: Variant = {
  variant: {},
  definition: {
    name: "shrink",
    type: "number | string",
    description: "Sets the flex-shrink property of the flex container.",
  },
  format: (shrink: number | string | undefined): string | [string, React.CSSProperties] => {
    if (typeof shrink === "number") {
      return ["", { flexShrink: shrink }];
    }
    if (typeof shrink === "string" && !isNaN(Number(shrink))) {
      return `shrink-${shrink}`;
    }
    return "";
  },
};

export const Grow: Variant = {
  variant: {},
  definition: {
    name: "grow",
    type: "number | string",
    description: "Sets the flex-grow property of the flex container.",
  },
  format: (grow: number | string | undefined): string | [string, React.CSSProperties] => {
    if (typeof grow === "number") {
      return ["", { flexGrow: grow }];
    }
    if (typeof grow === "string") {
      return `grow-${grow}`;
    }
    return "";
  },
};
