import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { JSXEditor } from "monaco-jsx-editor";
import { WidgetRenderer } from "@deer-flow/widget-renderer";
import { JSONEditor } from "@/components/JSONEditor";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, PlusIcon } from "lucide-react";
import { definitions, components } from "@/components/widget-components";
import { inferDataSchemaFromState, parseJSXTemplate } from "@deer-flow/widget";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { clone } from "@/lib/utils";
import { download } from "@/lib/download";
import { useWidgets, defaultWidgetTemplate } from "@/hooks/use-widgets";

export const WidgetBuilder = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { currentWidget, loadWidget, createWidget, updateWidget } = useWidgets();

  const [activeState, setActiveState] = useState("0");

  // Initialize widget based on route parameter
  useEffect(() => {
    if (id) {
      // Load existing widget
      const existingWidget = loadWidget(id);
      if (!existingWidget) {
        // Widget not found, redirect to create new one
        navigate("/editor", { replace: true });
        return;
      }
    } else {
      // Create new widget
      const newWidget = createWidget(defaultWidgetTemplate);
      navigate(`/editor/${newWidget.id}`, { replace: true });
      return;
    }
  }, [id, loadWidget, createWidget, navigate]);

  // Update UI schema when template changes
  useEffect(() => {
    if (!currentWidget?.template || !currentWidget.id) return;

    const { success, schema } = parseJSXTemplate(currentWidget.template);
    if (success) {
      updateWidget(currentWidget.id, { uiSchema: schema });
    }
  }, [currentWidget?.template, currentWidget?.id, updateWidget]);

  // Update data schema when states change
  useEffect(() => {
    if (!currentWidget?.states || !currentWidget.id) return;

    const newSchema = inferDataSchemaFromState(currentWidget.states);
    updateWidget(currentWidget.id, { dataSchema: newSchema });
  }, [currentWidget?.states, currentWidget?.id, updateWidget]);

  const handleTemplateChange = (newTemplate?: string) => {
    if (currentWidget?.id) {
      updateWidget(currentWidget.id, { template: newTemplate || "" });
    }
  };

  const handleStateChange = (state: string, index: number) => {
    if (!currentWidget?.id) return;

    try {
      const data = JSON.parse(state);
      const states = [...(currentWidget.states || [])];
      states[index] = {
        ...states[index],
        data,
      };
      updateWidget(currentWidget.id, { states });
    } catch (error) {
      // Invalid JSON, ignore or show error
    }
  };

  const handleAddNewState = () => {
    if (!currentWidget?.id) return;

    const states = [
      ...(currentWidget.states || []),
      {
        name: "New State",
        data: clone(currentWidget.states?.[0]?.data || {}),
      },
    ];
    setActiveState(String(states.length - 1));
    updateWidget(currentWidget.id, { states });
  };

  const handleDownload = () => {
    if (!currentWidget) return;

    const content = JSON.stringify(currentWidget, null, 2);
    const filename = `${currentWidget.name?.toLowerCase().replace(/\s+/g, "-") || "widget"}.json`;
    download(content, filename, "application/json");
  };

  // Don't render until widget is loaded
  if (!currentWidget) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-4">
        <h1 className="text-lg font-semibold">{currentWidget.name ?? "Untitled Widget"}</h1>
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" onClick={handleDownload}>
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
              value={currentWidget.template || ""}
              onChange={handleTemplateChange}
              components={definitions}
              dataSchema={currentWidget.dataSchema}
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
                  {currentWidget.states?.map((state, index) => (
                    <TabsTrigger key={index.toString()} value={index.toString()}>
                      {state.name || `New State`}
                    </TabsTrigger>
                  ))}
                  <Button variant="outline" size="sm" className="ml-2" onClick={handleAddNewState}>
                    <PlusIcon className="size-3" />
                  </Button>
                </TabsList>
              </div>

              {currentWidget.states?.map((state, index) => (
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
                  schema={currentWidget.uiSchema}
                  components={components}
                  data={currentWidget.states?.[Number(activeState)]?.data ?? {}}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
