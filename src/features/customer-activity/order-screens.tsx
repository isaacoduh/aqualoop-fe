"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Box, CheckCircle2, ClipboardList, MapPin, MessageSquareText, PackageCheck, RotateCcw, Star, Truck, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Card, EmptyState, FormField, OrderSummary, StatusBadge, Timeline, formControlClassName } from "@/components/ui";
import { businessRepository, customerActivityRepository, productRepository, reviewRepository } from "@/data";
import type { CustomerOrderDetail } from "@/data/mock-db/repositories/customer-activity.repository";
import type { FulfilmentMode, Review } from "@/domain/types";
import { SubmitButton } from "@/features/auth/auth-controls";
import { ActivityLoading, CUSTOMER_ID, OrderList, PageHeading, formatDate, statusTone, titleCase } from "@/features/customer-activity/activity-ui";
import { formatMoney } from "@/lib/money";

const activeStatuses = ["DRAFT", "PAYMENT_PENDING", "CONFIRMED", "ACCEPTED", "PREPARING", "READY", "OUT_FOR_DELIVERY"];
const cancellableStatuses = ["DRAFT", "PAYMENT_PENDING", "CONFIRMED"];

function useOrder(orderId: string) {
  return useQuery({ queryKey: ["customer-order", CUSTOMER_ID, orderId], queryFn: () => customerActivityRepository.findOrder(CUSTOMER_ID, orderId) });
}

