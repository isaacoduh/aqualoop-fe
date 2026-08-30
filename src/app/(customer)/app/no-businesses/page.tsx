import { MapPin, SearchX } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/ui";

export default function NoBusinessesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <EmptyState
        icon={SearchX}
        title="No refill businesses found nearby"
        description="AquaLoop currently has no approved businesses matching this location and filter combination. Try a saved address or browse the wider directory."
        action={
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/app/location" className="inline-flex min-h-control items-center justify-center gap-2 rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
              <MapPin aria-hidden="true" className="size-4" /> Change location
            </Link>
            <Link href="/app/businesses" className="inline-flex min-h-control items-center justify-center rounded-control border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">
              Browse all approved businesses
            </Link>
          </div>
        }
      />
      <section className="mt-6 rounded-card border border-border bg-surface p-5">
        <h2 className="font-semibold text-foreground">Why am I seeing this?</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
          <li>Your selected address may be outside current delivery radiuses.</li>
          <li>An “open now” or fulfilment filter may be too restrictive.</li>
          <li>Businesses awaiting verification are intentionally hidden from customer results.</li>
        </ul>
      </section>
    </div>
  );
}
