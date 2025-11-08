import { ComponentProp } from "monaco-jsx-editor";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Variant<T = any> = {
  variant: Record<string, string>;
  definition: ComponentProp;
  format: (value: T) => string | [string, React.CSSProperties];
};
