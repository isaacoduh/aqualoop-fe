import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronDown, Menu, ShieldCheck } from "lucide-react";

import {
  isNavigationItemActive,
  type ShellNavigationItem,
  type ShellNavigationSection,
} from "@/components/layout/shell-navigation";
import { classNames } from "@/lib/class-names";
import { SkipLink } from "@/components/accessibility/skip-link";

export interface AdminShellProps {
  children: ReactNode;
  sections: readonly ShellNavigationSection[];
  activeHref: string;
  title?: string;
  description?: string;
  homeHref?: string;
  headerActions?: ReactNode;
  account?: ReactNode;
}

function AdminBrand({ homeHref }: { homeHref: string }) {
  return (
    <Link
      href={homeHref}
      className="inline-flex items-center gap-2 rounded-control font-semibold tracking-tight text-foreground"
    >
      <span className="grid size-9 place-items-center rounded-control bg-foreground text-surface">
        <ShieldCheck
          aria-hidden="true"
          className="size-5"
          strokeWidth={1.75}
        />
      </span>
      <span>
        AquaLoop <span className="text-muted-foreground">Admin</span>
      </span>
    </Link>
  );
}

function AdminNavigationLink({
  item,
  activeHref,
}: {
  item: ShellNavigationItem;
  activeHref: string;
}) {
  const active = isNavigationItemActive(item, activeHref);
  const Icon = item.icon;
  const content = (
    <>
      <Icon
        aria-hidden="true"
        className="size-4 shrink-0"
        strokeWidth={1.75}
      />
      <span className="truncate">{item.label}</span>
      {item.badge !== undefined ? (
        <span className="ml-auto rounded-pill bg-surface-muted px-2 py-0.5 text-xs font-semibold">
          {item.badge}
        </span>
      ) : null}
    </>
  );
  const classes = classNames(
    "flex min-h-control items-center gap-2 rounded-control px-3 py-2 text-sm font-medium transition-colors",
    active
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
    item.disabled && "cursor-not-allowed opacity-50",
  );

  if (item.disabled) {
    return (
      <span aria-disabled="true" className={classes}>
        {content}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={classes}
    >
      {content}
    </Link>
  );
}

export function AdminShell({
  children,
  sections,
  activeHref,
  title,
  description,
  homeHref = "/admin",
  headerActions,
  account,
}: AdminShellProps) {
  return (
    <div className="min-h-dvh bg-surface-subtle text-foreground">
      <SkipLink targetId="admin-main-content" />

      <div className="lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-dvh flex-col overflow-y-auto border-r border-border bg-surface px-4 py-5 lg:flex">
          <div className="px-2">
            <AdminBrand homeHref={homeHref} />
          </div>

          <nav aria-label="Admin navigation" className="mt-8 space-y-6">
            {sections.map((section) => (
              <div key={section.label}>
                <p className="px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {section.label}
                </p>
                <div className="mt-2 space-y-1">
                  {section.items.map((item) => (
                    <AdminNavigationLink
                      key={item.href}
                      item={item}
                      activeHref={activeHref}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {account ? (
            <div className="mt-auto border-t border-border pt-4">{account}</div>
          ) : null}
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
            <div className="flex min-h-16 items-center gap-4 px-page">
              <div className="lg:hidden">
                <AdminBrand homeHref={homeHref} />
              </div>
              <div className="ml-auto flex items-center gap-3">
                {headerActions}
                <div className="hidden lg:block">{account}</div>
              </div>
            </div>

            <details className="group border-t border-border lg:hidden">
              <summary className="flex min-h-control cursor-pointer list-none items-center gap-2 px-page py-2 text-sm font-semibold marker:hidden">
                <Menu aria-hidden="true" className="size-5" strokeWidth={1.75} />
                Admin navigation
                <ChevronDown
                  aria-hidden="true"
                  className="ml-auto size-4 transition-transform group-open:rotate-180"
                  strokeWidth={1.75}
                />
              </summary>
              <nav
                aria-label="Admin navigation"
                className="max-h-[calc(100dvh-8rem)] space-y-5 overflow-y-auto border-t border-border px-page py-4"
              >
                {sections.map((section) => (
                  <div key={section.label}>
                    <p className="px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      {section.label}
                    </p>
                    <div className="mt-2 space-y-1">
                      {section.items.map((item) => (
                        <AdminNavigationLink
                          key={item.href}
                          item={item}
                          activeHref={activeHref}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                {account ? (
                  <div className="border-t border-border pt-4">{account}</div>
                ) : null}
              </nav>
            </details>
          </header>

          <main
            id="admin-main-content"
            tabIndex={-1}
            className="mx-auto w-full max-w-app px-page py-6 sm:py-8"
          >
            {title || description ? (
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  {title ? (
                    <h1 className="text-heading-1 font-semibold">{title}</h1>
                  ) : null}
                  {description ? (
                    <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
                      {description}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
