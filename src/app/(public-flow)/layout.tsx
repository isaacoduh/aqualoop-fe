import { Droplets, Recycle, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function PublicFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-[-10rem] size-[30rem] rounded-full bg-aqua-100/70 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[-12rem] left-[-10rem] size-[28rem] rounded-full bg-primary-soft blur-3xl" />

      <header className="relative z-10 border-b border-border/70 bg-surface/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-app items-center justify-between px-page py-4">
          <Link href="/" className="inline-flex items-center gap-2.5 font-semibold tracking-tight text-foreground">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Droplets aria-hidden="true" className="size-5" />
            </span>
            <span className="text-lg">AquaLoop</span>
          </Link>
          <div className="hidden items-center gap-5 text-xs font-medium text-muted-foreground sm:flex">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
              Secure accounts
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Recycle aria-hidden="true" className="size-4 text-primary" />
              Refill. Reuse. Repeat.
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center px-page py-10 sm:py-14">
        <div className="mx-auto w-full max-w-app">{children}</div>
      </main>

      <footer className="relative z-10 px-page py-5 text-center text-xs text-muted-foreground">
        <p>Demo experience - no real payment or identity details are collected.</p>
      </footer>
    </div>
  );
}
