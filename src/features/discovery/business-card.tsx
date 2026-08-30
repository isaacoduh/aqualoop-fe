import {
  ArrowRight,
  Clock3,
  MapPin,
  PackageCheck,
  Star,
  Truck,
} from "lucide-react";
import Link from "next/link";

import type { BusinessDiscoveryItem } from "@/data/mock-db/repositories";
import { formatMoney } from "@/lib/money";

const businessAccents: Record<string, string> = {
  biz_001: "from-aqua-700 to-aqua-950",
  biz_002: "from-cyan-600 to-sky-900",
  biz_003: "from-teal-600 to-emerald-900",
};

export function BusinessCard({ item }: { item: BusinessDiscoveryItem }) {
  const { business, address, distanceKm } = item;

  return (
    <article className="group overflow-hidden rounded-card border border-border bg-surface shadow-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-dialog">
      <div className={`relative h-32 bg-gradient-to-br ${businessAccents[business.id] ?? "from-aqua-600 to-aqua-950"}`}>
        <div aria-hidden="true" className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_28%),radial-gradient(circle_at_80%_70%,white_0,transparent_24%)]" />
        <span className={`absolute top-4 right-4 rounded-pill px-3 py-1 text-xs font-semibold shadow-sm ${business.isOpen ? "bg-success-soft text-success" : "bg-surface text-muted-foreground"}`}>
          {business.isOpen ? "Open now" : "Closed"}
        </span>
        <span className="absolute -bottom-6 left-5 flex size-14 items-center justify-center rounded-card border-4 border-surface bg-primary-soft text-xl font-bold text-primary shadow-sm">
          {business.name.slice(0, 1)}
        </span>
      </div>

      <div className="px-5 pt-9 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold text-foreground">{business.name}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin aria-hidden="true" className="size-3.5" />
              {address.city} - {distanceKm.toFixed(1)} km away
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
            <Star aria-hidden="true" className="size-4 fill-warning text-warning" />
            {business.rating.toFixed(1)}
          </span>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {business.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {business.fulfilmentModes.includes("DELIVERY") ? (
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-surface-muted px-2.5 py-1.5">
              <Truck aria-hidden="true" className="size-3.5" /> Delivery
            </span>
          ) : null}
          {business.fulfilmentModes.includes("PICKUP") ? (
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-surface-muted px-2.5 py-1.5">
              <PackageCheck aria-hidden="true" className="size-3.5" /> Pickup
            </span>
          ) : null}
          {!business.isOpen ? (
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-warning-soft px-2.5 py-1.5 text-warning">
              <Clock3 aria-hidden="true" className="size-3.5" /> View hours
            </span>
          ) : null}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            Minimum <strong className="text-foreground">{formatMoney(business.minimumOrder)}</strong>
          </p>
          <Link
            href={`/app/businesses/${business.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover"
          >
            View business
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
