import { ComponentDefinition } from "monaco-jsx-editor";
import React from "react";

import { Badge, BadgeDefinition } from "./badge";
import { Box, BoxDefinition } from "./box";
import { Button, ButtonDefinition } from "./button";
import { Caption, CaptionDefinition } from "./caption";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardDefinition } from "./card";
import { Col, ColDefinition } from "./col";
import { Divider, DividerDefinition } from "./divider";
import { Image, ImageDefinition } from "./image";
import { Progress, ProgressDefinition } from "./progress";
import { Row, RowDefinition } from "./row";
import { Spacer, SpacerDefinition } from "./spacer";
import { Text, TextDefinition } from "./text";
import { Title, TitleDefinition } from "./title";

// Component map type for widget renderer
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
