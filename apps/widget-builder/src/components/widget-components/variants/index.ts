import { ComponentProp } from "monaco-jsx-editor";
import { Variant } from "./types";

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
 * const Variants = variants({padding: Padding, margin: Margin});
 *
 * Variants.variant -> { padding: Padding.variant, margin: Margin.variant }
 *
 * Variants.format({ padding: 'md', margin: 10 })
 * -> ["p-md", {margin: "10px"}]
 */
export function variants<T extends Record<string, Variant>>(
  variantMaps: T
): {
  variants: { [K in keyof T]: T[K]["variant"] };
  definitions: ComponentProp[];
  format: (values: {
    [K in keyof T]?: Parameters<T[K]["format"]>[0];
  }) => readonly [string, React.CSSProperties];
} {
  // Merge all variant maps
  const variants = Object.keys(variantMaps).reduce((acc, key) => {
    acc[key] = variantMaps[key].variant;
    return acc;
  }, {} as any);

  // Merge all definitions
  const definitions = Object.keys(variantMaps).reduce((acc, key) => {
    acc.push({
      ...variantMaps[key].definition,
      name: key,
    });
    return acc;
  }, [] as ComponentProp[]);

  // Create combined format function
  const format = (values: any) => {
    const classNames: string[] = [];
    const styles: React.CSSProperties = {};

    Object.keys(values).forEach((key) => {
      if (!(key in variantMaps)) {
        console.warn(`Unknown variant key: ${key} in`, variantMaps);
        return;
      }
      const result = variantMaps[key].format(values[key]);
      if (typeof result === "string") {
        classNames.push(result);
      } else if (Array.isArray(result)) {
        classNames.push(result[0]);
        Object.assign(styles, result[1]);
      }
    });

    return [classNames.join(" "), styles] as const;
  };

  return { variants, definitions, format };
}

/**
 * Utility type to extract format parameter type from combine result
 */
export type VariantsProps<T> = T extends {
  format: (values: infer P) => any;
}
  ? P
  : never;
