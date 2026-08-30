import { ArrowRight, BadgeCheck } from "lucide-react";
import Link from "next/link";

interface SuccessPanelProps {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function SuccessPanel({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
  secondaryLabel,
  secondaryHref,
}: SuccessPanelProps) {
  return (
    <section className="mx-auto w-full max-w-lg rounded-panel border border-border bg-surface px-6 py-10 text-center shadow-card sm:px-10 sm:py-12">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success-soft text-success">
        <BadgeCheck aria-hidden="true" className="size-9" />
      </span>
      <p className="mt-6 text-xs font-bold tracking-[0.18em] text-primary uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-heading-1 font-semibold text-foreground">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base leading-7 text-muted-foreground">
        {description}
      </p>
      <Link
        href={actionHref}
        className="mt-8 inline-flex min-h-control w-full items-center justify-center gap-2 rounded-control bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
      >
        {actionLabel}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
      {secondaryHref && secondaryLabel ? (
        <Link
          href={secondaryHref}
          className="mt-4 inline-flex text-sm font-semibold text-primary hover:text-primary-hover"
        >
          {secondaryLabel}
        </Link>
      ) : null}
    </section>
  );
}
