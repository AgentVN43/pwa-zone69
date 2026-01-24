import { useState } from "react";

export interface DrawerMenuItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  onClick?: () => void;
  children?: DrawerMenuItem[];
}

export const drawerMenuItems: DrawerMenuItem[] = [
  {
    id: "home",
    label: "Home",
    icon: "🎬",
    href: "/",
  },
  {
    id: "chat",
    label: "Assistant",
    icon: "💬",
    href: "/chat",
  },
  {
    id: "discover",
    label: "Discover",
    icon: "🔍",
    children: [
      { id: "trending", label: "Trending", icon: "🔥", href: "/" },
      { id: "new", label: "New Releases", icon: "✨", href: "/" },
    ],
  },
  {
    id: "links",
    label: "Links",
    icon: "🔗",
    children: [
      { id: "github", label: "GitHub", icon: "🐙", href: "https://github.com" },
      { id: "twitter", label: "Twitter", icon: "𝕏", href: "https://twitter.com" },
    ],
  },
  {
    id: "about",
    label: "About",
    icon: "ℹ️",
    href: "/",
  },
];

export function useDrawerNavigation() {
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return { drawerMenuItems, expanded, toggleExpanded };
}
