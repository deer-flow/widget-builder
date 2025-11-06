import { Widget } from "@deer-flow/widget";
import { nanoid } from "nanoid";

const STORAGE_KEY = "widgets";

type WidgetsStoreListener = () => void;

export class WidgetsStore {
  private widgets: Widget[] = [];
  private currentWidgetId: string | null = null;
  private listeners = new Set<WidgetsStoreListener>();

  // Cache snapshots to prevent unnecessary re-renders
  private cachedSnapshot: {
    widgets: Widget[];
    currentWidget: Widget | null;
    currentWidgetId: string | null;
  } | null = null;

  private static serverSnapshot = {
    widgets: [],
    currentWidget: null,
    currentWidgetId: null,
  };

  constructor() {
    this.loadFromStorage();
    this.updateCachedSnapshot();
  }

  // Subscribe/unsubscribe for useSyncExternalStore
  subscribe = (listener: WidgetsStoreListener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private notify = () => {
    this.updateCachedSnapshot();
    this.listeners.forEach((listener) => listener());
  };

  private updateCachedSnapshot = () => {
    this.cachedSnapshot = {
      widgets: [...this.widgets],
      currentWidget: this.currentWidgetId ? this.widgets.find((w) => w.id === this.currentWidgetId) || null : null,
      currentWidgetId: this.currentWidgetId,
    };
  };

  // Snapshot functions for useSyncExternalStore
  getSnapshot = () => {
    return this.cachedSnapshot!;
  };

  getServerSnapshot = () => {
    return WidgetsStore.serverSnapshot;
  };

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.widgets = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading widgets from localStorage:", error);
      this.widgets = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.widgets));
    } catch (error) {
      console.error("Error saving widgets to localStorage:", error);
    }
  }

  getAll(): Widget[] {
    return [...this.widgets];
  }

  getById(id: string): Widget | undefined {
    return this.widgets.find((widget) => widget.id === id);
  }

  setCurrentWidget(id: string | null) {
    this.currentWidgetId = id;
    this.notify();
  }

  getCurrentWidget(): Widget | null {
    return this.currentWidgetId ? this.getById(this.currentWidgetId) || null : null;
  }

  create(widget: Omit<Widget, "id">): Widget {
    const newWidget: Widget = {
      ...widget,
      id: nanoid(),
    };
    this.widgets.push(newWidget);
    this.saveToStorage();
    this.notify();
    return newWidget;
  }

  update(id: string, updates: Partial<Widget>): Widget | null {
    const index = this.widgets.findIndex((widget) => widget.id === id);
    if (index === -1) return null;

    this.widgets[index] = { ...this.widgets[index], ...updates };
    this.saveToStorage();
    this.notify();
    return this.widgets[index];
  }

  delete(id: string): boolean {
    const index = this.widgets.findIndex((widget) => widget.id === id);
    if (index === -1) return false;

    this.widgets.splice(index, 1);
    if (this.currentWidgetId === id) {
      this.currentWidgetId = null;
    }
    this.saveToStorage();
    this.notify();
    return true;
  }

  duplicate(id: string): Widget | null {
    const widget = this.getById(id);
    if (!widget) return null;

    const duplicated = this.create({
      ...widget,
      name: `${widget.name} (Copy)`,
    });
    return duplicated;
  }
}

// Singleton instance
export const widgetsStore = new WidgetsStore();
