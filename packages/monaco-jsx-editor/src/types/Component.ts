export interface ComponentProp {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  defaultValue?: unknown;
}

export interface ComponentDefinition {
  name: string;
  props: ComponentProp[];
  description?: string;
  usage?: string;
  category?: string;
}
