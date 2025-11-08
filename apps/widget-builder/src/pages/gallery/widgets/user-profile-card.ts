import { Widget } from "@deer-flow/widget";

export const userProfileCard: Omit<Widget, "id"> = {
  name: "User Profile Card",
  description: "A beautiful user profile card with avatar, name, and social stats",
  template: `<Card size="md" padding="lg">
  <Row align="center" gap={3}>
    <Image 
      src={data.avatar}
      size={80}
      radius="full"
      fit="cover"
    />
    <Col gap={1}>
      <Title level="h3">{data.name}</Title>
      <Text color="muted">{data.role}</Text>
      <Text color="muted" size="sm">{data.location}</Text>
    </Col>
  </Row>
  
  <Divider margin="md" />
  
  <Row gap={4} justify="around">
    <Col align="center" gap={1}>
      <Title level="h4">{data.stats.followers}</Title>
      <Caption>Followers</Caption>
    </Col>
    <Col align="center" gap={1}>
      <Title level="h4">{data.stats.following}</Title>
      <Caption>Following</Caption>
    </Col>
    <Col align="center" gap={1}>
      <Title level="h4">{data.stats.posts}</Title>
      <Caption>Posts</Caption>
    </Col>
  </Row>
  
  <Divider margin="md" />
  
  <Row gap={2}>
    <Button size="sm" variant="default">Follow</Button>
    <Button size="sm" variant="outline">Message</Button>
  </Row>
</Card>`,
  states: [
    {
      name: "Default",
      data: {
        avatar: "https://picsum.photos/150/150?random=1",
        name: "Sarah Anderson",
        role: "Product Designer",
        location: "San Francisco, CA",
        stats: {
          followers: "2.4K",
          following: "486",
          posts: "127"
        }
      }
    }
  ]
};
