import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWidgets } from "@/hooks/use-widgets";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

export const MyWidgets = () => {
  const { currentWidget, widgets, updateWidget, deleteWidget } = useWidgets();
  const navigate = useNavigate();
  const currentId = currentWidget?.id || null;
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [widgetToDelete, setWidgetToDelete] = useState<string | null>(null);

  const handleStartEdit = (widget: { id: string; name: string }) => {
    setEditingWidgetId(widget.id);
    setEditName(widget.name);
  };

  const handleSaveEdit = () => {
    if (editingWidgetId && editName.trim()) {
      updateWidget(editingWidgetId, { name: editName.trim() });
    }
    setEditingWidgetId(null);
    setEditName("");
  };

  const handleCancelEdit = () => {
    setEditingWidgetId(null);
    setEditName("");
  };

  const handleDeleteClick = (widgetId: string) => {
    setWidgetToDelete(widgetId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (widgetToDelete) {
      const success = deleteWidget(widgetToDelete);
      if (success && currentId === widgetToDelete) {
        // If the deleted widget is the one currently open, navigate to the editor home
        navigate("/editor");
      }
    }
    setDeleteDialogOpen(false);
    setWidgetToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setWidgetToDelete(null);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Widgets</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {widgets.map((widget) => (
            <SidebarMenuItem key={widget.id}>
              {editingWidgetId === widget.id ? (
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-7 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSaveEdit();
                      } else if (e.key === "Escape") {
                        handleCancelEdit();
                      }
                    }}
                    onBlur={handleSaveEdit}
                    autoFocus
                  />
                </div>
              ) : (
                <>
                  <SidebarMenuButton tooltip={widget.name} asChild isActive={currentId === widget.id}>
                    <Link to={`/editor/${widget.id}`}>
                      <span>{widget.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More actions</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48" side="bottom" align="end">
                      <DropdownMenuItem onClick={() => handleStartEdit(widget)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(widget.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this widget? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarGroup>
  );
};
