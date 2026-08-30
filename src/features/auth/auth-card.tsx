import type { ReactNode } from "react";

import { classNames } from "@/lib/class-names";

interface AuthCardProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <section
      className={classNames(
        "mx-auto w-full max-w-lg overflow-hidden rounded-panel border border-border bg-surface shadow-card",
        className,
      )}
    >
      <div className="px-5 py-6 sm:px-8 sm:py-8">
        <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-heading-1 font-semibold text-foreground">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
          {description}
        </p>
        <div className="mt-7">{children}</div>
      </div>
      {footer ? (
        <footer className="border-t border-border bg-surface-subtle px-5 py-4 text-center text-sm text-muted-foreground sm:px-8">
          {footer}
        </footer>
      ) : null}
    </section>
  );
}
