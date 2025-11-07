import { WidgetRenderer } from "@deer-flow/widget-renderer";
import { Code2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { components } from "@/components/widget-components";
import { useWidgets } from "@/hooks/use-widgets";

import { galleryWidgets } from "./widgets";

export const WidgetGallery = () => {
  const navigate = useNavigate();
  const { createWidget } = useWidgets();
  const [selectedWidget, setSelectedWidget] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleWidgetClick = (index: number) => {
    setSelectedWidget(index);
    setIsDialogOpen(true);
  };

  const handleUseWidget = () => {
    if (selectedWidget === null) return;

    const widget = galleryWidgets[selectedWidget].widget;
    const newWidget = createWidget(widget);
    setIsDialogOpen(false);
    navigate(`/editor/${newWidget.id}`);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold">Widget Gallery</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {galleryWidgets.length} pre-built widgets ready to use
        </p>
      </div>

      {/* Gallery Grid */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryWidgets.map((item, index) => (
              <div
                key={index}
                className="group relative cursor-pointer rounded-lg border bg-card p-6 hover:border-primary hover:shadow-lg transition-all"
                onClick={() => handleWidgetClick(index)}
              >
                <div className="flex flex-col gap-4">
                  {/* Widget Preview */}
                  <div className="flex items-center justify-center min-h-[200px] bg-muted/30 rounded-md p-4">
                    <div className="w-full max-w-sm">
                      <ErrorBoundary>
                        <WidgetRenderer
                          schema={undefined}
                          components={components}
                          data={item.widget.states?.[0]?.data ?? {}}
                          template={item.widget.template}
                        />
                      </ErrorBoundary>
                    </div>
                  </div>

                  {/* Widget Info */}
                  <div className="space-y-1">
                    <h3 className="font-semibold text-base">{item.widget.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.widget.description}
                    </p>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button variant="secondary" size="sm">
                      <Code2 className="h-4 w-4 mr-2" />
                      View Code
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Widget Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedWidget !== null && galleryWidgets[selectedWidget].widget.name}
            </DialogTitle>
            <DialogDescription>
              {selectedWidget !== null && galleryWidgets[selectedWidget].widget.description}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4">
              {/* Widget Preview */}
              <div className="p-6 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="w-full max-w-sm">
                  {selectedWidget !== null && (
                    <ErrorBoundary>
                      <WidgetRenderer
                        schema={undefined}
                        components={components}
                        data={galleryWidgets[selectedWidget].widget.states?.[0]?.data ?? {}}
                        template={galleryWidgets[selectedWidget].widget.template}
                      />
                    </ErrorBoundary>
                  )}
                </div>
              </div>

              {/* JSX Template Code */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">JSX Template</h4>
                <div className="rounded-lg overflow-hidden">
                  <SyntaxHighlighter
                    language="jsx"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    {selectedWidget !== null ? galleryWidgets[selectedWidget].widget.template || "" : ""}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUseWidget}>
              <Sparkles className="h-4 w-4 mr-2" />
              Use This Widget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
