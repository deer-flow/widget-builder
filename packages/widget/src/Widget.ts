import { JSONSchema4 } from "json-schema";

import { JSXElementSchema } from "./JSXSchema";

export interface Widget {
  /** The unique identifier for the widget */
  id: string;

  /** The name of the widget */
  name: string;

  /** A brief description of the widget */
  description?: string;

  /** The JSX template representing the widget's structure */
  template: string;

  /** The JSON definition of the widget's UI schema */
  uiSchema?: JSXElementSchema;

  /** The JSON schema defining the widget's data structure */
  dataSchema?: JSONSchema4;

  /** Predefined states for the widget */
  states?: Record<string, WidgetState>;
}

export type WidgetState = object;
