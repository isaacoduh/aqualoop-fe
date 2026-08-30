import { MapPin, Navigation } from "lucide-react";
import Link from "next/link";

import type { BusinessDiscoveryItem } from "@/data/mock-db/repositories";

const markerPositions = [
  "top-[28%] left-[23%]",
  "top-[58%] left-[68%]",
  "top-[34%] left-[77%]",
] as const;

export function DiscoveryMap({
  businesses,
  compact = false,
}: {
  businesses: BusinessDiscoveryItem[];
  compact?: boolean;
}) {
  return (
    <section
      aria-label="Map of nearby refill businesses"
      className={`relative overflow-hidden rounded-panel border border-aqua-200 bg-aqua-950 ${compact ? "h-60" : "h-80 sm:h-96"}`}
    >
      <div aria-hidden="true" className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#75dcff_1px,transparent_1px),linear-gradient(to_bottom,#75dcff_1px,transparent_1px)] [background-size:42px_42px]" />
      <div aria-hidden="true" className="absolute top-[-25%] left-[20%] h-[150%] w-14 rotate-[32deg] rounded-full border-x border-aqua-300/30 bg-aqua-800/50" />
      <div aria-hidden="true" className="absolute top-[45%] left-[-10%] h-12 w-[120%] -rotate-6 rounded-full border-y border-aqua-300/30 bg-aqua-800/50" />

      <div className="absolute top-4 left-4 rounded-control border border-white/10 bg-aqua-950/80 px-3 py-2 text-xs font-medium text-aqua-100 backdrop-blur">
        <span className="inline-flex items-center gap-1.5">
          <Navigation aria-hidden="true" className="size-3.5" />
          Lekki Phase 1
        </span>
      </div>

      {businesses.slice(0, 3).map((item, index) => (
        <Link
          key={item.business.id}
          href={`/app/businesses/${item.business.id}`}
          aria-label={`${item.business.name}, ${item.distanceKm.toFixed(1)} kilometres away`}
          className={`absolute flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-primary text-primary-foreground shadow-lg transition hover:scale-110 ${markerPositions[index]}`}
        >
          <MapPin aria-hidden="true" className="size-4" />
        </Link>
      ))}

      <div className="absolute right-4 bottom-4 rounded-control bg-surface px-3 py-2 text-xs font-semibold text-foreground shadow-card">
        {businesses.length} approved nearby
      </div>
    </section>
  );
}
