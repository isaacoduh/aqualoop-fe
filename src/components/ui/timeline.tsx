import type { LucideIcon } from "lucide-react";
import {
  Check,
  Circle,
  Clock3,
  X,
} from "lucide-react";

import { classNames } from "@/lib/class-names";

export type TimelineItemState =
  | "complete"
  | "current"
  | "upcoming"
  | "error";

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  dateTime?: string;
  state: TimelineItemState;
  icon?: LucideIcon;
}

export interface TimelineProps {
  items: readonly TimelineItem[];
  label?: string;
  className?: string;
}

const stateStyles: Record<
  TimelineItemState,
  { marker: string; connector: string; icon: LucideIcon }
> = {
  complete: {
    marker: "border-success bg-success text-white",
    connector: "bg-success",
    icon: Check,
  },
  current: {
    marker: "border-primary bg-primary-soft text-primary",
    connector: "bg-border-strong",
    icon: Clock3,
  },
  upcoming: {
    marker: "border-border-strong bg-surface text-muted-foreground",
    connector: "bg-border",
    icon: Circle,
  },
  error: {
    marker: "border-danger bg-danger-soft text-danger",
    connector: "bg-border-strong",
    icon: X,
  },
};

export function Timeline({
  items,
  label = "Progress",
  className,
}: TimelineProps) {
  return (
    <ol aria-label={label} className={classNames("space-y-0", className)}>
      {items.map((item, index) => {
        const styles = stateStyles[item.state];
        const Icon = item.icon ?? styles.icon;
        const last = index === items.length - 1;

        return (
          <li
            key={item.id}
            aria-current={item.state === "current" ? "step" : undefined}
            className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3"
          >
            <div className="relative flex justify-center">
              {!last ? (
                <span
                  aria-hidden="true"
                  className={classNames(
                    "absolute top-9 bottom-0 w-0.5",
                    styles.connector,
                  )}
                />
              ) : null}
              <span
                className={classNames(
                  "relative z-10 grid size-8 place-items-center rounded-full border",
                  styles.marker,
                )}
              >
                <Icon
                  aria-hidden="true"
                  className="size-4"
                  strokeWidth={2}
                />
              </span>
            </div>

            <div className={classNames("min-w-0", !last && "pb-7")}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold text-foreground">{item.title}</p>
                {item.timestamp ? (
                  <time
                    dateTime={item.dateTime}
                    className="text-xs text-muted-foreground"
                  >
                    {item.timestamp}
                  </time>
                ) : null}
              </div>
              {item.description ? (
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
