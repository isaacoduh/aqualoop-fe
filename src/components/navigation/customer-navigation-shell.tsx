"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AppShell } from "@/components/layout";
import {
  customerPrimaryNavigation,
  customerSecondaryNavigation,
} from "@/config/navigation";

export function CustomerNavigationShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AppShell
      activeHref={pathname}
      homeHref="/app"
      navigation={customerPrimaryNavigation}
      secondaryNavigation={customerSecondaryNavigation}
    >
      {children}
    </AppShell>
  );
}
