import { useEffect, useState } from "react";
import { JSXEditor } from "monaco-jsx-editor";
import { WidgetRenderer } from "@deer-flow/widget-renderer";
import { JSONEditor } from "@/components/JSONEditor";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Share } from "lucide-react";
import {
  ComponentDefinitions,
  components,
} from "@/components/widget-components";
import {
  inferDataSchemaFromState,
  parseJSXTemplate,
  Widget,
} from "@deer-flow/widget";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const defaultWidget: Widget = {
  id: "widget-1",
  name: "Flight Tracker",
  description: "A widget to track flight information",
  template: `
<Card size="sm">
  <Title level="h2">1 min</Title>

  <Row align="center">
    <Col minWidth="auto">
      <Caption value="Pick up" />
      <Text value="1008 Mission St" truncate />
    </Col>
    <Spacer />
    <Col align="end">
      <Caption value="Driver" />
      <Text value="Jonathan" />
    </Col>

    <Image
      src="https://cdn.openai.com/API/storybook/driver.png"
      size={40}
      radius="full"
    />
  </Row>
</Card>
    `,
  states: {
    default: {
      flightNumber: "AA123",
      status: "On Time",
      departure: "New York (JFK) - 10:00 AM",
      arrival: "Los Angeles (LAX) - 1:00 PM",
    },
  },
};

export const WidgetBuilder = () => {
  const [widget, setWidget] = useState(defaultWidget);

  useEffect(() => {
    const { success, schema } = parseJSXTemplate(widget.template || "");

    if (success) {
      setWidget((prev) => ({
        ...prev,
        uiSchema: schema,
      }));
    }
  }, [widget.template]);

  useEffect(() => {
    const newSchema = inferDataSchemaFromState(widget.states || {});
    console.log("Inferred data schema:", newSchema);
    setWidget((prev) => ({
      ...prev,
      dataSchema: newSchema,
    }));
  }, [widget.states]);

  const handleTemplateChange = (newTemplate?: string) => {
    setWidget((prev) => ({
      ...prev,
      template: newTemplate || "",
    }));
  };

  const handleStateChange = (state: string) => {
    try {
      const parsedState = JSON.parse(state);
      setWidget((prev) => {
        const newStates = { ...prev.states, default: parsedState };
        return {
          ...prev,
          states: newStates,
        };
      });
    } catch (error) {
      // Invalid JSON, ignore or show error
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-4">
        <h1 className="text-lg font-semibold">
          {widget.name ?? "Untitled Widget"}
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="default" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Editor */}
        <div className="w-1/2 flex flex-col border-r">
          <div className="h-[70%] w-full">
            <JSXEditor
              value={widget.template || ""}
              onChange={handleTemplateChange}
              components={ComponentDefinitions}
              dataSchema={widget.dataSchema}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>
          {/* Left Panel - Editor */}
          <div className="flex-1 border-t flex flex-col">
            <Tabs defaultValue="default" className="flex-1 flex flex-col">
              <div className="border-b px-4 py-2">
                <TabsList>
                  <TabsTrigger value="default">Default</TabsTrigger>
                  <TabsTrigger value="new-state">New state +</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="default" className="flex-1 m-0 p-4">
                <JSONEditor
                  value={JSON.stringify(widget.states?.default ?? {}, null, 2)}
                  onChange={handleStateChange}
                  className="h-full"
                />
              </TabsContent>

              <TabsContent value="new-state" className="flex-1 m-0 p-4">
                <div className="text-muted-foreground text-sm">
                  Create a new state
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 flex flex-col bg-muted/30">
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="w-full max-w-sm">
              <ErrorBoundary>
                <WidgetRenderer
                  schema={widget.uiSchema}
                  components={components}
                  data={widget.states?.["default"] ?? {}}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
