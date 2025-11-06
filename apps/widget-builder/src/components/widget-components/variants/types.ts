import { ComponentProp } from "monaco-jsx-editor";

export type Variant<T = any> = {
  variant: Record<string, string>;
  definition: ComponentProp;
  format: (value: T) => string | [string, React.CSSProperties];
};
