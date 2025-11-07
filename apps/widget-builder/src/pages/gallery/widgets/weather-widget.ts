import { Widget } from "@deer-flow/widget";

export const weatherWidget: Omit<Widget, "id"> = {
  name: "Weather Widget",
  description: "Current weather conditions with forecast",
  template: `<Card size="md" padding="lg" background="gradient-to-br from-blue-400 to-blue-600">
  <Col gap={2}>
    <Row align="center" justify="between">
      <Col gap={1}>
        <Title level="h3" color="white">{data.location}</Title>
        <Caption color="white">{data.date}</Caption>
      </Col>
      <Text size="4xl">{data.icon}</Text>
    </Row>
    
    <Row align="end" gap={1}>
      <Title level="h1" color="white">{data.temperature}</Title>
      <Text size="2xl" color="white">°C</Text>
    </Row>
    
    <Text color="white" weight="medium">{data.condition}</Text>
    
    <Divider margin="sm" />
    
    <Row gap={4} justify="around">
      <Col align="center" gap={1}>
        <Caption color="white">Humidity</Caption>
        <Text color="white" weight="medium">{data.humidity}%</Text>
      </Col>
      <Col align="center" gap={1}>
        <Caption color="white">Wind</Caption>
        <Text color="white" weight="medium">{data.wind} km/h</Text>
      </Col>
      <Col align="center" gap={1}>
        <Caption color="white">Feels Like</Caption>
        <Text color="white" weight="medium">{data.feelsLike}°</Text>
      </Col>
    </Row>
  </Col>
</Card>`,
  states: [
    {
      name: "Default",
      data: {
        location: "San Francisco",
        date: "Monday, Nov 7",
        icon: "☀️",
        temperature: "22",
        condition: "Sunny",
        humidity: "65",
        wind: "12",
        feelsLike: "24"
      }
    }
  ]
};
