import { ArrowLeft, MapPinOff } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 py-12">
      <section className="w-full max-w-xl rounded-panel border border-border bg-surface p-8 text-center shadow-card sm:p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary">
          <MapPinOff aria-hidden="true" className="size-7" />
        </span>
        <p className="mt-6 text-sm font-semibold text-primary">404 · Page not found</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">This route is outside the loop</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">The page may have moved, or the address may be incomplete.</p>
        <Link href="/" className="mt-7 inline-flex min-h-control items-center gap-2 rounded-control bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
          <ArrowLeft aria-hidden="true" className="size-4" /> Return home
        </Link>
      </section>
    </main>
  );
}
