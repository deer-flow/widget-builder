import * as LucideIcons from "lucide-react";
import { ComponentDefinition } from "monaco-jsx-editor";
import React from "react";

import { cn } from "@/lib/utils";

export interface IconProps extends React.HTMLAttributes<SVGElement> {
  name: string;
  color?: string;
  size?: number | string;
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(({ name, color, size = 24, className, ...props }, ref) => {
  // Get the icon component from lucide-react
  // Convert kebab-case or snake_case to PascalCase for icon lookup
  const iconName = name
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

  const IconComponent = (LucideIcons as Record<string, React.ComponentType<LucideIcons.LucideProps>>)[iconName];

  if (!IconComponent) {
    // Return a placeholder if icon not found
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color || "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(className)}
        {...props}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="9" y1="9" x2="15" y2="15" />
        <line x1="15" y1="9" x2="9" y2="15" />
      </svg>
    );
  }

  return <IconComponent ref={ref} size={size} color={color} className={cn(className)} {...props} />;
});
Icon.displayName = "Icon";

const IconDefinition: ComponentDefinition = {
  name: "Icon",
  description: "An icon component that maps to icons from the lucide-react library.",
  props: [
    {
      name: "name",
      type: "string",
      required: true,
      description:
        "The name of the icon from lucide-react (e.g., 'Home', 'User', 'Settings', 'Search'). Supports PascalCase, kebab-case, or snake_case.",
    },
    {
      name: "color",
      type: "string",
      description: "The color of the icon. Can be any valid CSS color value.",
    },
    {
      name: "size",
      type: "number | string",
      defaultValue: "24",
      description: "The size of the icon in pixels.",
    },
  ],
  category: "Display",
  usage: `<Icon name="Home" size={32} color="#3b82f6" />`,
};

export { Icon, IconDefinition };
