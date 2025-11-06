import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface ErrorDisplayProps {
  error: Error;
  errorInfo: React.ErrorInfo | null;
  onReload?: () => void;
}

export const DefaultErrorDisplay = ({ error, errorInfo }: ErrorDisplayProps) => {
  return (
    <div className="mx-auto max-w-md text-center">
      <h1 className="text-foreground mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Something went wrong.</h1>
      <p>{error.message}</p>
      <Collapsible defaultOpen={false}>
        <CollapsibleTrigger asChild>
          <Button variant="link" size="sm">
            Show details
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p>{errorInfo?.componentStack}</p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
