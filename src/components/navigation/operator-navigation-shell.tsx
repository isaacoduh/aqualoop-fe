"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AppShell } from "@/components/layout";
import {
  operatorPrimaryNavigation,
  operatorSecondaryNavigation,
} from "@/config/navigation";

export function OperatorNavigationShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AppShell
      activeHref={pathname}
      homeHref="/operator"
      navigation={operatorPrimaryNavigation}
      secondaryNavigation={operatorSecondaryNavigation}
    >
      {children}
    </AppShell>
  );
}
