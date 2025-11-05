import React from "react";
import { Box } from "./box";
import { Row } from "./row";
import { Col } from "./col";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card";
import { Text } from "./text";
import { Title } from "./title";
import { Caption } from "./caption";
import { Divider } from "./divider";
import { Badge } from "./badge";
import { Avatar } from "./avatar";
import { Image } from "./image";
import { Progress } from "./progress";
import { List, ListItem } from "./list";
import { Button } from "@/components/ui/button";

// Component map type for widget renderer
export type ComponentMap = Record<string, React.ComponentType<any>>;

// Component mapping for JSXSchema tag names to actual components
export const components: ComponentMap = {
  // Layout
  Box,
  Row,
  Col,

  // Card
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,

  // Typography
  Text,
  Title,
  Caption,

  // UI Elements
  Button,
  Divider,
  Badge,
  Avatar,
  Image,
  Progress,

  // Lists
  List,
  ListItem,
};
