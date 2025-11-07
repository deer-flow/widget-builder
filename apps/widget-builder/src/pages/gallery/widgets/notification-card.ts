import { Widget } from "@deer-flow/widget";

export const notificationCard: Omit<Widget, "id"> = {
  name: "Notification Card",
  description: "A notification card showing activity updates with timestamp",
  template: `<Card size="md" padding="md" background="slate-50">
  <Row align="center" gap={3}>
    <Box background={data.type === "success" ? "green-100" : data.type === "warning" ? "yellow-100" : "blue-100"} 
         padding="sm" radius="full">
      <Text size="lg">{data.icon}</Text>
    </Box>
    
    <Col gap={1} minWidth="auto">
      <Row align="center" gap={2}>
        <Title level="h4">{data.title}</Title>
        <Badge variant={data.type === "success" ? "success" : data.type === "warning" ? "warning" : "default"} size="sm">
          {data.type}
        </Badge>
      </Row>
      <Text color="muted" size="sm">{data.message}</Text>
      <Caption>{data.timestamp}</Caption>
    </Col>
  </Row>
</Card>`,
  states: [
    {
      name: "Default",
      data: {
        icon: "✓",
        title: "Deployment Successful",
        message: "Your application has been deployed to production",
        type: "success",
        timestamp: "2 minutes ago"
      }
    }
  ]
};
