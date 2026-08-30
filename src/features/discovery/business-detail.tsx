"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock3,
  Droplets,
  MapPin,
  PackageCheck,
  Phone,
  SearchX,
  Star,
  Truck,
} from "lucide-react";
import Link from "next/link";

import { EmptyState, LoadingSkeleton } from "@/components/ui";
import {
  businessRepository,
  productRepository,
  reviewRepository,
} from "@/data";
import { DiscoveryMap } from "@/features/discovery/discovery-map";
import { formatMoney } from "@/lib/money";

const dayLabels: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export function BusinessDetail({ businessId }: { businessId: string }) {
  const query = useQuery({
    queryKey: ["business-detail", businessId],
    queryFn: async () => {
      const business = await businessRepository.findDiscoveryById(businessId);
      if (!business) return null;

      const [products, reviews] = await Promise.all([
        productRepository.listForBusiness(businessId),
        reviewRepository.listForBusiness(businessId),
      ]);
      return { business, products, reviews };
    },
  });

  if (query.isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton shape="text" className="w-40" />
        <LoadingSkeleton className="h-72" />
        <div className="grid gap-5 md:grid-cols-2">
          <LoadingSkeleton className="h-52" />
          <LoadingSkeleton className="h-52" />
        </div>
      </div>
    );
  }

  if (query.isError) {
    return (
      <EmptyState
        icon={SearchX}
        title="We could not load this business"
        description="Try again or return to the approved business directory."
        action={<button type="button" onClick={() => query.refetch()} className="rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Try again</button>}
      />
    );
  }

  if (!query.data) {
    return (
      <EmptyState
        icon={SearchX}
        title="Business is not available"
        description="This business may still be awaiting verification or is no longer customer-selectable."
        action={<Link href="/app/businesses" className="rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Browse approved businesses</Link>}
      />
    );
  }

  const { business: item, products, reviews } = query.data;
  const { business, address } = item;

  return (
    <div>
      <Link href="/app/businesses" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover">
        <ArrowLeft aria-hidden="true" className="size-4" /> Back to businesses
      </Link>

      <section className="relative mt-5 overflow-hidden rounded-panel border border-aqua-800 bg-aqua-950 px-6 py-8 text-white shadow-card sm:px-8 sm:py-10">
        <div aria-hidden="true" className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_15%_20%,#75dcff_0,transparent_26%),radial-gradient(circle_at_85%_75%,#2dc8f3_0,transparent_30%)]" />
        <div className="relative flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-pill px-3 py-1 text-xs font-semibold ${business.isOpen ? "bg-success-soft text-success" : "bg-white/10 text-aqua-100"}`}>
                {business.isOpen ? "Open now" : "Closed now"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-pill bg-white/10 px-3 py-1 text-xs font-semibold text-aqua-100">
                <Star aria-hidden="true" className="size-3.5 fill-warning text-warning" /> {business.rating.toFixed(1)} ({business.reviewCount} reviews)
              </span>
            </div>
            <h1 className="mt-5 text-heading-1 font-semibold text-white">{business.name}</h1>
            <p className="mt-3 text-base leading-7 text-aqua-100">{business.description}</p>
            <p className="mt-5 flex items-center gap-2 text-sm text-aqua-100">
              <MapPin aria-hidden="true" className="size-4" />
              {[address.line1, address.line2, address.city].filter(Boolean).join(", ")} - {item.distanceKm.toFixed(1)} km away
            </p>
          </div>
          <div className="min-w-52 rounded-card bg-white/10 p-4 backdrop-blur">
            <p className="text-xs text-aqua-100">Minimum order</p>
            <p className="mt-1 text-2xl font-semibold">{formatMoney(business.minimumOrder)}</p>
            <p className="mt-3 text-xs text-aqua-100">
              {business.isOpen ? "Ordering will be enabled in M03." : "View products now and return during opening hours."}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-7 grid gap-5 sm:grid-cols-3">
        <div className="rounded-card border border-border bg-surface p-5">
          <Truck aria-hidden="true" className="size-5 text-primary" />
          <p className="mt-3 font-semibold text-foreground">Fulfilment</p>
          <p className="mt-1 text-sm text-muted-foreground">{business.fulfilmentModes.map((mode) => mode === "DELIVERY" ? "Delivery" : "Pickup").join(" and ")}</p>
        </div>
        <div className="rounded-card border border-border bg-surface p-5">
          <MapPin aria-hidden="true" className="size-5 text-primary" />
          <p className="mt-3 font-semibold text-foreground">Delivery radius</p>
          <p className="mt-1 text-sm text-muted-foreground">{business.deliveryRadiusKm > 0 ? `Up to ${business.deliveryRadiusKm} km` : "Pickup only"}</p>
        </div>
        <div className="rounded-card border border-border bg-surface p-5">
          <Phone aria-hidden="true" className="size-5 text-primary" />
          <p className="mt-3 font-semibold text-foreground">Business contact</p>
          <p className="mt-1 text-sm text-muted-foreground">{business.phone}</p>
        </div>
      </section>

      <section aria-labelledby="available-products-heading" className="mt-10">
        <div>
          <p className="text-sm font-semibold text-primary">Available today</p>
          <h2 id="available-products-heading" className="mt-1 text-heading-2 font-semibold text-foreground">Products and bottle exchanges</h2>
        </div>
        {products.length > 0 ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map(({ product, listing }) => (
              <article key={listing.id} className="rounded-card border border-border bg-surface p-5 shadow-card">
                <span className="flex size-11 items-center justify-center rounded-control bg-primary-soft text-primary">
                  <Droplets aria-hidden="true" className="size-5" />
                </span>
                <p className="mt-4 text-xs font-bold tracking-wide text-primary uppercase">{product.type === "REFILL" ? "Bottle refill" : "Bottle exchange"}</p>
                <h3 className="mt-2 font-semibold text-foreground">{product.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{product.description}</p>
                <div className="mt-5 flex items-end justify-between gap-3 border-t border-border pt-4">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{formatMoney(listing.price)}</p>
                    {listing.depositAmount > 0 ? <p className="text-xs text-muted-foreground">+ {formatMoney(listing.depositAmount)} deposit</p> : null}
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-pill bg-success-soft px-2.5 py-1 text-xs font-semibold text-success"><PackageCheck aria-hidden="true" className="size-3.5" /> Available</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState compact title="No products available" description="This business has not published active products yet." />
        )}
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="opening-hours-heading" className="rounded-panel border border-border bg-surface p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-control bg-primary-soft text-primary"><Clock3 aria-hidden="true" className="size-5" /></span>
            <h2 id="opening-hours-heading" className="text-lg font-semibold text-foreground">Opening hours</h2>
          </div>
          <dl className="mt-5 divide-y divide-border">
            {Object.entries(business.openingHours).map(([day, hours]) => (
              <div key={day} className="flex items-center justify-between py-2.5 text-sm">
                <dt className="font-medium text-foreground">{dayLabels[day] ?? day}</dt>
                <dd className={hours ? "text-muted-foreground" : "font-medium text-danger"}>{hours ? `${hours[0]} - ${hours[1]}` : "Closed"}</dd>
              </div>
            ))}
          </dl>
        </section>
        <div>
          <DiscoveryMap businesses={[item]} compact />
          <div className="mt-4 rounded-card border border-border bg-surface p-4 text-sm text-muted-foreground">
            <strong className="text-foreground">Pickup address:</strong> {[address.line1, address.line2, address.city, address.state].filter(Boolean).join(", ")}
          </div>
        </div>
      </div>

      <section aria-labelledby="customer-reviews-heading" className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">Customer feedback</p>
            <h2 id="customer-reviews-heading" className="mt-1 text-heading-2 font-semibold text-foreground">Recent reviews</h2>
          </div>
          <p className="text-sm text-muted-foreground">{business.reviewCount} total</p>
        </div>
        {reviews.length > 0 ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <article key={review.id} className="rounded-card border border-border bg-surface p-5">
                <div className="flex items-center gap-1 text-warning" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, index) => <Star key={index} aria-hidden="true" className={`size-4 ${index < review.rating ? "fill-warning" : "text-border"}`} />)}
                </div>
                <p className="mt-3 text-sm leading-6 text-foreground">“{review.body}”</p>
                <p className="mt-3 text-xs font-medium text-muted-foreground">Verified AquaLoop customer</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState compact title="No customer reviews yet" description="This business is waiting for its first verified review." />
        )}
      </section>
    </div>
  );
}
