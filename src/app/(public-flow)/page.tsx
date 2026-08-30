import { ArrowRight, BadgeCheck, MapPin, Recycle, Truck } from "lucide-react";
import Link from "next/link";

const benefits = [
  { icon: MapPin, label: "Find trusted refill businesses nearby" },
  { icon: Truck, label: "Choose pickup or doorstep delivery" },
  { icon: Recycle, label: "Keep reusable bottles in circulation" },
] as const;

export default function HomePage() {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
      <section>
        <div className="inline-flex items-center gap-2 rounded-pill border border-primary/15 bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
          <BadgeCheck aria-hidden="true" className="size-4" />
          Better water access, fewer disposable bottles
        </div>
        <h1 className="mt-6 max-w-3xl text-display font-semibold text-foreground">
          Fresh water should be easy to find and kinder to the planet.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          AquaLoop connects households with verified local refill businesses for
          convenient refills, bottle exchanges, pickup, and delivery.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/auth/sign-up"
            className="inline-flex min-h-control items-center justify-center gap-2 rounded-control bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            Create an account
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <Link
            href="/auth/sign-in"
            className="inline-flex min-h-control items-center justify-center rounded-control border border-border-strong bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
          >
            Sign in
          </Link>
        </div>
        <ul className="mt-9 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          {benefits.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-start gap-2.5">
              <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="AquaLoop service preview" className="relative mx-auto w-full max-w-lg">
        <div className="absolute -inset-4 -rotate-2 rounded-[2rem] bg-aqua-200/55" />
        <div className="relative overflow-hidden rounded-[1.75rem] border border-aqua-200 bg-aqua-950 p-6 text-white shadow-dialog sm:p-8">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Water around you</p>
            <span className="rounded-pill bg-white/10 px-3 py-1 text-xs text-aqua-100">3 businesses open</span>
          </div>
          <div className="relative mt-6 h-52 overflow-hidden rounded-panel bg-aqua-900">
            <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,#75dcff_1px,transparent_1px),linear-gradient(to_bottom,#75dcff_1px,transparent_1px)] [background-size:36px_36px]" />
            <span className="absolute top-[28%] left-[24%] size-4 rounded-full border-4 border-white bg-aqua-400 shadow-lg" />
            <span className="absolute top-[55%] left-[68%] size-4 rounded-full border-4 border-white bg-aqua-400 shadow-lg" />
            <span className="absolute top-[38%] left-[52%] flex size-12 items-center justify-center rounded-full border-4 border-aqua-200 bg-primary shadow-lg">
              <MapPin aria-hidden="true" className="size-5" />
            </span>
          </div>
          <div className="mt-5 rounded-card bg-white p-4 text-foreground">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">BlueSpring Refill Hub</p>
                <p className="mt-1 text-xs text-muted-foreground">1.2 km away - Delivery in 25 min</p>
              </div>
              <span className="rounded-pill bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">Open</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
