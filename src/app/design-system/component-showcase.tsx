"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  Component,
  CreditCard,
  Inbox,
  LayoutDashboard,
  ListOrdered,
  PackageCheck,
  PanelsTopLeft,
  Settings,
  ShoppingBag,
  Table2,
  Truck,
  UserRound,
} from "lucide-react";

import {
  AdminShell,
  AppShell,
  type ShellNavigationItem,
  type ShellNavigationSection,
} from "@/components/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ConfirmDialog,
  DataTable,
  type DataTableColumn,
  EmptyState,
  FormField,
  formControlClassName,
  LoadingRegion,
  LoadingSkeleton,
  NotificationRow,
  OrderSummary,
  StatusBadge,
  Timeline,
} from "@/components/ui";
import { formatMoney } from "@/lib/money";

type ShellMode = "app" | "admin";

interface ShowcaseOrder {
  id: string;
  number: string;
  customer: string;
  status: "Preparing" | "Ready" | "Completed";
  total: number;
}

const orders: readonly ShowcaseOrder[] = [
  {
    id: "ord_10021",
    number: "AQ-10021",
    customer: "Amina Bello",
    status: "Preparing",
    total: 10800,
  },
  {
    id: "ord_10020",
    number: "AQ-10020",
    customer: "Chidi Okafor",
    status: "Ready",
    total: 11800,
  },
  {
    id: "ord_10018",
    number: "AQ-10018",
    customer: "Amina Bello",
    status: "Completed",
    total: 5900,
  },
];

const orderColumns: readonly DataTableColumn<ShowcaseOrder>[] = [
  {
    id: "number",
    header: "Order",
    cell: (order) => (
      <span className="font-mono text-xs font-semibold">{order.number}</span>
    ),
  },
  {
    id: "customer",
    header: "Customer",
    cell: (order) => order.customer,
  },
  {
    id: "status",
    header: "Status",
    cell: (order) => (
      <StatusBadge
        size="sm"
        tone={
          order.status === "Completed"
            ? "success"
            : order.status === "Ready"
              ? "info"
              : "warning"
        }
      >
        {order.status}
      </StatusBadge>
    ),
  },
  {
    id: "total",
    header: "Total",
    align: "right",
    cell: (order) => (
      <span className="font-semibold tabular-nums">
        {formatMoney(order.total)}
      </span>
    ),
  },
];

const appNavigation: readonly ShellNavigationItem[] = [
  {
    href: "/design-system",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: "#cards", label: "Cards", icon: PanelsTopLeft },
  { href: "#tables", label: "Tables", icon: Table2 },
  { href: "#orders", label: "Orders", icon: ShoppingBag },
  { href: "#timeline", label: "Timeline", icon: ListOrdered },
  { href: "#notifications", label: "Notifications", icon: Bell, badge: 2 },
];

const adminSections: readonly ShellNavigationSection[] = [
  {
    label: "Foundation",
    items: [
      {
        href: "/design-system",
        label: "Component lab",
        icon: Component,
        exact: true,
      },
      { href: "#cards", label: "Cards", icon: PanelsTopLeft },
      { href: "#tables", label: "Tables", icon: Table2 },
    ],
  },
  {
    label: "Patterns",
    items: [
      { href: "#orders", label: "Order summary", icon: ClipboardList },
      { href: "#timeline", label: "Timeline", icon: ListOrdered },
      { href: "#notifications", label: "Notifications", icon: Bell, badge: 2 },
    ],
  },
];

