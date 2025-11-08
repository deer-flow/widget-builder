import { Widget } from "@deer-flow/widget";

export const productCard: Omit<Widget, "id"> = {
  name: "Product Card",
  description: "An e-commerce product card with image, details, and actions",
  template: `<Card size="md" padding="md">
  <Image 
    src={data.image}
    aspect="square"
    radius="md"
    fit="cover"
  />
  
  <Col gap={2} padding="sm">
    <Row align="center" justify="between">
      <Badge variant="secondary">{data.category}</Badge>
      <Row align="center" gap={1}>
        <Text size="lg" color="yellow-500">★</Text>
        <Text weight="medium">{data.rating}</Text>
      </Row>
    </Row>
    
    <Col gap={1}>
      <Title level="h4">{data.name}</Title>
      <Text color="muted" size="sm" truncate>{data.description}</Text>
    </Col>
    
    <Row align="center" justify="between">
      <Col gap={0}>
        <Title level="h3">{data.price}</Title>
        {data.oldPrice && <Text size="sm" color="muted" style="text-decoration: line-through">{data.oldPrice}</Text>}
      </Col>
      <Button size="sm">Add to Cart</Button>
    </Row>
  </Col>
</Card>`,
  states: [
    {
      name: "Default",
      data: {
        image: "https://picsum.photos/400/400?random=10",
        name: "Wireless Headphones",
        description: "Premium noise-cancelling headphones with 30h battery life",
        category: "Audio",
        price: "$299",
        oldPrice: "$399",
        rating: "4.8"
      }
    }
  ]
};
