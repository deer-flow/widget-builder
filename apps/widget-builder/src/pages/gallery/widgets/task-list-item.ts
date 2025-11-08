import { Widget } from "@deer-flow/widget";

export const taskListItem: Omit<Widget, "id"> = {
  name: "Task List Item",
  description: "An elegant task list item with priority badge and due date",
  template: `<Card size="md" padding="md">
  <Row align="center" gap={3}>
    <Box>
      <Badge variant={data.priority === "high" ? "destructive" : data.priority === "medium" ? "warning" : "success"}>
        {data.priority}
      </Badge>
    </Box>
    
    <Col gap={1} minWidth="auto">
      <Title level="h4">{data.title}</Title>
      <Text color="muted" size="sm">{data.description}</Text>
    </Col>
    
    <Spacer />
    
    <Col align="end" gap={1}>
      <Caption>Due Date</Caption>
      <Text size="sm" weight="medium">{data.dueDate}</Text>
    </Col>
  </Row>
  
  <Divider margin="sm" />
  
  <Row align="center" gap={2}>
    <Image 
      src={data.assignee.avatar}
      size={24}
      radius="full"
    />
    <Text size="sm" color="muted">{data.assignee.name}</Text>
    <Spacer />
    <Progress value={data.progress} size="sm" />
    <Text size="sm" weight="medium">{data.progress}%</Text>
  </Row>
</Card>`,
  states: [
    {
      name: "Default",
      data: {
        title: "Redesign Landing Page",
        description: "Update the homepage with new branding and animations",
        priority: "high",
        dueDate: "Nov 12",
        progress: 65,
        assignee: {
          name: "Mike Chen",
          avatar: "https://picsum.photos/150/150?random=3"
        }
      }
    }
  ]
};
