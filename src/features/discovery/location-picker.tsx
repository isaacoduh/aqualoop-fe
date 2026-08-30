"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, LocateFixed, MapPin, Navigation, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { EmptyState, LoadingSkeleton } from "@/components/ui";
import { addressRepository } from "@/data";

export function LocationPicker() {
  const [selectedId, setSelectedId] = useState("addr_usr_001_home");
  const [saved, setSaved] = useState(false);
  const query = useQuery({
    queryKey: ["customer-addresses", "usr_001"],
    queryFn: () => addressRepository.listForOwner("usr_001"),
  });
  const currentLocationMutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return "addr_usr_001_home";
    },
    onSuccess: (addressId) => {
      setSelectedId(addressId);
      setSaved(true);
      sessionStorage.setItem("aqualoop.discoveryAddressId", addressId);
    },
  });

  function chooseAddress(addressId: string) {
    setSelectedId(addressId);
    setSaved(true);
    sessionStorage.setItem("aqualoop.discoveryAddressId", addressId);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold text-primary">Discovery location</p>
      <h1 className="mt-2 text-heading-1 font-semibold text-foreground">Choose where to search</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
        AquaLoop uses this location to calculate distance and show businesses in range.
      </p>

      <button
        type="button"
        onClick={() => currentLocationMutation.mutate()}
        disabled={currentLocationMutation.isPending}
        className="mt-7 flex w-full items-center gap-4 rounded-card border border-primary/20 bg-primary-soft p-4 text-left transition hover:border-primary disabled:opacity-60"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <LocateFixed aria-hidden="true" className={`size-5 ${currentLocationMutation.isPending ? "animate-pulse" : ""}`} />
        </span>
        <span className="flex-1">
          <span className="block font-semibold text-foreground">Use current demo location</span>
          <span className="mt-1 block text-sm text-muted-foreground">Centres the map on Amina&apos;s seeded home address.</span>
        </span>
        <Navigation aria-hidden="true" className="size-5 text-primary" />
      </button>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Saved addresses</h2>
        <span
          aria-disabled="true"
          title="Address creation is included in M03"
          className="inline-flex cursor-not-allowed items-center gap-1.5 text-sm font-semibold text-disabled-foreground"
        >
          <Plus aria-hidden="true" className="size-4" /> Add address in M03
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {query.isLoading ? Array.from({ length: 2 }, (_, index) => <LoadingSkeleton key={index} className="h-24" />) : null}
        {query.isError ? <EmptyState compact title="Addresses are unavailable" description="Try loading your saved locations again." action={<button type="button" onClick={() => query.refetch()} className="text-sm font-semibold text-primary">Retry</button>} /> : null}
        {query.data?.map((address) => {
          const selected = address.id === selectedId;
          return (
            <button
              key={address.id}
              type="button"
              onClick={() => chooseAddress(address.id)}
              className={`flex w-full items-start gap-4 rounded-card border p-4 text-left transition ${selected ? "border-primary bg-primary-soft" : "border-border bg-surface hover:border-border-strong"}`}
            >
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${selected ? "bg-primary text-primary-foreground" : "bg-surface-muted text-muted-foreground"}`}>
                <MapPin aria-hidden="true" className="size-4" />
              </span>
              <span className="flex-1">
                <span className="block text-xs font-bold tracking-wide text-primary uppercase">{address.label}</span>
                <span className="mt-1 block font-semibold text-foreground">{address.line1}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{[address.line2, address.city, address.state].filter(Boolean).join(", ")}</span>
              </span>
              {selected ? <Check aria-label="Selected" className="mt-1 size-5 text-primary" /> : null}
            </button>
          );
        })}
      </div>

      {saved ? (
        <div role="status" className="mt-5 flex items-center gap-2 rounded-control bg-success-soft px-4 py-3 text-sm font-medium text-success">
          <Check aria-hidden="true" className="size-4" /> Discovery location updated for this session.
        </div>
      ) : null}

      <Link href="/app/businesses/nearby" className="mt-6 inline-flex min-h-control w-full items-center justify-center rounded-control bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
        Search this location
      </Link>
    </div>
  );
}
