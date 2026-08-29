import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Bell } from "lucide-react";

import { classNames } from "@/lib/class-names";

export type NotificationRowTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

export interface NotificationRowProps {
  title: string;
  body: string;
  timestamp: string;
  dateTime?: string;
  href?: string;
  unread?: boolean;
  icon?: LucideIcon;
  tone?: NotificationRowTone;
  metadata?: ReactNode;
  className?: string;
}

const iconToneClassNames: Record<NotificationRowTone, string> = {
  neutral: "bg-surface-muted text-muted-foreground",
  info: "bg-info-soft text-info",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
};

export function NotificationRow({
  title,
  body,
  timestamp,
  dateTime,
  href,
  unread = false,
  icon: Icon = Bell,
  tone = "neutral",
  metadata,
  className,
}: NotificationRowProps) {
  const content = (
    <>
      <span
        className={classNames(
          "grid size-10 shrink-0 place-items-center rounded-full",
          iconToneClassNames[tone],
        )}
      >
        <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-start justify-between gap-2">
          <span
            className={classNames(
              "text-sm text-foreground",
              unread ? "font-semibold" : "font-medium",
            )}
          >
            {title}
          </span>
          <time
            dateTime={dateTime}
            className="shrink-0 text-xs text-muted-foreground"
          >
            {timestamp}
          </time>
        </span>
        <span className="mt-1 block text-sm leading-6 text-muted-foreground">
          {body}
        </span>
        {metadata ? (
          <span className="mt-2 block text-xs font-medium text-muted-foreground">
            {metadata}
          </span>
        ) : null}
      </span>

      {unread ? (
        <span className="mt-1 flex shrink-0 items-center">
          <span className="sr-only">Unread</span>
          <span aria-hidden="true" className="size-2 rounded-full bg-primary" />
        </span>
      ) : null}
    </>
  );
  const classes = classNames(
    "flex items-start gap-3 border-b border-border bg-surface px-4 py-4 last:border-b-0",
    href && "transition-colors hover:bg-surface-subtle",
    unread && "bg-primary-soft/35",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <article className={classes}>{content}</article>;
}
