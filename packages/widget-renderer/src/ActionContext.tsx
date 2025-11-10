import { createContext, useContext } from "react";

/**
 * Action callback type for handling events in widgets
 */
export type ActionCallback = (action: { type: string; payload?: unknown }) => void;

/**
 * Context for providing action handler to widget components
 */
export const ActionContext = createContext<ActionCallback | undefined>(undefined);

/**
 * Hook to access the action handler from context
 */
export function useAction(): ActionCallback | undefined {
  return useContext(ActionContext);
}
