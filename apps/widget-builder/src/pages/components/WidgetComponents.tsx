import { parseJSXTemplate } from "@deer-flow/widget";
import { WidgetRenderer } from "@deer-flow/widget-renderer";
import { ComponentDefinition, ComponentProp } from "monaco-jsx-editor";
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { components, definitions } from "@/components/widget-components";
import { cn } from "@/lib/utils";

export function WidgetComponents() {
  const { name } = useParams<{ name: string }>();

  // Find the selected component definition
  const selectedComponent = definitions.find((def) => def.name.toLowerCase() === name?.toLowerCase());

  // Group components by category
  const categorizedComponents = React.useMemo(() => {
    const categories: Record<string, ComponentDefinition[]> = {
      Layout: [],
      Typography: [],
      Controls: [],
      Display: [],
      Others: [],
    };

    definitions.forEach((def) => {
      const category = def.category || "Others";
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(def);
    });

    return categories;
  }, []);

  return (
    <div className="flex h-full w-full">
      {/* Left Sidebar - Component Tree */}
      <div className="w-60 shrink-0 border-r bg-muted/30">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Components</h2>
          <p className="text-sm text-muted-foreground">Widget component library</p>
        </div>

        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-4 space-y-6">
            {Object.entries(categorizedComponents).map(([category, components]) => (
              <div key={category}>
                <h3 className="font-medium text-sm text-muted-foreground mb-2 tracking-wide">{category}</h3>
                <div className="space-y-1">
                  {components.map((component) => {
                    const isActive = component.name.toLowerCase() === name?.toLowerCase();
                    return (
                      <Link
                        key={component.name}
                        to={`/components/${component.name.toLowerCase()}`}
                        className={cn(
                          "block p-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                          isActive && "bg-accent text-accent-foreground"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{component.name}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Content - Component Details */}
      {selectedComponent ? (
        <ComponentDetails component={selectedComponent} />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium text-muted-foreground">Select a component</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Choose a component from the sidebar to view its details
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface ComponentDetailsProps {
  component: ComponentDefinition;
}

function ComponentDetails({ component }: ComponentDetailsProps) {
  return (
    <div className="flex-1 flex w-full flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{component.name}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 w-full h-[calc(100vh-120px)]">
        <div className="p-6 space-y-8">
          {/* Description */}
          {component.description && <p className="text-muted-foreground mt-1">{component.description}</p>}
          {/* Props Table */}

          {/* Usage Example */}
          {component.usage && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Usage</h2>
              <div className="rounded-md">
                <SyntaxHighlighter language="javascript" style={atomDark}>
                  {component.usage}
                </SyntaxHighlighter>
              </div>
              <UsageRenderer usage={component.usage} />
            </div>
          )}
          {component.props && component.props.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Props</h2>
              <div className="border rounded-md">
                <table className="w-full table-fixed">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-sm w-[150px]">Name</th>
                      <th className="text-left p-3 font-medium text-sm w-[300px]">Type</th>
                      <th className="text-left p-3 font-medium text-sm w-[100px]">Required</th>
                      <th className="text-left p-3 font-medium text-sm w-[120px]">Default</th>
                      <th className="text-left p-3 font-medium text-sm">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {component.props.map((prop) => (
                      <ComponentPropRow key={prop.name} prop={prop} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface ComponentPropRowProps {
  prop: ComponentProp;
}

function ComponentPropRow({ prop }: ComponentPropRowProps) {
  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      <td className="p-3 font-mono text-sm">{prop.name}</td>
      <td className="p-3">
        <code className="block rounded-lg p-2 text-xs bg-secondary font-mono whitespace-normal wrap-break-words">
          {prop.type}
        </code>
      </td>
      <td className="p-3">
        {prop.required ? (
          <Badge variant="destructive" className="text-xs">
            Required
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs">
            Optional
          </Badge>
        )}
      </td>
      <td className="p-3 text-xs font-mono">{prop.defaultValue !== undefined ? String(prop.defaultValue) : "—"}</td>
      <td className="p-3 text-sm">
        {prop.description || <span className="text-muted-foreground">No description</span>}
      </td>
    </tr>
  );
}

function UsageRenderer({ usage }: { usage: string }) {
  const schema = parseJSXTemplate(usage);

  if (!schema.success) {
    return null;
  }
  return (
    <div className="p-4">
      <WidgetRenderer schema={schema.schema} components={components} />
    </div>
  );
}
