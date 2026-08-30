"use client";

import { useQuery } from "@tanstack/react-query";
import { Check, CheckCircle2, Clock3, MapPin, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { LoadingSkeleton, OrderSummary } from "@/components/ui";
import { businessRepository, productRepository } from "@/data";
import { CheckoutGuard } from "@/features/checkout/checkout-guard";
import { useCheckout } from "@/features/checkout/checkout-provider";
import { formatMoney } from "@/lib/money";

export function PaymentSuccessScreen() {
  const { draft } = useCheckout();
  const completed = draft.completed;

  if (!completed) {
    return <CheckoutGuard title="No completed payment found" description="Complete checkout to see a payment receipt and collection code." href="/order/business" actionLabel="Start an order" />;
  }

  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-success-soft text-success">
        <CheckCircle2 aria-hidden="true" className="size-10" />
      </span>
      <p className="mt-6 text-sm font-semibold text-success">Payment confirmed</p>
      <h1 className="mt-2 text-heading-1 font-semibold text-foreground">Your water order is confirmed</h1>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
        We recorded a simulated payment of {formatMoney(completed.payment.amount)} for order {completed.order.orderNumber}.
      </p>

      <section className="mt-8 rounded-panel border border-border bg-surface p-6 text-left shadow-card">
        <dl className="grid gap-5 sm:grid-cols-2">
          <div><dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Order number</dt><dd className="mt-1 font-mono font-semibold text-foreground">{completed.order.orderNumber}</dd></div>
          <div><dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Payment status</dt><dd className="mt-1 inline-flex items-center gap-1.5 font-semibold text-success"><Check aria-hidden="true" className="size-4" /> Paid</dd></div>
          <div><dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Fulfilment</dt><dd className="mt-1 font-semibold text-foreground">{completed.order.fulfilmentMode === "DELIVERY" ? "Doorstep delivery" : "Business pickup"}</dd></div>
          <div><dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Total</dt><dd className="mt-1 font-semibold text-foreground">{formatMoney(completed.order.total)}</dd></div>
        </dl>
      </section>

      <Link href="/order/confirmation" className="mt-7 inline-flex min-h-control w-full items-center justify-center rounded-control bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover sm:w-auto">
        View order confirmation
      </Link>
    </div>
  );
}

export function OrderConfirmationScreen() {
  const router = useRouter();
  const { draft, reset } = useCheckout();
  const completed = draft.completed;
  const detailsQuery = useQuery({
    queryKey: [
      "checkout-confirmation-details",
      completed?.order.id,
      completed?.order.businessId,
    ],
    queryFn: async () => {
      const [products, business] = await Promise.all([
        productRepository.list(),
        businessRepository.findDiscoveryById(completed!.order.businessId),
      ]);
      return { products, business: business ?? null };
    },
    enabled: Boolean(completed),
  });

  if (!completed) {
    return <CheckoutGuard title="No order confirmation found" description="A confirmation appears after a successful checkout." href="/order/business" actionLabel="Start an order" />;
  }

  const expiry = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(completed.confirmationCode.expiresAt));

  function finishCheckout() {
    reset();
    router.push("/app");
  }

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary-soft text-primary"><PackageCheck aria-hidden="true" className="size-8" /></span>
        <p className="mt-5 text-sm font-semibold text-primary">Order {completed.order.orderNumber}</p>
        <h1 className="mt-2 text-heading-1 font-semibold text-foreground">Keep this confirmation code</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Share it only with the business or assigned delivery rider when you receive your order.</p>
        <div className="mt-6 rounded-panel border border-primary/25 bg-primary-soft px-6 py-7">
          <p className="text-xs font-bold tracking-[0.2em] text-info uppercase">Collection code</p>
          <p className="mt-2 font-mono text-4xl font-bold tracking-[0.18em] text-foreground sm:text-5xl">{completed.confirmationCode.displayCode}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Clock3 aria-hidden="true" className="size-3.5" /> Expires {expiry}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {detailsQuery.isLoading ? <LoadingSkeleton className="h-96" /> : (
          <OrderSummary
            businessName={detailsQuery.data?.business?.business.name}
            orderNumber={completed.order.orderNumber}
            items={completed.items.map((item) => ({
              id: item.id,
              name: detailsQuery.data?.products.find((product) => product.id === item.productId)?.name ?? "Water product",
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              lineTotal: item.lineTotal,
              detail: item.depositAmount > 0 ? `${formatMoney(item.depositAmount)} bottle deposit` : undefined,
            }))}
            subtotal={completed.order.subtotal}
            deliveryFee={completed.order.deliveryFee}
            depositAmount={completed.order.depositAmount}
            discount={completed.order.discount}
            total={completed.order.total}
          />
        )}
        <aside className="space-y-4">
          <section className="rounded-card border border-border bg-surface p-5 shadow-card">
            <MapPin aria-hidden="true" className="size-5 text-primary" />
            <h2 className="mt-3 font-semibold text-foreground">What happens next?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {completed.order.fulfilmentMode === "DELIVERY"
                ? "The business will prepare the order and assign it for delivery."
                : `Collect the order from ${detailsQuery.data?.business?.business.name ?? "the business"} when it is ready.`}
            </p>
          </section>
          <button type="button" onClick={finishCheckout} className="inline-flex min-h-control w-full items-center justify-center rounded-control bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
            Finish and return home
          </button>
        </aside>
      </div>
    </div>
  );
}
