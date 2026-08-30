"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const segmentLabels: Record<string, string> = {
  app: "Customer home",
  admin: "Admin dashboard",
  operator: "Operator dashboard",
  auth: "Authentication",
  order: "Checkout",
};

function pageTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const leaf = segments.at(-1);

  if (!leaf) return "AquaLoop";

  const label = segmentLabels[leaf] ?? leaf
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

  return `${label} | AquaLoop`;
}

export function RouteDocumentTitle() {
  const pathname = usePathname();

  useEffect(() => {
    const title = pageTitle(pathname);
    document.title = title;
    const frame = requestAnimationFrame(() => {
      document.title = title;
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
