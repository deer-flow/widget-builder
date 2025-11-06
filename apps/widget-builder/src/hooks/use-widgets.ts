import { useSyncExternalStore, useCallback } from "react";
import { Widget } from "@deer-flow/widget";
import { widgetsStore } from "@/store/widgets-store";

export const defaultWidgetTemplate: Omit<Widget, "id"> = {
  name: "Untitled Widget",
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

export interface UseWidgetsReturn {
  widgets: Widget[];
  currentWidget: Widget | null;

  // CRUD operations
  loadWidget: (id: string) => Widget | null;
  createWidget: (widget: Omit<Widget, "id">) => Widget;
  updateWidget: (id: string, updates: Partial<Widget>) => Widget | null;
  deleteWidget: (id: string) => boolean;
  duplicateWidget: (id: string) => Widget | null;

  // Current widget management
  setCurrentWidget: (id: string | null) => void;
}

export const useWidgets = (): UseWidgetsReturn => {
  // Use useSyncExternalStore to subscribe to the store
  const storeState = useSyncExternalStore(
    widgetsStore.subscribe,
    widgetsStore.getSnapshot,
    widgetsStore.getServerSnapshot
  );

  const loadWidget = useCallback((id: string): Widget | null => {
    const widget = widgetsStore.getById(id);
    if (widget) {
      widgetsStore.setCurrentWidget(id);
    }
    return widget || null;
  }, []);

  const createWidget = useCallback((widget: Omit<Widget, "id">): Widget => {
    const newWidget = widgetsStore.create(widget);
    widgetsStore.setCurrentWidget(newWidget.id);
    return newWidget;
  }, []);

  const updateWidget = useCallback((id: string, updates: Partial<Widget>): Widget | null => {
    return widgetsStore.update(id, updates);
  }, []);

  const deleteWidget = useCallback((id: string): boolean => {
    return widgetsStore.delete(id);
  }, []);

  const duplicateWidget = useCallback((id: string): Widget | null => {
    return widgetsStore.duplicate(id);
  }, []);

  const setCurrentWidget = useCallback((id: string | null) => {
    widgetsStore.setCurrentWidget(id);
  }, []);

  return {
    widgets: storeState.widgets,
    currentWidget: storeState.currentWidget,
    loadWidget,
    createWidget,
    updateWidget,
    deleteWidget,
    duplicateWidget,
    setCurrentWidget,
  };
};
