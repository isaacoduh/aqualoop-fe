import type { ReactNode } from "react";

import { OperatorNavigationShell } from "@/components/navigation";

export default function OperatorWorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <OperatorNavigationShell>{children}</OperatorNavigationShell>;
}
