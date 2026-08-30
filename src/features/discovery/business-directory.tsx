"use client";

import { useQuery } from "@tanstack/react-query";
import { ListFilter, Map, Search, SearchX } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { EmptyState, formControlClassName } from "@/components/ui";
import { businessRepository } from "@/data";
import { BusinessCard } from "@/features/discovery/business-card";
import { BusinessGridLoading } from "@/features/discovery/discovery-loading";

type FulfilmentFilter = "ALL" | "DELIVERY" | "PICKUP";

export function BusinessDirectory({ nearbyOnly = false }: { nearbyOnly?: boolean }) {
  const [search, setSearch] = useState("");
  const [fulfilment, setFulfilment] = useState<FulfilmentFilter>("ALL");
  const [openOnly, setOpenOnly] = useState(false);
  const query = useQuery({
    queryKey: ["business-discovery"],
    queryFn: () => businessRepository.listDiscovery(),
  });

  const businesses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return (query.data ?? []).filter((item) => {
      const matchesDistance = !nearbyOnly || item.distanceKm <= 8;
      const matchesSearch =
        !normalizedSearch ||
        item.business.name.toLowerCase().includes(normalizedSearch) ||
        item.business.description.toLowerCase().includes(normalizedSearch) ||
        item.address.city.toLowerCase().includes(normalizedSearch);
      const matchesFulfilment =
        fulfilment === "ALL" || item.business.fulfilmentModes.includes(fulfilment);
      const matchesOpen = !openOnly || item.business.isOpen;

      return matchesDistance && matchesSearch && matchesFulfilment && matchesOpen;
    });
  }, [fulfilment, nearbyOnly, openOnly, query.data, search]);

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary">
            {nearbyOnly ? "Within 8 km" : "Approved refill partners"}
          </p>
          <h1 className="mt-2 text-heading-1 font-semibold text-foreground">
            {nearbyOnly ? "Businesses near you" : "Find a refill business"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Compare distance, availability, fulfilment options, and minimum order.
          </p>
        </div>
        <Link
          href={nearbyOnly ? "/app/businesses" : "/app/businesses/nearby"}
          className="inline-flex min-h-control items-center justify-center gap-2 rounded-control border border-border-strong bg-surface px-4 py-2 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
        >
          {nearbyOnly ? <ListFilter aria-hidden="true" className="size-4" /> : <Map aria-hidden="true" className="size-4" />}
          {nearbyOnly ? "View all businesses" : "Nearby view"}
        </Link>
      </div>

      <div className="mt-7 grid gap-3 rounded-card border border-border bg-surface p-4 shadow-card md:grid-cols-[minmax(0,1fr)_12rem_auto]">
        <label className="relative">
          <span className="sr-only">Search businesses</span>
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, service, or area"
            className={`${formControlClassName} pl-10`}
          />
        </label>
        <label>
          <span className="sr-only">Fulfilment method</span>
          <select
            value={fulfilment}
            onChange={(event) => setFulfilment(event.target.value as FulfilmentFilter)}
            className={formControlClassName}
          >
            <option value="ALL">All fulfilment</option>
            <option value="DELIVERY">Delivery</option>
            <option value="PICKUP">Pickup</option>
          </select>
        </label>
        <label className="flex min-h-control items-center gap-2 rounded-control border border-border-strong px-3 text-sm font-medium text-muted-foreground">
          <input
            type="checkbox"
            checked={openOnly}
            onChange={(event) => setOpenOnly(event.target.checked)}
            className="size-4 accent-primary"
          />
          Open now
        </label>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
        <p>{query.isLoading ? "Finding businesses..." : `${businesses.length} businesses found`}</p>
        <Link href="/app/location" className="font-semibold text-primary hover:text-primary-hover">Change location</Link>
      </div>

      <div className="mt-5">
        {query.isLoading ? <BusinessGridLoading /> : null}
        {query.isError ? (
          <EmptyState
            icon={SearchX}
            title="We could not load businesses"
            description="Check your connection and try loading the approved partners again."
            action={<button type="button" onClick={() => query.refetch()} className="rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Try again</button>}
          />
        ) : null}
        {query.isSuccess && businesses.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No businesses match these filters"
            description="Clear a filter, search another area, or explore the dedicated no-results guidance."
            action={<div className="flex flex-wrap justify-center gap-3"><button type="button" onClick={() => { setSearch(""); setFulfilment("ALL"); setOpenOnly(false); }} className="rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Clear filters</button><Link href="/app/no-businesses" className="rounded-control border border-border-strong px-4 py-2 text-sm font-semibold text-foreground">No-results help</Link></div>}
          />
        ) : null}
        {query.isSuccess && businesses.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {businesses.map((item) => <BusinessCard key={item.business.id} item={item} />)}
          </div>
        ) : null}
      </div>
    </div>
  );
}
