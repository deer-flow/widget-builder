import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { WidgetBuilder } from "@/pages/builder";
import { WidgetComponents } from "@/pages/components";
import { WidgetGallery } from "@/pages/gallery";
import { AppSidebar } from "@/pages/layout";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.MODE === "production" ? "/widget-builder" : ""}>
      <SidebarProvider defaultOpen className="h-full">
        <AppSidebar />
        <SidebarInset className="overflow-hidden">
          <div className="flex h-full flex-1 flex-col">
            <Routes>
              <Route path="/" element={<Navigate to="/editor" replace />} />
              <Route path="/editor" element={<WidgetBuilder />} />
              <Route path="/editor/:id" element={<WidgetBuilder />} />
              <Route path="/gallery" element={<WidgetGallery />} />
              <Route path="/components" element={<Navigate to="/components/card" replace />} />
              <Route path="/components/:name" element={<WidgetComponents />} />
            </Routes>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