export function OrdersScreen() {
  const query = useQuery({ queryKey: ["customer-orders", CUSTOMER_ID], queryFn: () => customerActivityRepository.listOrders(CUSTOMER_ID) });
  const orders = query.data?.filter(({ order }) => activeStatuses.includes(order.status)) ?? [];
  return <div><PageHeading eyebrow="Your water" title="Orders" description="Track active orders, open historical purchases, or request a custom quantity." action={<Link href="/app/custom-order" className="inline-flex min-h-control items-center justify-center gap-2 rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><PackageCheck className="size-4" /> Custom order</Link>} />
    <div className="mt-5 flex flex-wrap gap-3"><Link href="/app/orders/completed" className="text-sm font-semibold text-primary">Completed orders</Link><Link href="/app/history" className="text-sm font-semibold text-primary">Purchase history</Link></div>{query.isLoading ? <ActivityLoading /> : <OrderList orders={orders} emptyTitle="No active orders" emptyDescription="Start a new order or check your completed purchases." />}</div>;
}

function orderTimeline(detail: CustomerOrderDetail) {
  const { order } = detail;
  if (order.status === "CANCELLED" || order.status === "REFUNDED") return [
    { id: "placed", title: "Order placed", timestamp: formatDate(order.createdAt, true), state: "complete" as const },
    { id: "cancelled", title: titleCase(order.status), timestamp: formatDate(order.updatedAt, true), state: "error" as const },
  ];
  const stages = ["CONFIRMED", "PREPARING", order.fulfilmentMode === "DELIVERY" ? "OUT_FOR_DELIVERY" : "READY", "COMPLETED"];
  const currentIndex = order.status === "PAYMENT_PENDING" ? -1 : Math.max(0, stages.indexOf(order.status));
  return stages.map((stage, index) => ({
    id: stage,
    title: stage === "OUT_FOR_DELIVERY" ? "Out for delivery" : stage === "READY" ? "Ready for pickup" : titleCase(stage),
    description: index === 0 ? "Payment accepted and order sent to the business." : undefined,
    timestamp: index <= currentIndex ? formatDate(index === 0 ? order.createdAt : order.updatedAt, true) : undefined,
    state: index < currentIndex ? "complete" as const : index === currentIndex ? "current" as const : "upcoming" as const,
  }));
}

export function OrderDetailScreen({ orderId }: { orderId: string }) {
  const query = useOrder(orderId);
  if (query.isLoading) return <ActivityLoading />;
  if (!query.data) return <EmptyState icon={ClipboardList} title="Order not found" description="This order does not belong to the current customer." action={<Link href="/app/orders" className="font-semibold text-primary">Return to orders</Link>} />;
  const { order, business, items, address, delivery, paymentMethod, code, review } = query.data;
  return <div><Link href="/app/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="size-4" /> Back to orders</Link><div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><div className="flex flex-wrap items-center gap-2"><p className="font-mono text-sm font-semibold text-primary">{order.orderNumber}</p><StatusBadge tone={statusTone(order.status)}>{titleCase(order.status)}</StatusBadge></div><h1 className="mt-3 text-heading-1 font-semibold">{business?.name ?? "Water order"}</h1><p className="mt-2 text-sm text-muted-foreground">Placed {formatDate(order.createdAt, true)}</p></div><div className="flex flex-wrap gap-3">{code?.status === "ACTIVE" ? <Link href={`/app/codes/${code.id}`} className="inline-flex min-h-control items-center rounded-control border border-border-strong px-4 py-2 text-sm font-semibold">View code</Link> : null}{cancellableStatuses.includes(order.status) ? <Link href={`/app/orders/${order.id}/cancel`} className="inline-flex min-h-control items-center rounded-control border border-danger/30 px-4 py-2 text-sm font-semibold text-danger">Cancel order</Link> : null}{order.status === "COMPLETED" && !review ? <Link href={`/app/orders/${order.id}/review`} className="inline-flex min-h-control items-center rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Leave review</Link> : null}</div></div>
    <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]"><div className="space-y-6"><OrderSummary businessName={business?.name} orderNumber={order.orderNumber} items={items.map((item) => ({ id:item.id, name:item.product?.name ?? "Water product", quantity:item.quantity, unitPrice:item.unitPrice, lineTotal:item.lineTotal, detail:item.depositAmount > 0 ? `${formatMoney(item.depositAmount)} bottle deposit` : undefined }))} subtotal={order.subtotal} deliveryFee={order.deliveryFee} depositAmount={order.depositAmount} discount={order.discount} total={order.total} /><Card className="p-5"><h2 className="font-semibold">Fulfilment details</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><div><p className="text-xs font-semibold text-muted-foreground uppercase">Method</p><p className="mt-1 inline-flex items-center gap-2 text-sm font-medium">{order.fulfilmentMode === "DELIVERY" ? <Truck className="size-4 text-primary" /> : <PackageCheck className="size-4 text-primary" />}{titleCase(order.fulfilmentMode)}</p></div><div><p className="text-xs font-semibold text-muted-foreground uppercase">Payment</p><p className="mt-1 text-sm font-medium">{paymentMethod?.type === "CARD" ? `${paymentMethod.brand} •••• ${paymentMethod.last4}` : paymentMethod?.type ? titleCase(paymentMethod.type) : "Payment pending"}</p></div></div>{address ? <p className="mt-4 flex items-start gap-2 border-t border-border pt-4 text-sm text-muted-foreground"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" /> {[address.line1,address.line2,address.city,address.state].filter(Boolean).join(", ")}</p> : null}{delivery?.assignedToName ? <p className="mt-3 text-sm text-muted-foreground">Rider: <strong className="text-foreground">{delivery.assignedToName}</strong>{delivery.etaMinutes ? ` · ${delivery.etaMinutes} min ETA` : ""}</p> : null}{order.status === "COMPLETED" ? <Link href={`/app/orders/${order.id}/completed`} className="mt-4 inline-flex text-sm font-semibold text-primary">Open completion receipt</Link> : null}</Card></div><Card className="p-5"><h2 className="font-semibold">Order progress</h2><Timeline className="mt-5" items={orderTimeline(query.data)} />{order.notes ? <div className="mt-5 border-t border-border pt-4"><p className="text-xs font-semibold text-muted-foreground uppercase">Order note</p><p className="mt-2 text-sm leading-6">{order.notes}</p></div> : null}</Card></div>
  </div>;
}

export function CompletedOrdersScreen() {
  const query = useQuery({ queryKey: ["customer-orders", CUSTOMER_ID], queryFn: () => customerActivityRepository.listOrders(CUSTOMER_ID) });
  const completed = query.data?.filter(({ order }) => order.status === "COMPLETED") ?? [];
  return <div><PageHeading eyebrow="Orders" title="Completed orders" description="Delivered and collected orders ready for your records and feedback." />{query.isLoading ? <ActivityLoading /> : <OrderList orders={completed} emptyTitle="No completed orders" />}</div>;
}

