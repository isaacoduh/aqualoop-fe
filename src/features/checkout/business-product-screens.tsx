"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Check,
  Droplets,
  MapPin,
  Minus,
  PackageX,
  Plus,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { EmptyState, LoadingSkeleton } from "@/components/ui";
import { businessRepository, checkoutRepository } from "@/data";
import { CheckoutGuard } from "@/features/checkout/checkout-guard";
import { checkoutTotals } from "@/features/checkout/checkout-data";
import { useCheckout } from "@/features/checkout/checkout-provider";
import { formatMoney } from "@/lib/money";

export function BusinessSelectionScreen({
  highlightedBusinessId,
}: {
  highlightedBusinessId?: string;
}) {
  const router = useRouter();
  const { draft, selectBusiness } = useCheckout();
  const query = useQuery({
    queryKey: ["checkout-businesses"],
    queryFn: () => businessRepository.listDiscovery(),
  });

  function continueWithBusiness(businessId: string) {
    selectBusiness(businessId);
    router.push("/order/products");
  }

  return (
    <div>
      <p className="text-sm font-semibold text-primary">Step 1</p>
      <h1 className="mt-2 text-heading-1 font-semibold text-foreground">Choose a refill business</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
        Only approved businesses accepting orders can start a checkout.
      </p>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {query.isLoading
          ? Array.from({ length: 3 }, (_, index) => <LoadingSkeleton key={index} className="h-52" />)
          : null}
        {query.data
          ?.filter((item) => item.business.isOpen)
          .map((item) => {
            const selected = draft.businessId === item.business.id;
            const highlighted = highlightedBusinessId === item.business.id;
            return (
              <article key={item.business.id} className={`rounded-card border bg-surface p-5 shadow-card transition ${selected || highlighted ? "border-primary ring-3 ring-primary/10" : "border-border"}`}>
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-12 items-center justify-center rounded-card bg-primary-soft text-lg font-bold text-primary">{item.business.name[0]}</span>
                  <span className="inline-flex items-center gap-1 rounded-pill bg-success-soft px-2.5 py-1 text-xs font-semibold text-success"><Check aria-hidden="true" className="size-3.5" /> Open</span>
                </div>
                <h2 className="mt-4 font-semibold text-foreground">{item.business.name}</h2>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin aria-hidden="true" className="size-3.5" /> {item.address.city} - {item.distanceKm.toFixed(1)} km away</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Star aria-hidden="true" className="size-3.5 fill-warning text-warning" /> {item.business.rating.toFixed(1)}</span>
                  <span>Minimum {formatMoney(item.business.minimumOrder)}</span>
                </div>
                <button type="button" onClick={() => continueWithBusiness(item.business.id)} className="mt-5 inline-flex min-h-control w-full items-center justify-center gap-2 rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
                  Choose {item.business.name.split(" ")[0]} <ArrowRight aria-hidden="true" className="size-4" />
                </button>
              </article>
            );
          })}
      </div>

      {query.isError ? (
        <EmptyState className="mt-7" title="Businesses are unavailable" description="Try loading approved checkout partners again." action={<button type="button" onClick={() => query.refetch()} className="text-sm font-semibold text-primary">Retry</button>} />
      ) : null}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Looking for another option? <Link href="/app/businesses" className="font-semibold text-primary">Return to discovery</Link>
      </p>
    </div>
  );
}

