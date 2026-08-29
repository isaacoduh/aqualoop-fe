import type { ReactNode } from "react";

import { CustomerNavigationShell } from "@/components/navigation";

export default function CustomerAppLayout({ children }: { children: ReactNode }) {
  return <CustomerNavigationShell>{children}</CustomerNavigationShell>;
}
