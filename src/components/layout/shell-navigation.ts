import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface ShellNavigationItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: ReactNode;
  exact?: boolean;
  disabled?: boolean;
}

export interface ShellNavigationSection {
  label: string;
  items: readonly ShellNavigationItem[];
}

export function isNavigationItemActive(
  item: ShellNavigationItem,
  activeHref: string,
): boolean {
  if (item.exact || item.href === "/") {
    return activeHref === item.href;
  }

  return (
    activeHref === item.href ||
    activeHref.startsWith(`${item.href}/`)
  );
}
