import { Widget } from "@deer-flow/widget";

export const socialMediaPost: Omit<Widget, "id"> = {
  name: "Social Media Post",
  description: "A social media post card with engagement metrics",
  template: `<Card size="md" padding="md">
  <Row align="center" gap={2}>
    <Image 
      src={data.author.avatar}
      size={40}
      radius="full"
    />
    <Col gap={0}>
      <Text weight="medium">{data.author.name}</Text>
      <Caption>{data.timestamp}</Caption>
    </Col>
    <Spacer />
    <Button size="sm" variant="ghost">•••</Button>
  </Row>
  
  <Box padding="sm">
    <Text>{data.content}</Text>
  </Box>
  
  {data.image && <Image 
    src={data.image}
    aspect="video"
    radius="md"
    margin="sm"
  />}
  
  <Divider margin="sm" />
  
  <Row gap={4} justify="around">
    <Row align="center" gap={1}>
      <Text>❤️</Text>
      <Text weight="medium">{data.likes}</Text>
    </Row>
    <Row align="center" gap={1}>
      <Text>💬</Text>
      <Text weight="medium">{data.comments}</Text>
    </Row>
    <Row align="center" gap={1}>
      <Text>↗️</Text>
      <Text weight="medium">{data.shares}</Text>
    </Row>
  </Row>
</Card>`,
  states: [
    {
      name: "Default",
      data: {
        author: {
          name: "Alex Johnson",
          avatar: "https://picsum.photos/150/150?random=5"
        },
        timestamp: "2 hours ago",
        content: "Just launched our new product! Excited to share this journey with you all. 🚀",
        image: "https://picsum.photos/600/400?random=30",
        likes: "234",
        comments: "45",
        shares: "12"
      }
    }
  ]
};
