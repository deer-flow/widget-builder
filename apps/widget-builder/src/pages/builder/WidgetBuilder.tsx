import { useEffect, useId, useState } from "react";
import { JSXEditor } from "monaco-jsx-editor";
import { WidgetRenderer } from "@deer-flow/widget-renderer";
import { JSONEditor } from "@/components/JSONEditor";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, PlusIcon, Share } from "lucide-react";
import { definitions, components } from "@/components/widget-components";
import { inferDataSchemaFromState, parseJSXTemplate, Widget } from "@deer-flow/widget";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { clone } from "@/lib/utils";

const defaultWidget: Widget = {
  id: "widget-1",
  name: "Flight Tracker",
  description: "A widget to track flight information",
  template: `
<Card size="sm">
  <Title level="h2">{data.eta}</Title>

  <Row align="center">
    <Col minWidth="auto">
      <Caption>Pick up</Caption>
      <Text truncate>{data.address}</Text>
    </Col>
    <Spacer />
    <Col align="end">
      <Caption>Driver</Caption>
      <Text>{data.driver.name}</Text>
    </Col>

    <Image
      src={data.driver.photo}
      size={40}
      radius="full"
    />
  </Row>
</Card>
    `,
  states: [
    {
      name: "Default",
      data: {
        eta: "1 min",
        address: "1008 Mission St",
        driver: {
          name: "Jonathan",
          photo: "https://cdn.openai.com/API/storybook/driver.png",
        },
      },
    },
  ],
};

export const WidgetBuilder = () => {
  const [widget, setWidget] = useState(defaultWidget);
  const [activeState, setActiveState] = useState("0");

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
    const newSchema = inferDataSchemaFromState(widget.states || []);
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

  const handleStateChange = (state: string, index: number) => {
    try {
      const data = JSON.parse(state);
      setWidget((prev) => {
        const states = [...(prev.states || [])];
        states[index] = {
          ...states[index],
          data,
        };
        return {
          ...prev,
          states,
        };
      });
    } catch (error) {
      // Invalid JSON, ignore or show error
    }
  };

  const handleAddNewState = () => {
    const states = [
      ...(widget.states || []),
      {
        name: "New State",
        data: clone(widget.states?.[0]?.data || {}),
      },
    ];
    setActiveState(String(states.length - 1));
    setWidget((prev) => ({
      ...prev,
      states,
    }));
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-4">
        <h1 className="text-lg font-semibold">{widget.name ?? "Untitled Widget"}</h1>
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
              components={definitions}
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
            <Tabs value={activeState} className="flex-1 flex flex-col" onValueChange={setActiveState}>
              <div className="border-b px-4 py-2 flex items-center">
                <div className="font-medium mr-2">States:</div>
                <TabsList>
                  {widget.states?.map((state, index) => (
                    <TabsTrigger key={index.toString()} value={index.toString()}>
                      {state.name || `New State`}
                    </TabsTrigger>
                  ))}
                  <Button variant="outline" size="sm" className="ml-2" onClick={handleAddNewState}>
                    <PlusIcon className="size-3" />
                  </Button>
                </TabsList>
              </div>

              {widget.states?.map((state, index) => (
                <TabsContent key={index.toString()} value={index.toString()} className="flex-1 m-0 p-4">
                  <JSONEditor
                    value={JSON.stringify(state.data ?? {}, null, 2)}
                    onChange={(state) => handleStateChange(state, index)}
                    className="h-full"
                  />
                </TabsContent>
              ))}
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
                  data={widget.states?.[Number(activeState)]?.data ?? {}}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
