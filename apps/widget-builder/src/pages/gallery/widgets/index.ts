import { Widget } from "@deer-flow/widget";

import { calendarEvent } from "./calendar-event";
import { emailPreview } from "./email-preview";
import { musicPlayer } from "./music-player";
import { notificationCard } from "./notification-card";
import { productCard } from "./product-card";
import { socialMediaPost } from "./social-media-post";
import { statsDashboard } from "./stats-dashboard";
import { taskListItem } from "./task-list-item";
import { userProfileCard } from "./user-profile-card";
import { weatherWidget } from "./weather-widget";

export interface GalleryWidget {
  widget: Omit<Widget, "id">;
  thumbnail?: string;
}

export const galleryWidgets: GalleryWidget[] = [
  { widget: userProfileCard },
  { widget: taskListItem },
  { widget: notificationCard },
  { widget: weatherWidget },
  { widget: statsDashboard },
  { widget: musicPlayer },
  { widget: socialMediaPost },
  { widget: calendarEvent },
  { widget: emailPreview },
  { widget: productCard },
];
