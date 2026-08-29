import type { ReactNode } from "react";

import { AdminNavigationShell } from "@/components/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminNavigationShell>{children}</AdminNavigationShell>;
}
