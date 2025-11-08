import { WidgetRenderer } from "@deer-flow/widget-renderer";
import { Code2, Sparkles } from "lucide-react";
import { useState, useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);

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

  const selectedWidgetData = selectedWidget !== null ? galleryWidgets[selectedWidget] : null;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="h-14 border-b shrink-0 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold">Widget Gallery</h1>
        </div>
        <p className="text-sm text-muted-foreground">{galleryWidgets.length} pre-built widgets ready to use</p>
      </div>

      {/* Gallery Masonry */}
      <ScrollArea className="flex-1 h-[calc(100vh-120px)]">
        <div className="p-6" ref={containerRef}>
          <div className="flex flex-wrap gap-6">
            {galleryWidgets.map((item, itemIndex) => {
              return (
                <div className="flex flex-col w-fit relative" key={itemIndex}>
                  {/* Widget Preview */}
                  <ErrorBoundary>
                    <WidgetRenderer
                      components={components}
                      data={item.widget.states?.[0]?.data ?? {}}
                      template={item.widget.template}
                    />
                  </ErrorBoundary>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center">
                    <div className="space-y-1 flex flex-col p-6 mb-2 w-full items-center bg-background">
                      <h3 className="font-semibold text-base">{item.widget.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.widget.description}</p>

                      <Button size="sm" onClick={() => handleWidgetClick(itemIndex)}>
                        <Code2 className="h-4 w-4 mr-2" />
                        View Code
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>

      {/* Widget Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedWidgetData?.widget.name}</DialogTitle>
            <DialogDescription>{selectedWidgetData?.widget.description}</DialogDescription>
          </DialogHeader>

          {/* Widget Preview */}
          <div className="w-full max-h-3xl overflow-y-auto space-y-6">
            <div className="w-full flex justify-center">
              {selectedWidgetData && (
                <ErrorBoundary>
                  <WidgetRenderer
                    components={components}
                    data={selectedWidgetData.widget.states?.[0]?.data ?? {}}
                    template={selectedWidgetData.widget.template}
                  />
                </ErrorBoundary>
              )}
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
                  wrapLines
                >
                  {selectedWidgetData?.widget.template || ""}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>

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
