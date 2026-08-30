import { ShoppingBasket } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/ui";

export function CheckoutGuard({
  title,
  description,
  href,
  actionLabel,
}: {
  title: string;
  description: string;
  href: string;
  actionLabel: string;
}) {
  return (
    <EmptyState
      icon={ShoppingBasket}
      title={title}
      description={description}
      action={<Link href={href} className="inline-flex min-h-control items-center justify-center rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">{actionLabel}</Link>}
    />
  );
}
