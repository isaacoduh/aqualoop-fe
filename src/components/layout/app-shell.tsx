import type { ReactNode } from "react";
import Link from "next/link";
import { Droplets } from "lucide-react";

import {
  isNavigationItemActive,
  type ShellNavigationItem,
} from "@/components/layout/shell-navigation";
import { classNames } from "@/lib/class-names";

export interface AppShellProps {
  children: ReactNode;
  navigation: readonly ShellNavigationItem[];
  secondaryNavigation?: readonly ShellNavigationItem[];
  activeHref: string;
  title?: string;
  homeHref?: string;
  headerActions?: ReactNode;
  profile?: ReactNode;
  sidebarFooter?: ReactNode;
}

function Brand({ homeHref }: { homeHref: string }) {
  return (
    <Link
      href={homeHref}
      className="inline-flex items-center gap-2 rounded-control text-lg font-semibold tracking-tight text-foreground"
    >
      <span className="grid size-9 place-items-center rounded-control bg-primary text-primary-foreground">
        <Droplets aria-hidden="true" className="size-5" strokeWidth={1.75} />
      </span>
      <span>AquaLoop</span>
    </Link>
  );
}

function NavigationLink({
  item,
  activeHref,
  compact = false,
}: {
  item: ShellNavigationItem;
  activeHref: string;
  compact?: boolean;
}) {
  const active = isNavigationItemActive(item, activeHref);
  const Icon = item.icon;
  const content = (
    <>
      <Icon
        aria-hidden="true"
        className={compact ? "size-5" : "size-5 shrink-0"}
        strokeWidth={1.75}
      />
      <span className={compact ? "max-w-20 truncate text-xs" : "truncate"}>
        {item.label}
      </span>
      {!compact && item.badge !== undefined ? (
        <span className="ml-auto rounded-pill bg-surface-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
          {item.badge}
        </span>
      ) : null}
    </>
  );

  const classes = classNames(
    "rounded-control font-medium transition-colors",
    compact
      ? "flex min-w-16 flex-col items-center gap-1 px-2 py-2"
      : "flex min-h-control items-center gap-3 px-3 py-2 text-sm",
    active
      ? "bg-primary-soft text-primary"
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

export function AppShell({
  children,
  navigation,
  secondaryNavigation = [],
  activeHref,
  title,
  homeHref = "/app",
  headerActions,
  profile,
  sidebarFooter,
}: AppShellProps) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#main-content"
        className="fixed top-3 left-3 z-50 -translate-y-20 rounded-control bg-foreground px-4 py-2 text-sm font-semibold text-background transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>

      <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border bg-surface px-4 py-5 lg:flex">
          <div className="px-2">
            <Brand homeHref={homeHref} />
          </div>

          <nav aria-label="Primary navigation" className="mt-8 flex-1 space-y-1">
            {navigation.map((item) => (
              <NavigationLink
                key={item.href}
                item={item}
                activeHref={activeHref}
              />
            ))}
          </nav>

          {secondaryNavigation.length > 0 ? (
            <nav
              aria-label="Secondary navigation"
              className="mt-6 space-y-1 border-t border-border pt-4"
            >
              {secondaryNavigation.map((item) => (
                <NavigationLink
                  key={item.href}
                  item={item}
                  activeHref={activeHref}
                />
              ))}
            </nav>
          ) : null}

          {sidebarFooter ? (
            <div className="mt-6 border-t border-border pt-4">
              {sidebarFooter}
            </div>
          ) : null}
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
            <div className="flex min-h-16 items-center gap-4 px-page">
              <div className="lg:hidden">
                <Brand homeHref={homeHref} />
              </div>

              {title ? (
                <p className="hidden truncate font-semibold text-foreground lg:block">
                  {title}
                </p>
              ) : null}

              <div className="ml-auto flex items-center gap-3">
                {headerActions}
                {profile}
              </div>
            </div>
          </header>

          <main
            id="main-content"
            className="mx-auto w-full max-w-app px-page py-6 pb-28 sm:py-8 lg:pb-10"
          >
            {children}
          </main>
        </div>
      </div>

      <nav
        aria-label="Primary navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <div className="mx-auto flex max-w-lg items-center justify-around overflow-x-auto py-1">
          {navigation.map((item) => (
            <NavigationLink
              key={item.href}
              item={item}
              activeHref={activeHref}
              compact
            />
          ))}
        </div>
      </nav>
    </div>
  );
}
