import { Widget } from "@deer-flow/widget";

export const emailPreview: Omit<Widget, "id"> = {
  name: "Email Preview",
  description: "An email preview card with sender info and quick actions",
  template: `<Card size="md" padding="md">
  <Row align="center" gap={2}>
    <Image 
      src={data.sender.avatar}
      size={48}
      radius="full"
    />
    <Col gap={0} minWidth="auto">
      <Row align="center" gap={2}>
        <Text weight="medium">{data.sender.name}</Text>
        {data.unread && <Badge variant="default" size="sm">New</Badge>}
      </Row>
      <Text color="muted" size="sm">{data.sender.email}</Text>
    </Col>
    <Spacer />
    <Caption>{data.time}</Caption>
  </Row>
  
  <Box padding="sm">
    <Title level="h4">{data.subject}</Title>
  </Box>
  
  <Text color="muted" size="sm" truncate>
    {data.preview}
  </Text>
  
  {data.hasAttachment && (
    <Row align="center" gap={1} margin="sm">
      <Text size="sm">📎</Text>
      <Text size="sm" color="muted">{data.attachmentCount} attachment{data.attachmentCount > 1 ? "s" : ""}</Text>
    </Row>
  )}
  
  <Divider margin="sm" />
  
  <Row gap={2} justify="end">
    <Button size="sm" variant="ghost">Archive</Button>
    <Button size="sm" variant="outline">Reply</Button>
  </Row>
</Card>`,
  states: [
    {
      name: "Default",
      data: {
        sender: {
          name: "Emma Wilson",
          email: "emma@company.com",
          avatar: "https://picsum.photos/150/150?random=9"
        },
        subject: "Q4 Marketing Strategy Review",
        preview: "Hi team, I've prepared the Q4 marketing strategy document. Please review the attached presentation and share your feedback before Friday's meeting...",
        time: "10:30 AM",
        unread: true,
        hasAttachment: true,
        attachmentCount: 2
      }
    }
  ]
};
