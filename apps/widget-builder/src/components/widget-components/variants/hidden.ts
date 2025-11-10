import { Variant } from "./types";

export interface HiddenProps {
  hidden?: boolean;
}

// Hidden variant
export const Hidden: Variant = {
  variant: {},
  
  definition: {
    name: "hidden",
    type: "boolean",
    required: false,
    description: "When true, hides the component by returning null.",
  },
  
  format: (): string | [string, React.CSSProperties] => {
    // Hidden is handled in the component logic, not through CSS
    return "";
  },
};
