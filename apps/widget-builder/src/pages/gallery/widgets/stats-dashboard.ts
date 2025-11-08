import { Widget } from "@deer-flow/widget";

export const statsDashboard: Omit<Widget, "id"> = {
  name: "Stats Dashboard Card",
  description: "A statistics dashboard card with metrics and trend indicators",
  template: `<Card size="md" padding="lg">
  <Row align="center" justify="between">
    <Col gap={1}>
      <Caption>Total Revenue</Caption>
      <Title level="h2">{data.value}</Title>
    </Col>
    <Badge variant={data.trend === "up" ? "success" : "destructive"} size="lg">
      {data.trend === "up" ? "↑" : "↓"} {data.change}
    </Badge>
  </Row>
  
  <Divider margin={{y: "md"}} />
  
  <Row gap={4}>
    <Col gap={1} minWidth="auto">
      <Caption>This Month</Caption>
      <Title level="h4">{data.thisMonth}</Title>
      <Text size="sm" variant="muted">+{data.monthGrowth}% from last month</Text>
    </Col>
    <Spacer />
    <Col gap={1} align="end">
      <Caption>Goal</Caption>
      <Title level="h4">{data.goal}</Title>
      <Progress value={data.progress} size="sm" />
    </Col>
  </Row>
</Card>`,
  states: [
    {
      name: "Default",
      data: {
        value: "$45,231",
        trend: "up",
        change: "12.5%",
        thisMonth: "$12,450",
        monthGrowth: "18",
        goal: "$15,000",
        progress: 83,
      },
    },
  ],
};
