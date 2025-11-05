import { ComponentProp } from "monaco-jsx-editor";

// Re-export all variant maps
export * from "./typography";
export * from "./spacing";
export * from "./padding";
export * from "./sizing";
export * from "./radius";
export * from "./background";
export * from "./border";
export * from "./flex";

/**
 * Utility to combine multiple variant to a single object
 * with all variant maps merged. and format methods combined.
 *
 * @example
 * const Combined = combine({padding: Padding, margin: Margin});
 *
 * Combined.variant -> { padding: Padding.variant, margin: Margin.variant }
 *
 * Combined.format({ padding: 'md', margin: 10 })
 * -> "p-4 m-[10px]"
 */
export function combine<
  T extends Record<
    string,
    { variant: any; definition: any; format: (value: any) => string }
  >,
>(
  variantMaps: T
): {
  variants: { [K in keyof T]: T[K]["variant"] };
  definitions: ComponentProp[];
  format: (values: {
    [K in keyof T]?: Parameters<T[K]["format"]>[0];
  }) => string;
} {
  // Merge all variant maps
  const variants = Object.keys(variantMaps).reduce((acc, key) => {
    acc[key] = variantMaps[key].variant;
    return acc;
  }, {} as any);

  // Merge all definitions
  const definitions = Object.keys(variantMaps).reduce((acc, key) => {
    acc.push(variantMaps[key].definition);
    return acc;
  }, [] as ComponentProp[]);

  // Create combined format function
  const format = (values: any) => {
    return Object.keys(values)
      .filter((key) => values[key] !== undefined && variantMaps[key])
      .map((key) => variantMaps[key].format(values[key]))
      .filter(Boolean)
      .join(" ");
  };

  return { variants, definitions, format };
}

/**
 * Utility type to extract format parameter type from combine result
 *
 * @example
 * const Combined = combine({padding: Padding, margin: Margin});
 * type FormatParams = GetFormatParams<typeof Combined>;
 * // FormatParams = { padding?: PaddingValue; margin?: MarginValue }
 */
export type VariantsProps<T> = T extends {
  format: (values: infer P) => string;
}
  ? P
  : never;
