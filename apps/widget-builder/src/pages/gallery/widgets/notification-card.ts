import { Widget } from "@deer-flow/widget";

export const notificationCard: Omit<Widget, "id"> = {
  name: "Notification Card",
  description: "A notification card showing activity updates with timestamp",
  template: `<Card size="md" padding="md" background="slate-50">
  <Row align="center">
    <Box background={data.type === "success" ? "green-100" : data.type === "warning" ? "yellow-100" : "blue-100"} 
         align="center" justify="center" radius="full" size={60} margin={{x: "auto"}}>
      <Text size="xlg">{data.icon}</Text>
    </Box>
  </Row>
  <Col align="center" gap={3}>
    <Title level="h4">{data.title}</Title>
    <Text color="muted" size="sm">{data.message}</Text>
  </Col>
</Card>`,
  states: [
    {
      name: "Default",
      data: {
        icon: "✓",
        title: "Enable notification",
        message: "Notify me when this item ships",
        type: "success",
      },
    },
  ],
};
