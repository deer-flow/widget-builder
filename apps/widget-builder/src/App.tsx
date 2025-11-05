import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/pages/layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WidgetBuilder } from "@/pages/builder";
import { WidgetGallery } from "@/pages/gallery";

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider defaultOpen>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-full flex-1 flex-col">
            <Routes>
              <Route path="/" element={<Navigate to="/builder" replace />} />
              <Route path="/builder" element={<WidgetBuilder />} />
              <Route path="/gallery" element={<WidgetGallery />} />
            </Routes>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
