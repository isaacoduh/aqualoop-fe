import type { ReactNode } from "react";

import { classNames } from "@/lib/class-names";

export type StatusBadgeTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

export type StatusBadgeSize = "sm" | "md";

export interface StatusBadgeProps {
  children: ReactNode;
  tone?: StatusBadgeTone;
  size?: StatusBadgeSize;
  showDot?: boolean;
  className?: string;
}

const toneClassNames: Record<StatusBadgeTone, string> = {
  neutral: "border-border bg-surface-muted text-muted-foreground",
  info: "border-info/15 bg-info-soft text-info",
  success: "border-success/15 bg-success-soft text-success",
  warning: "border-warning/15 bg-warning-soft text-warning",
  danger: "border-danger/15 bg-danger-soft text-danger",
};

const dotClassNames: Record<StatusBadgeTone, string> = {
  neutral: "bg-muted-foreground",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export function StatusBadge({
  children,
  tone = "neutral",
  size = "md",
  showDot = true,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={classNames(
        "inline-flex w-fit items-center rounded-pill border font-semibold",
        size === "sm"
          ? "gap-1.5 px-2 py-0.5 text-xs"
          : "gap-2 px-2.5 py-1 text-sm",
        toneClassNames[tone],
        className,
      )}
    >
      {showDot ? (
        <span
          aria-hidden="true"
          className={classNames("size-1.5 rounded-full", dotClassNames[tone])}
        />
      ) : null}
      {children}
    </span>
  );
}