function SectionHeading({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5">
      <h2 id={id} className="text-heading-2 font-semibold">
        {title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function ComponentShowcase() {
  const [shellMode, setShellMode] = useState<ShellMode>("app");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogResult, setDialogResult] = useState("No action confirmed yet.");
  const IntroHeading = shellMode === "app" ? "h1" : "h2";

  const shellSwitcher = (
    <button
      type="button"
      className="min-h-control rounded-control border border-border-strong bg-surface px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
      onClick={() =>
        setShellMode((current) => (current === "app" ? "admin" : "app"))
      }
    >
      Show {shellMode === "app" ? "AdminShell" : "AppShell"}
    </button>
  );

  const content = (
    <div className="space-y-14">
      <section>
        <p className="text-sm font-semibold tracking-wider text-primary uppercase">
          Internal component lab
        </p>
        <IntroHeading className="mt-2 text-display font-semibold">
          AquaLoop shared UI
        </IntroHeading>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
          A single place to inspect shared components, responsive behaviour,
          semantic states, and realistic GBP content before product screens
          begin consuming them.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <StatusBadge>Draft</StatusBadge>
          <StatusBadge tone="info">Ready</StatusBadge>
          <StatusBadge tone="success">Completed</StatusBadge>
          <StatusBadge tone="warning">Payment pending</StatusBadge>
          <StatusBadge tone="danger">Cancelled</StatusBadge>
        </div>
      </section>

      <section aria-labelledby="cards">
        <SectionHeading
          id="cards"
          title="Cards and form fields"
          description="Composable card regions support simple content, metrics, actions, and form layouts."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Wallet balance</CardTitle>
                <CardDescription>Available customer credit</CardDescription>
              </div>
              <CreditCard
                aria-hidden="true"
                className="size-5 text-primary"
                strokeWidth={1.75}
              />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight tabular-nums">
                {formatMoney(18500)}
              </p>
              <p className="mt-2 text-sm text-success">£32.00 added this month</p>
            </CardContent>
            <CardFooter>
              <button
                type="button"
                className="text-sm font-semibold text-primary hover:text-primary-hover"
              >
                View transactions
              </button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Active orders</CardTitle>
                <CardDescription>Orders requiring attention</CardDescription>
              </div>
              <ShoppingBag
                aria-hidden="true"
                className="size-5 text-warning"
                strokeWidth={1.75}
              />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight">3</p>
              <div className="mt-3">
                <StatusBadge tone="warning" size="sm">
                  1 preparing
                </StatusBadge>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 xl:col-span-1">
            <CardHeader>
              <div>
                <CardTitle>Field states</CardTitle>
                <CardDescription>
                  Labels and messages stay programmatically connected.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <FormField
                id="showcase-email"
                label="Email address"
                description="We will send order updates here."
                required
              >
                {(accessibilityProps) => (
                  <input
                    {...accessibilityProps}
                    type="email"
                    className={formControlClassName}
                    placeholder="you@example.com"
                  />
                )}
              </FormField>

              <FormField
                id="showcase-code"
                label="Confirmation code"
                error="Enter the six-character collection code."
              >
                {(accessibilityProps) => (
                  <input
                    {...accessibilityProps}
                    className={formControlClassName}
                    placeholder="AQ1234"
                  />
                )}
              </FormField>
            </CardContent>
          </Card>
        </div>
      </section>

      <section aria-labelledby="tables">
        <SectionHeading
          id="tables"
          title="Tables"
          description="The shared table keeps semantic headers and captions while allowing horizontal overflow on narrow screens."
        />

        <DataTable
          rows={orders}
          columns={orderColumns}
          getRowKey={(order) => order.id}
          caption="Recent AquaLoop orders"
        />

        <div className="mt-5">
          <DataTable<ShowcaseOrder>
            rows={[]}
            columns={orderColumns}
            getRowKey={(order) => order.id}
            caption="Filtered AquaLoop orders"
            emptyState="No orders match the selected filters."
          />
        </div>
      </section>

      <section id="orders" aria-labelledby="orders-heading">
        <SectionHeading
          id="orders-heading"
          title="Order summaries"
          description="Line items and totals share the project-wide integer-pence money formatter."
        />

        <div className="max-w-2xl">
          <OrderSummary
            businessName="BlueSpring Refill Hub"
            orderNumber="AQ-10021"
            items={[
              {
                id: "line-1",
                name: "20L purified-water refill",
                quantity: 2,
                unitPrice: 2400,
                detail: "Return 2 empties",
              },
              {
                id: "line-2",
                name: "10L bottle exchange",
                quantity: 1,
                unitPrice: 2800,
                detail: "Return 1 empty",
              },
            ]}
            subtotal={7600}
            deliveryFee={1200}
            depositAmount={2000}
            discount={0}
            total={10800}
          />
        </div>
      </section>

      <section id="timeline" aria-labelledby="timeline-heading">
        <SectionHeading
          id="timeline-heading"
          title="Timelines"
          description="Completed, current, upcoming, and exceptional steps remain textually identifiable without relying on colour."
        />

        <Card>
          <CardContent>
            <Timeline
              label="Order AQ-10021 progress"
              items={[
                {
                  id: "placed",
                  title: "Order placed",
                  description: "Payment received and stock reserved.",
                  timestamp: "07:14",
                  dateTime: "2026-08-29T07:14:00Z",
                  state: "complete",
                },
                {
                  id: "preparing",
                  title: "Preparing order",
                  description: "BlueSpring is filling and checking your bottles.",
                  timestamp: "08:05",
                  dateTime: "2026-08-29T08:05:00Z",
                  state: "complete",
                },
                {
                  id: "delivery",
                  title: "Out for delivery",
                  description: "Your driver is approximately 18 minutes away.",
                  timestamp: "Now",
                  state: "current",
                  icon: Truck,
                },
                {
                  id: "complete",
                  title: "Delivered",
                  description: "Confirm receipt using your collection code.",
                  state: "upcoming",
                  icon: PackageCheck,
                },
              ]}
            />
          </CardContent>
        </Card>
      </section>

      <section id="notifications" aria-labelledby="notifications-heading">
        <SectionHeading
          id="notifications-heading"
          title="Notification rows"
          description="Rows support read state, semantic tone, timestamps, metadata, and optional navigation."
        />

        <div className="overflow-hidden rounded-card border border-border shadow-card">
          <NotificationRow
            title="Your order is out for delivery"
            body="BlueSpring has dispatched order AQ-10021."
            timestamp="2 min ago"
            href="#orders"
            unread
            icon={Truck}
            tone="info"
            metadata="Order AQ-10021"
          />
          <NotificationRow
            title="Payment successful"
            body="Your payment of £108.00 was confirmed."
            timestamp="2 hours ago"
            icon={CheckCircle2}
            tone="success"
          />
          <NotificationRow
            title="Complete your profile"
            body="Add a default delivery address for a faster checkout."
            timestamp="Yesterday"
            href="#cards"
            icon={UserRound}
          />
        </div>
      </section>

      <section aria-labelledby="feedback-states">
        <SectionHeading
          id="feedback-states"
          title="Empty, loading, and confirmation states"
          description="Shared feedback patterns cover absent content, asynchronous loading, and consequential actions."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <EmptyState
            title="No saved addresses"
            description="Add an address to make delivery checkout faster."
            icon={Inbox}
            action={
              <button
                type="button"
                className="min-h-control rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
              >
                Add address
              </button>
            }
          />

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Loading card</CardTitle>
                <CardDescription>
                  Decorative skeletons sit inside one announced loading region.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <LoadingRegion className="space-y-4" label="Loading account data">
                <div className="flex items-center gap-3">
                  <LoadingSkeleton shape="circle" className="size-11" />
                  <div className="flex-1 space-y-2">
                    <LoadingSkeleton shape="text" className="w-2/5" />
                    <LoadingSkeleton shape="text" className="w-3/5" />
                  </div>
                </div>
                <LoadingSkeleton className="h-24 w-full" />
              </LoadingRegion>
            </CardContent>
            <CardFooter className="flex-wrap justify-between">
              <p className="text-sm text-muted-foreground">{dialogResult}</p>
              <button
                type="button"
                className="min-h-control rounded-control bg-danger px-4 py-2 text-sm font-semibold text-white hover:bg-danger/90"
                onClick={() => setDialogOpen(true)}
              >
                Open confirm dialog
              </button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <ConfirmDialog
        open={dialogOpen}
        title="Cancel this order?"
        description="The order will stop progressing and any captured payment will need to be refunded."
        confirmLabel="Cancel order"
        tone="danger"
        onOpenChange={setDialogOpen}
        onConfirm={() => {
          setDialogResult("The example action was confirmed.");
          setDialogOpen(false);
        }}
      />
    </div>
  );

  if (shellMode === "admin") {
    return (
      <AdminShell
        sections={adminSections}
        activeHref="/design-system"
        title="Component lab"
        description="Review AquaLoop shared interface primitives before using them in feature screens."
        homeHref="/design-system"
        headerActions={shellSwitcher}
        account={
          <div className="flex items-center gap-3 rounded-control px-2 py-2">
            <span className="grid size-9 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
              MO
            </span>
            <span className="hidden text-sm lg:block">
              <span className="block font-semibold">Maya Okonkwo</span>
              <span className="block text-xs text-muted-foreground">
                Super admin
              </span>
            </span>
          </div>
        }
      >
        {content}
      </AdminShell>
    );
  }

  return (
    <AppShell
      navigation={appNavigation}
      activeHref="/design-system"
      title="Component lab"
      homeHref="/design-system"
      headerActions={shellSwitcher}
      profile={
        <span className="grid size-9 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
          AB
        </span>
      }
      sidebarFooter={
        <div className="flex items-center gap-3 rounded-control px-2 py-2 text-sm">
          <Settings
            aria-hidden="true"
            className="size-5 text-muted-foreground"
            strokeWidth={1.75}
          />
          <span className="font-medium">Component settings</span>
        </div>
      }
    >
      {content}
    </AppShell>
  );
}
