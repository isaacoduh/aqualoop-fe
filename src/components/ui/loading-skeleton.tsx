import type { ReactNode } from "react";

import { classNames } from "@/lib/class-names";

export type LoadingSkeletonShape = "text" | "rectangle" | "circle";

export interface LoadingSkeletonProps {
  shape?: LoadingSkeletonShape;
  className?: string;
}

export interface LoadingRegionProps {
  children: ReactNode;
  label?: string;
  className?: string;
}

export function LoadingSkeleton({
  shape = "rectangle",
  className,
}: LoadingSkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={classNames(
        "block animate-pulse bg-disabled",
        shape === "text" && "h-4 rounded-pill",
        shape === "rectangle" && "rounded-card",
        shape === "circle" && "aspect-square rounded-full",
        className,
      )}
    />
  );
}

export function LoadingRegion({
  children,
  label = "Loading content",
  className,
}: LoadingRegionProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={className}
    >
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
