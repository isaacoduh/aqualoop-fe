import { ArrowRight, Building2, UserRound } from "lucide-react";
import Link from "next/link";

const accountTypes = [
  {
    title: "Customer account",
    description: "Find nearby refill businesses, order water, and manage reusable bottles.",
    href: "/customer/onboarding/details",
    action: "Continue as customer",
    icon: UserRound,
  },
  {
    title: "Operator account",
    description: "Run a refill business, manage stock, fulfil orders, and track earnings.",
    href: "/operator/register",
    action: "Continue as operator",
    icon: Building2,
  },
] as const;

export function AccountTypeChoice() {
  return (
    <div className="grid gap-4">
      {accountTypes.map((accountType) => {
        const Icon = accountType.icon;
        return (
          <Link
            key={accountType.title}
            href={accountType.href}
            className="group rounded-card border border-border bg-surface p-5 transition hover:border-primary hover:shadow-card focus-visible:outline-none"
          >
            <span className="flex size-11 items-center justify-center rounded-control bg-primary-soft text-primary">
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <h2 className="mt-4 font-semibold text-foreground">
              {accountType.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {accountType.description}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              {accountType.action}
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