export function ProductSelectionScreen() {
  const { draft, setQuantity } = useCheckout();
  const query = useQuery({
    queryKey: ["checkout-catalog", draft.businessId],
    queryFn: () => checkoutRepository.catalog(draft.businessId!),
    enabled: Boolean(draft.businessId),
  });

  if (!draft.businessId) {
    return <CheckoutGuard title="Choose a business first" description="Products and stock are specific to each refill business." href="/order/business" actionLabel="Choose business" />;
  }

  if (query.isLoading) {
    return <div className="grid gap-4 md:grid-cols-2">{Array.from({ length: 4 }, (_, index) => <LoadingSkeleton key={index} className="h-64" />)}</div>;
  }

  if (!query.data) {
    return <CheckoutGuard title="This catalogue is unavailable" description="The selected business may no longer be accepting customer orders." href="/order/business" actionLabel="Choose another business" />;
  }

  const totals = checkoutTotals(draft, query.data);
  const meetsMinimum = totals.subtotal >= query.data.business.minimumOrder;

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary">Step 2 - {query.data.business.name}</p>
          <h1 className="mt-2 text-heading-1 font-semibold text-foreground">Select your products</h1>
          <p className="mt-3 text-sm text-muted-foreground">Available stock is checked again when payment is confirmed.</p>
        </div>
        <Link href="/order/business" className="text-sm font-semibold text-primary">Change business</Link>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {query.data.items.map((item) => {
          const quantity = draft.quantities[item.product.id] ?? 0;
          const unavailable = item.availableQuantity === 0;
          return (
            <article key={item.listing.id} className={`rounded-card border bg-surface p-5 shadow-card ${unavailable ? "border-border opacity-70" : quantity > 0 ? "border-primary ring-3 ring-primary/10" : "border-border"}`}>
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-11 items-center justify-center rounded-control bg-primary-soft text-primary"><Droplets aria-hidden="true" className="size-5" /></span>
                <span className={`rounded-pill px-2.5 py-1 text-xs font-semibold ${unavailable ? "bg-danger-soft text-danger" : item.availableQuantity <= 10 ? "bg-warning-soft text-warning" : "bg-success-soft text-success"}`}>
                  {unavailable ? "Unavailable" : item.availableQuantity <= 10 ? `${item.availableQuantity} left` : "In stock"}
                </span>
              </div>
              <p className="mt-4 text-xs font-bold tracking-wide text-primary uppercase">{item.product.type === "REFILL" ? "Refill" : "Bottle exchange"}</p>
              <h2 className="mt-2 font-semibold text-foreground">{item.product.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.product.description}</p>
              <div className="mt-4">
                <p className="text-lg font-semibold text-foreground">{formatMoney(item.listing.price)}</p>
                {item.listing.depositAmount > 0 ? <p className="text-xs text-muted-foreground">+ {formatMoney(item.listing.depositAmount)} refundable bottle deposit</p> : null}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                {unavailable ? (
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-danger"><PackageX aria-hidden="true" className="size-4" /> Not available</span>
                ) : (
                  <>
                    <span className="text-sm font-medium text-muted-foreground">Quantity</span>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setQuantity(item.product.id, quantity - 1)} disabled={quantity === 0} aria-label={`Decrease ${item.product.name}`} className="flex size-9 items-center justify-center rounded-full border border-border-strong text-foreground disabled:opacity-40"><Minus aria-hidden="true" className="size-4" /></button>
                      <output className="w-5 text-center font-semibold text-foreground" aria-label={`${item.product.name} quantity`}>{quantity}</output>
                      <button type="button" onClick={() => setQuantity(item.product.id, Math.min(quantity + 1, item.availableQuantity))} disabled={quantity >= item.availableQuantity} aria-label={`Increase ${item.product.name}`} className="flex size-9 items-center justify-center rounded-full border border-border-strong text-foreground disabled:opacity-40"><Plus aria-hidden="true" className="size-4" /></button>
                    </div>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <aside className="sticky bottom-4 mt-7 flex flex-col gap-4 rounded-card border border-border bg-surface/95 p-4 shadow-dialog backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Product subtotal</p>
          <p className="text-xl font-semibold text-foreground">{formatMoney(totals.subtotal)}</p>
          {!meetsMinimum ? <p className="text-xs font-medium text-warning">Add {formatMoney(query.data.business.minimumOrder - totals.subtotal)} to meet the minimum.</p> : null}
        </div>
        <Link href="/order/fulfilment" aria-disabled={totals.items.length === 0 || !meetsMinimum} className={`inline-flex min-h-control items-center justify-center gap-2 rounded-control px-5 py-2.5 text-sm font-semibold ${totals.items.length > 0 && meetsMinimum ? "bg-primary text-primary-foreground hover:bg-primary-hover" : "pointer-events-none bg-disabled text-disabled-foreground"}`}>
          Continue <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </aside>
    </div>
  );
}