export function OrderCompletedScreen({ orderId }: { orderId: string }) {
  const query = useOrder(orderId);
  if (query.isLoading) return <ActivityLoading />;
  if (!query.data || query.data.order.status !== "COMPLETED") return <EmptyState title="Order is not completed" description="This receipt becomes available after handover." action={<Link href={`/app/orders/${orderId}`} className="font-semibold text-primary">View current status</Link>} />;
  return <div className="mx-auto max-w-2xl text-center"><CheckCircle2 className="mx-auto size-16 text-success" /><p className="mt-5 text-sm font-semibold text-success">Completed {formatDate(query.data.order.updatedAt, true)}</p><h1 className="mt-2 text-heading-1 font-semibold">Order received</h1><p className="mt-3 text-muted-foreground">{query.data.order.orderNumber} from {query.data.business?.name}</p><Card className="mt-7 p-6"><p className="text-sm text-muted-foreground">Final total</p><p className="mt-1 text-3xl font-semibold">{formatMoney(query.data.order.total)}</p></Card><div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center"><Link href={`/app/orders/${orderId}`} className="inline-flex min-h-control items-center justify-center rounded-control border border-border-strong px-5 py-2 text-sm font-semibold">View receipt</Link>{!query.data.review ? <Link href={`/app/orders/${orderId}/review`} className="inline-flex min-h-control items-center justify-center rounded-control bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Leave a review</Link> : null}</div></div>;
}

