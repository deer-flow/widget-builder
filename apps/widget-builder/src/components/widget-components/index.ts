import React from "react";
import { Box, BoxDefinition } from "./box";
import { Row, RowDefinition } from "./row";
import { Col, ColDefinition } from "./col";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardDefinition,
} from "./card";
import { Text, TextDefinition } from "./text";
import { Title, TitleDefinition } from "./title";
import { Caption, CaptionDefinition } from "./caption";
import { Divider, DividerDefinition } from "./divider";
import { Badge, BadgeDefinition } from "./badge";
import { Image, ImageDefinition } from "./image";
import { Progress, ProgressDefinition } from "./progress";
import { ComponentDefinition } from "monaco-jsx-editor";
import { Button, ButtonDefinition } from "./button";
import { Spacer, SpacerDefinition } from "./spacer";

// Component map type for widget renderer
export type ComponentMap = Record<string, React.ComponentType<any>>;

// Component mapping for JSXSchema tag names to actual components
export const components: ComponentMap = {
  // Controls
  Button,

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

  Divider,
  Spacer,
  Badge,
  Image,
  Progress,
};

export const definitions: ComponentDefinition[] = [
  ButtonDefinition,

  BoxDefinition,
  RowDefinition,
  ColDefinition,

  CardDefinition,

  TextDefinition,
  TitleDefinition,
  CaptionDefinition,

  DividerDefinition,
  SpacerDefinition,
  BadgeDefinition,
  ImageDefinition,
  ProgressDefinition,
];
