export interface ComponentProp {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  defaultValue?: any;
}

export interface ComponentDefinition {
  name: string;
  props: ComponentProp[];
  description?: string;
}
