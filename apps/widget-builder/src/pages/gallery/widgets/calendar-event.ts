import { Widget } from "@deer-flow/widget";

export const calendarEvent: Omit<Widget, "id"> = {
  name: "Calendar Event",
  description: "An event card showing meeting details and participants",
  template: `<Card size="md" padding="md">
  <Row align="center" gap={2}>
    <Box background="blue-500" padding="md" radius="md">
      <Col align="center" gap={0}>
        <Text color="white" size="xs" weight="medium">{data.month}</Text>
        <Title level="h2" color="white">{data.day}</Title>
      </Col>
    </Box>
    
    <Col gap={1} minWidth="auto">
      <Title level="h4">{data.title}</Title>
      <Row align="center" gap={2}>
        <Text color="muted" size="sm">🕐 {data.time}</Text>
        <Text color="muted" size="sm">📍 {data.location}</Text>
      </Row>
    </Col>
  </Row>
  
  <Divider margin="md" />
  
  <Col gap={2}>
    <Text size="sm" color="muted">{data.description}</Text>
    
    <Row align="center" gap={2}>
      <Caption>Participants:</Caption>
      <Row gap={1}>
        {data.participants.map((participant, i) => (
          <Image 
            key={i}
            src={participant.avatar}
            size={28}
            radius="full"
          />
        ))}
      </Row>
      <Text size="sm" color="muted">+{data.moreParticipants}</Text>
    </Row>
    
    <Row gap={2}>
      <Button size="sm" variant="default">Accept</Button>
      <Button size="sm" variant="outline">Maybe</Button>
      <Button size="sm" variant="ghost">Decline</Button>
    </Row>
  </Col>
</Card>`,
  states: [
    {
      name: "Default",
      data: {
        month: "NOV",
        day: "15",
        title: "Team Sync Meeting",
        time: "2:00 PM - 3:00 PM",
        location: "Conference Room A",
        description: "Weekly team sync to discuss project progress and upcoming milestones",
        participants: [
          { avatar: "https://picsum.photos/150/150?random=6" },
          { avatar: "https://picsum.photos/150/150?random=7" },
          { avatar: "https://picsum.photos/150/150?random=8" }
        ],
        moreParticipants: "5"
      }
    }
  ]
};
