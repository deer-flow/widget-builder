import { Widget } from "@deer-flow/widget";

export const musicPlayer: Omit<Widget, "id"> = {
  name: "Music Player",
  description: "A compact music player widget with controls",
  template: `<Card size="md" padding="lg" background="gradient-to-br from-purple-500 to-pink-500">
  <Row align="center" gap={3}>
    <Image 
      src={data.albumArt}
      size={80}
      radius="md"
      fit="cover"
    />
    <Col gap={1} minWidth="auto">
      <Title level="h4" color="white">{data.title}</Title>
      <Text color="white" size="sm">{data.artist}</Text>
      <Caption color="white">{data.album}</Caption>
    </Col>
  </Row>
  
  <Box margin="md">
    <Progress value={data.progress} />
    <Row justify="between" margin="xs">
      <Caption color="white">{data.currentTime}</Caption>
      <Caption color="white">{data.duration}</Caption>
    </Row>
  </Box>
  
  <Row gap={2} justify="center" align="center">
    <Button size="sm" variant="outline">⏮</Button>
    <Button size="lg">{data.playing ? "⏸" : "▶"}</Button>
    <Button size="sm" variant="outline">⏭</Button>
  </Row>
</Card>`,
  states: [
    {
      name: "Default",
      data: {
        albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
        title: "Midnight Dreams",
        artist: "Luna Rivers",
        album: "Neon Nights",
        currentTime: "2:34",
        duration: "4:12",
        progress: 62,
        playing: true
      }
    }
  ]
};
