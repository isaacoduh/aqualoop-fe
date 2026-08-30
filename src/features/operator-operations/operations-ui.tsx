import { ArrowRight, Package } from "lucide-react";
import Link from "next/link";

import { Card, EmptyState, LoadingSkeleton, StatusBadge } from "@/components/ui";
import type { OperatorOrderDetail } from "@/data/mock-db/repositories/operator-operations.repository";
import { formatMoney } from "@/lib/money";

export const OPERATOR_ID = "op_001";
export const actionClassName = "inline-flex min-h-control items-center justify-center gap-2 rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover";
export const secondaryActionClassName = "inline-flex min-h-control items-center justify-center gap-2 rounded-control border border-border-strong px-4 py-2 text-sm font-semibold transition hover:bg-surface-muted";

export function titleCase(value: string) { return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
export function formatDate(value: string, withTime = false) { return new Intl.DateTimeFormat("en-GB", withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" }).format(new Date(value)); }
export function statusTone(status: string): "neutral" | "info" | "success" | "warning" | "danger" {
  if (["ACTIVE", "COMPLETED", "PAID", "REDEEMED", "OPEN"].includes(status)) return "success";
  if (["CANCELLED", "REFUNDED", "FAILED", "EXPIRED", "CLOSED", "REJECTED"].includes(status)) return "danger";
  if (["PENDING", "PREPARING", "UNASSIGNED", "LOW"].includes(status)) return "warning";
  if (["CONFIRMED", "ACCEPTED", "READY", "OUT_FOR_DELIVERY", "ASSIGNED", "EN_ROUTE"].includes(status)) return "info";
  return "neutral";
}
export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-primary">{eyebrow}</p><h1 className="mt-1 text-heading-1 font-semibold">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></div>{action}</header>;
}
export function OperationsLoading({ count = 3 }: { count?: number }) { return <div className="mt-7 grid gap-4">{Array.from({ length: count }, (_, i) => <LoadingSkeleton key={i} className="h-32" />)}</div>; }
export function OperatorOrderList({ orders, empty = "No orders in this view" }: { orders: OperatorOrderDetail[]; empty?: string }) {
  if (!orders.length) return <EmptyState className="mt-7" icon={Package} title={empty} description="New orders will appear here automatically." />;
  return <div className="mt-7 grid gap-4">{orders.map(({ order, customer, items }) => <Card key={order.id} className="p-5 sm:p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-sm font-semibold">{order.orderNumber}</span><StatusBadge size="sm" tone={statusTone(order.status)}>{titleCase(order.status)}</StatusBadge></div><h2 className="mt-3 font-semibold">{customer ? `${customer.firstName} ${customer.lastName}` : "Customer"}</h2><p className="mt-1 text-sm text-muted-foreground">{items.reduce((sum, item) => sum + item.quantity, 0)} item(s) · {titleCase(order.fulfilmentMode)} · {formatDate(order.createdAt)}</p></div><p className="text-lg font-semibold">{formatMoney(order.total)}</p></div><Link href={`/operator/orders/${order.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">Manage order <ArrowRight className="size-4" /></Link></Card>)}</div>;
}
