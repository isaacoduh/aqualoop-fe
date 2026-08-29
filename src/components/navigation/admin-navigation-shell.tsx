"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AdminShell } from "@/components/layout";
import { adminNavigationSections } from "@/config/navigation";

export function AdminNavigationShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AdminShell
      activeHref={pathname}
      homeHref="/admin"
      sections={adminNavigationSections}
    >
      {children}
    </AdminShell>
  );
}
