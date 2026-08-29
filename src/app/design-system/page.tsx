import type { Metadata } from "next";

import { ComponentShowcase } from "@/app/design-system/component-showcase";

export const metadata: Metadata = {
  title: "Component Lab | AquaLoop",
  description: "Internal showcase for AquaLoop shared interface components.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignSystemPage() {
  return <ComponentShowcase />;
}
