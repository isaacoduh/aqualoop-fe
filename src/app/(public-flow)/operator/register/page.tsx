import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";

export default function OperatorRegistrationHandoffPage() {
  return (
    <section className="mx-auto w-full max-w-lg rounded-panel border border-border bg-surface px-6 py-10 text-center shadow-card sm:px-10">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Building2 aria-hidden="true" className="size-6" />
      </span>
      <p className="mt-6 text-xs font-bold tracking-[0.18em] text-primary uppercase">
        Operator onboarding
      </p>
      <h1 className="mt-3 text-heading-1 font-semibold text-foreground">
        Business registration is the next milestone
      </h1>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        The operator path is reserved and reachable. Its identity, compliance,
        location, delivery, and plan steps will be implemented in M06.
      </p>
      <Link
        href="/auth/sign-up"
        className="mt-8 inline-flex min-h-control w-full items-center justify-center gap-2 rounded-control border border-border-strong px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Choose another account type
      </Link>
    </section>
  );
}
