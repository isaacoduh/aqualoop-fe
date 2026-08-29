import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

import { classNames } from "@/lib/class-names";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  compact?: boolean;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <section
      className={classNames(
        "flex flex-col items-center justify-center rounded-panel border border-dashed border-border-strong bg-surface text-center",
        compact ? "px-5 py-8" : "px-6 py-14 sm:py-16",
        className,
      )}
    >
      <span
        className={classNames(
          "grid place-items-center rounded-full bg-primary-soft text-primary",
          compact ? "size-10" : "size-12",
        )}
      >
        <Icon
          aria-hidden="true"
          className={compact ? "size-5" : "size-6"}
          strokeWidth={1.75}
        />
      </span>

      <h2
        className={classNames(
          "font-semibold tracking-tight text-foreground",
          compact ? "mt-3 text-base" : "mt-4 text-xl",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </section>
  );
}
