"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, LocateFixed, MapPin, SearchX, ShoppingBasket } from "lucide-react";
import Link from "next/link";

import { EmptyState, LoadingSkeleton } from "@/components/ui";
import { addressRepository, businessRepository } from "@/data";
import { BusinessCard } from "@/features/discovery/business-card";
import { DiscoveryMap } from "@/features/discovery/discovery-map";

export function CustomerHome() {
  const query = useQuery({
    queryKey: ["customer-home-discovery", "usr_001"],
    queryFn: async () => {
      const [location, businesses] = await Promise.all([
        addressRepository.findDefaultForOwner("usr_001"),
        businessRepository.listDiscovery(),
      ]);
      return { location, businesses };
    },
  });

  return (
    <div className="space-y-9">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary">Good morning, Amina</p>
          <h1 className="mt-2 text-heading-1 font-semibold text-foreground">
            Where should we refill today?
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Discover approved water businesses close to your selected location.
          </p>
        </div>
        <Link
          href="/app/location"
          className="inline-flex min-h-control items-center gap-3 rounded-control border border-border bg-surface px-4 py-2.5 shadow-sm transition hover:border-primary"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-primary-soft text-primary">
            <MapPin aria-hidden="true" className="size-4" />
          </span>
          <span>
            <span className="block text-xs text-muted-foreground">Delivering near</span>
            <span className="block text-sm font-semibold text-foreground">
              {query.data?.location?.line2 ?? query.data?.location?.city ?? "Choose location"}
            </span>
          </span>
        </Link>
      </section>

      {query.isLoading ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.55fr)]">
          <LoadingSkeleton className="h-80 sm:h-96" />
          <div className="space-y-4 rounded-panel border border-border bg-surface p-6">
            <LoadingSkeleton shape="text" className="w-2/3" />
            <LoadingSkeleton shape="text" className="w-full" />
            <LoadingSkeleton className="h-24" />
            <LoadingSkeleton className="h-24" />
          </div>
        </div>
      ) : null}

      {query.isError ? (
        <EmptyState
          icon={SearchX}
          title="Discovery is unavailable"
          description="We could not load nearby refill businesses. Try the search again."
          action={<button type="button" onClick={() => query.refetch()} className="rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Retry discovery</button>}
        />
      ) : null}

      {query.isSuccess ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.55fr)]">
          <DiscoveryMap businesses={query.data.businesses} />
          <aside className="flex flex-col justify-between rounded-panel border border-border bg-surface p-6 shadow-card">
            <div>
              <span className="flex size-11 items-center justify-center rounded-control bg-primary-soft text-primary">
                <LocateFixed aria-hidden="true" className="size-5" />
              </span>
              <p className="mt-5 text-sm font-semibold text-primary">Around your location</p>
              <h2 className="mt-2 text-heading-2 font-semibold text-foreground">
                {query.data.businesses.length} approved businesses nearby
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Two are accepting orders now. The closest partner is {query.data.businesses[0]?.distanceKm.toFixed(1)} km away.
              </p>
            </div>
            <div className="mt-7 space-y-3">
              <Link href="/app/businesses/nearby" className="flex min-h-control items-center justify-center gap-2 rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
                See nearby businesses <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link href="/app/location" className="flex min-h-control items-center justify-center rounded-control border border-border-strong px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">
                Change location
              </Link>
            </div>
          </aside>
        </div>
      ) : null}

      {query.isSuccess ? (
        <section aria-labelledby="nearby-businesses-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">Ready when you are</p>
              <h2 id="nearby-businesses-heading" className="mt-1 text-heading-2 font-semibold text-foreground">Nearby refill businesses</h2>
            </div>
            <Link href="/app/businesses" className="text-sm font-semibold text-primary hover:text-primary-hover">View all</Link>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {query.data.businesses.slice(0, 3).map((item) => <BusinessCard key={item.business.id} item={item} />)}
          </div>
        </section>
      ) : null}

      <section className="flex flex-col gap-5 rounded-panel bg-aqua-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-control bg-white/10 text-aqua-100">
            <ShoppingBasket aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">Need your usual refill?</h2>
            <p className="mt-1 text-sm leading-6 text-aqua-100">Choose a business now; repeat ordering arrives with the checkout milestone.</p>
          </div>
        </div>
        <Link href="/app/businesses" className="inline-flex min-h-control shrink-0 items-center justify-center gap-2 rounded-control bg-white px-4 py-2.5 text-sm font-semibold text-aqua-950 hover:bg-aqua-50">
          Browse businesses <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </section>
    </div>
  );
}
