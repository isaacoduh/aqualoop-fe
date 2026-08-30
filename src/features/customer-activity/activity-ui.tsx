import { ArrowRight, Package } from "lucide-react";
import Link from "next/link";

import { Card, EmptyState, LoadingSkeleton, StatusBadge } from "@/components/ui";
import type { CustomerOrderDetail } from "@/data/mock-db/repositories/customer-activity.repository";
import type { OrderStatus, PaymentStatus } from "@/domain/types";
import { formatMoney } from "@/lib/money";

export const CUSTOMER_ID = "usr_001";

export function formatDate(value: string, withTime = false) {
  return new Intl.DateTimeFormat("en-GB", withTime
    ? { dateStyle: "medium", timeStyle: "short" }
    : { dateStyle: "medium" }).format(new Date(value));
}

export function titleCase(value: string) {
  return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function statusTone(status: OrderStatus | PaymentStatus | string): "neutral" | "info" | "success" | "warning" | "danger" {
  if (["COMPLETED", "PAID", "REDEEMED", "ACTIVE"].includes(status)) return "success";
  if (["CANCELLED", "FAILED", "REFUNDED", "EXPIRED", "REVOKED"].includes(status)) return "danger";
  if (["PAYMENT_PENDING", "PENDING", "PREPARING", "UNASSIGNED"].includes(status)) return "warning";
  if (["CONFIRMED", "ACCEPTED", "READY", "OUT_FOR_DELIVERY", "ASSIGNED", "EN_ROUTE"].includes(status)) return "info";
  return "neutral";
}

export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm font-semibold text-primary">{eyebrow}</p><h1 className="mt-1 text-heading-1 font-semibold text-foreground">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></div>
      {action}
    </header>
  );
}

export function ActivityLoading({ count = 3 }: { count?: number }) {
  return <div className="mt-7 grid gap-4">{Array.from({ length: count }, (_, index) => <LoadingSkeleton key={index} className="h-32" />)}</div>;
}

export function OrderList({ orders, emptyTitle = "No orders here", emptyDescription = "Orders matching this view will appear here.", linkBase = "/app/orders" }: { orders: CustomerOrderDetail[]; emptyTitle?: string; emptyDescription?: string; linkBase?: string }) {
  if (orders.length === 0) return <EmptyState className="mt-7" icon={Package} title={emptyTitle} description={emptyDescription} />;
  return (
    <div className="mt-7 grid gap-4">
      {orders.map(({ order, business, items }) => (
        <Card key={order.id} className="p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div><div className="flex flex-wrap items-center gap-2"><p className="font-mono text-sm font-semibold text-foreground">{order.orderNumber}</p><StatusBadge size="sm" tone={statusTone(order.status)}>{titleCase(order.status)}</StatusBadge></div><h2 className="mt-3 font-semibold text-foreground">{business?.name ?? "Water business"}</h2><p className="mt-1 text-sm text-muted-foreground">{items.reduce((sum, item) => sum + item.quantity, 0)} item(s) · {formatDate(order.createdAt)}</p></div>
            <div className="sm:text-right"><p className="text-lg font-semibold text-foreground">{formatMoney(order.total)}</p><p className="mt-1 text-xs text-muted-foreground">{titleCase(order.fulfilmentMode)}</p></div>
          </div>
          <Link href={`${linkBase}/${order.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">View order <ArrowRight aria-hidden="true" className="size-4" /></Link>
        </Card>
      ))}
    </div>
  );
}
