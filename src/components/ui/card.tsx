import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import { classNames } from "@/lib/class-names";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={classNames(
        "rounded-card border border-border bg-surface shadow-card",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={classNames(
        "flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6",
        className,
      )}
      {...props}
    />
  );
}

export interface CardTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h2" | "h3" | "h4";
}

export function CardTitle({
  as: Component = "h3",
  className,
  ...props
}: CardTitleProps) {
  return (
    <Component
      className={classNames(
        "font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={classNames(
        "mt-1 text-sm leading-6 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={classNames("px-5 py-5 sm:px-6", className)}
      {...props}
    />
  );
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function CardFooter({
  className,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={classNames(
        "flex items-center gap-3 border-t border-border px-5 py-4 sm:px-6",
        className,
      )}
      {...props}
    />
  );
}