export function CancelOrderScreen({ orderId }: { orderId: string }) {
  const router = useRouter(); const queryClient = useQueryClient(); const query = useOrder(orderId); const [reason, setReason] = useState(""); const [error, setError] = useState("");
  const mutation = useMutation({ mutationFn: () => customerActivityRepository.cancelOrder(CUSTOMER_ID, orderId, reason), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["customer-orders", CUSTOMER_ID] }); queryClient.invalidateQueries({ queryKey: ["customer-order", CUSTOMER_ID, orderId] }); router.push(`/app/orders/${orderId}`); } });
  if (query.isLoading) return <ActivityLoading />;
  if (!query.data) return <EmptyState title="Order not found" description="This order cannot be cancelled." />;
  if (!cancellableStatuses.includes(query.data.order.status)) return <EmptyState icon={XCircle} title="Online cancellation unavailable" description="This order has progressed too far. Contact support if you still need help." action={<Link href={`/app/orders/${orderId}`} className="font-semibold text-primary">Return to order</Link>} />;
  function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if (reason.trim().length < 8) { setError("Give a brief reason of at least 8 characters."); return; } setError(""); mutation.mutate(); }
  return <div className="mx-auto max-w-xl"><Link href={`/app/orders/${orderId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="size-4" /> Back to order</Link><PageHeading eyebrow={query.data.order.orderNumber} title="Cancel this order?" description="Payment, confirmation code, delivery, and reserved stock will be updated together." /><form onSubmit={submit} className="mt-7 rounded-panel border border-danger/25 bg-surface p-6 shadow-card"><FormField id="cancel-reason" label="Reason for cancellation" error={error} required disabled={mutation.isPending}>{(props) => <textarea {...props} value={reason} onChange={(event) => setReason(event.target.value)} rows={4} className={`${formControlClassName} resize-y`} />}</FormField>{mutation.isError ? <p role="alert" className="mt-4 text-sm font-medium text-danger">{mutation.error.message}</p> : null}<SubmitButton pending={mutation.isPending} className="mt-5 bg-danger hover:bg-danger/90"><XCircle className="size-4" /> Cancel order</SubmitButton></form></div>;
}

export function ReviewOrderScreen({ orderId }: { orderId: string }) {
  const router = useRouter(); const queryClient = useQueryClient(); const query = useOrder(orderId); const [rating, setRating] = useState<Review["rating"]>(5); const [body, setBody] = useState(""); const [error, setError] = useState("");
  const mutation = useMutation({ mutationFn: () => reviewRepository.create(CUSTOMER_ID, { orderId, rating, body }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["customer-order", CUSTOMER_ID, orderId] }); router.push(`/app/orders/${orderId}`); } });
  if (query.isLoading) return <ActivityLoading />;
  if (!query.data || query.data.order.status !== "COMPLETED") return <EmptyState title="Review unavailable" description="Reviews are available after an order is completed." />;
  if (query.data.review) return <EmptyState icon={Star} title="Review already submitted" description={`You rated this order ${query.data.review.rating} out of 5.`} action={<Link href={`/app/orders/${orderId}`} className="font-semibold text-primary">Return to order</Link>} />;
  function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if (body.trim().length < 10) { setError("Write at least 10 characters about your experience."); return; } setError(""); mutation.mutate(); }
  return <div className="mx-auto max-w-xl"><Link href={`/app/orders/${orderId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="size-4" /> Back to order</Link><PageHeading eyebrow={query.data.business?.name ?? "Completed order"} title="How was your order?" description="Your feedback helps customers choose reliable refill businesses." /><form onSubmit={submit} className="mt-7 rounded-panel border border-border bg-surface p-6 shadow-card"><fieldset><legend className="text-sm font-semibold">Rating</legend><div className="mt-3 flex gap-2">{([1,2,3,4,5] as const).map((value) => <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} star${value === 1 ? "" : "s"}`} className="rounded-control p-1"><Star className={`size-8 ${value <= rating ? "fill-warning text-warning" : "text-border-strong"}`} /></button>)}</div></fieldset><FormField id="review-body" label="Your review" error={error} required disabled={mutation.isPending}>{(props) => <textarea {...props} value={body} onChange={(event) => setBody(event.target.value)} rows={5} className={`${formControlClassName} mt-5 resize-y`} />}</FormField>{mutation.isError ? <p role="alert" className="mt-4 text-sm font-medium text-danger">{mutation.error.message}</p> : null}<SubmitButton pending={mutation.isPending} className="mt-5"><MessageSquareText className="size-4" /> Submit review</SubmitButton></form></div>;
}

export function HistoryScreen() {
  const query = useQuery({ queryKey: ["customer-orders", CUSTOMER_ID], queryFn: () => customerActivityRepository.listOrders(CUSTOMER_ID) });
  const history = query.data?.filter(({ order }) => ["COMPLETED", "CANCELLED", "REFUNDED"].includes(order.status)) ?? [];
  return <div><PageHeading eyebrow="Account records" title="Purchase history" description="Completed, cancelled, and refunded water purchases." action={<Link href="/app/containers" className="inline-flex min-h-control items-center justify-center rounded-control border border-border-strong px-4 py-2 text-sm font-semibold">View containers</Link>} />{query.isLoading ? <ActivityLoading /> : <OrderList orders={history} linkBase="/app/history" emptyTitle="No purchase history" />}</div>;
}

export function PurchaseHistoryDetailScreen({ purchaseId }: { purchaseId: string }) {
  return <OrderDetailScreen orderId={purchaseId} />;
}

export function ContainersScreen() {
  const query = useQuery({ queryKey: ["customer-orders", CUSTOMER_ID], queryFn: () => customerActivityRepository.listOrders(CUSTOMER_ID) });
  const completed = query.data?.filter(({ order }) => order.status === "COMPLETED") ?? [];
  const returned = completed.reduce((sum, item) => sum + item.items.reduce((lineSum, line) => lineSum + line.expectedEmptyReturns, 0), 0);
  const deposits = completed.reduce((sum, item) => sum + item.order.depositAmount, 0);
  return <div><PageHeading eyebrow="Circular water" title="My containers" description="A summary of reusable bottles recorded through completed exchange orders." />{query.isLoading ? <ActivityLoading /> : <><div className="mt-7 grid gap-4 sm:grid-cols-3"><Card className="p-5"><RotateCcw className="size-5 text-primary" /><p className="mt-4 text-3xl font-semibold">{returned}</p><p className="mt-1 text-sm text-muted-foreground">Empty bottles returned</p></Card><Card className="p-5"><Box className="size-5 text-primary" /><p className="mt-4 text-3xl font-semibold">{completed.length}</p><p className="mt-1 text-sm text-muted-foreground">Completed purchase cycles</p></Card><Card className="p-5"><PackageCheck className="size-5 text-primary" /><p className="mt-4 text-3xl font-semibold">{formatMoney(deposits)}</p><p className="mt-1 text-sm text-muted-foreground">Bottle deposits recorded</p></Card></div><Card className="mt-6 p-6"><h2 className="font-semibold">How container tracking works</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Bottle exchanges record expected empty returns. Once a confirmation code is redeemed, the returned empties and business inventory are updated together.</p></Card></>}</div>;
}

export function CustomOrderScreen() {
  const router = useRouter(); const queryClient = useQueryClient(); const [businessId, setBusinessId] = useState(""); const [productId, setProductId] = useState(""); const [error, setError] = useState("");
  const query = useQuery({ queryKey: ["custom-order-options"], queryFn: async () => { const businesses = (await businessRepository.listActive()).filter((business) => business.isOpen); const productsByBusiness = await Promise.all(businesses.map(async (business) => ({ businessId: business.id, products: await productRepository.listForBusiness(business.id) }))); return { businesses, productsByBusiness }; } });
  const mutation = useMutation({ mutationFn: (input: Parameters<typeof customerActivityRepository.createCustomOrder>[1]) => customerActivityRepository.createCustomOrder(CUSTOMER_ID, input), onSuccess: (result) => { queryClient.invalidateQueries({ queryKey: ["customer-orders", CUSTOMER_ID] }); router.push(`/app/orders/${result.order.id}`); } });
  const products = query.data?.productsByBusiness.find((item) => item.businessId === businessId)?.products ?? [];
  function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); const quantity = Number(data.get("quantity")); const fulfilmentMode = String(data.get("fulfilmentMode")) as FulfilmentMode; const notes = String(data.get("notes") ?? ""); if (!businessId || !productId) { setError("Choose a business and product."); return; } if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) { setError("Quantity must be between 1 and 20."); return; } if (notes.trim().length < 10) { setError("Describe your custom order in at least 10 characters."); return; } setError(""); mutation.mutate({ businessId, productId, quantity, fulfilmentMode, notes }); }
  return <div className="mx-auto max-w-2xl"><PageHeading eyebrow="Flexible ordering" title="Request a custom order" description="Create a payment-pending request for a larger quantity or special instruction." />{query.isLoading ? <ActivityLoading /> : <form onSubmit={submit} className="mt-7 space-y-5 rounded-panel border border-border bg-surface p-6 shadow-card"><FormField id="custom-business" label="Business" required disabled={mutation.isPending}>{(props) => <select {...props} name="businessId" value={businessId} onChange={(event) => { setBusinessId(event.target.value); setProductId(""); }} className={formControlClassName}><option value="">Choose a business</option>{query.data?.businesses.map((business) => <option key={business.id} value={business.id}>{business.name}</option>)}</select>}</FormField><FormField id="custom-product" label="Product" required disabled={!businessId || mutation.isPending}>{(props) => <select {...props} name="productId" value={productId} onChange={(event) => setProductId(event.target.value)} className={formControlClassName}><option value="">Choose a product</option>{products.map(({ product, listing }) => <option key={product.id} value={product.id}>{product.name} · {formatMoney(listing.price)}</option>)}</select>}</FormField><div className="grid gap-5 sm:grid-cols-2"><FormField id="custom-quantity" label="Quantity" required disabled={mutation.isPending}>{(props) => <input {...props} name="quantity" type="number" min="1" max="20" defaultValue="1" className={formControlClassName} />}</FormField><FormField id="custom-fulfilment" label="Fulfilment" required disabled={mutation.isPending}>{(props) => <select {...props} name="fulfilmentMode" className={formControlClassName}><option value="DELIVERY">Delivery</option><option value="PICKUP">Pickup</option></select>}</FormField></div><FormField id="custom-notes" label="What do you need?" description="Mention timing, access, or container requirements." required disabled={mutation.isPending}>{(props) => <textarea {...props} name="notes" rows={4} className={`${formControlClassName} resize-y`} />}</FormField>{error ? <p role="alert" className="text-sm font-medium text-danger">{error}</p> : null}{mutation.isError ? <p role="alert" className="text-sm font-medium text-danger">{mutation.error.message}</p> : null}<SubmitButton pending={mutation.isPending}><Truck className="size-4" /> Create custom request <ArrowRight className="size-4" /></SubmitButton></form>}</div>;
}
