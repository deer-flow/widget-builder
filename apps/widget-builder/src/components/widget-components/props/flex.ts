import { format } from "path";
import { definition } from "../box";

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

    if (Align.variant.hasOwnProperty(align)) {
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

    if (Justify.variant.hasOwnProperty(justify)) {
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

    if (Wrap.variant.hasOwnProperty(wrap)) {
      return Wrap.variant[wrap as keyof typeof Wrap.variant];
    }

    return "";
  },
};

export const FlexVariant = {
  none: "flex-none",
  auto: "flex-auto",
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
      return `flex-[${flex}]`;
    }

    if (typeof flex === "string") {
      // Handle common flex values
      const commonFlexValues = {
        "1": "flex-1",
        auto: "flex-auto",
        initial: "flex-initial",
        none: "flex-none",
      };

      if (commonFlexValues[flex as keyof typeof commonFlexValues]) {
        return commonFlexValues[flex as keyof typeof commonFlexValues];
      }

      return `flex-[${flex}]`;
    }

    return "";
  },
};
