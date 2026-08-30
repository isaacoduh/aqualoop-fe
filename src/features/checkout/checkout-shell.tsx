"use client";

import { Check, Droplets, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCheckout } from "@/features/checkout/checkout-provider";

const steps = [
  { label: "Business", paths: ["/order/business"] },
  { label: "Products", paths: ["/order/products"] },
  { label: "Fulfilment", paths: ["/order/fulfilment", "/order/address", "/order/address/new"] },
  { label: "Review", paths: ["/order/summary"] },
  { label: "Payment", paths: ["/order/payment", "/order/payment/card", "/order/payment/card/new"] },
  { label: "Done", paths: ["/order/payment/success", "/order/confirmation"] },
] as const;

export function CheckoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { draft } = useCheckout();
  const activeIndex = Math.max(
    0,
    steps.findIndex((step) =>
      (step.paths as readonly string[]).includes(pathname),
    ),
  );
  const itemCount = Object.values(draft.quantities).reduce(
    (sum, quantity) => sum + quantity,
    0,
  );

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex min-h-16 w-full max-w-5xl items-center justify-between gap-4 px-page">
          <Link href="/app" className="inline-flex items-center gap-2 font-semibold text-foreground">
            <span className="flex size-9 items-center justify-center rounded-control bg-primary text-primary-foreground">
              <Droplets aria-hidden="true" className="size-5" />
            </span>
            AquaLoop
          </Link>
          <p className="hidden text-sm font-medium text-muted-foreground sm:block">
            Secure checkout{itemCount > 0 ? ` - ${itemCount} item${itemCount === 1 ? "" : "s"}` : ""}
          </p>
          <Link href="/app" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <X aria-hidden="true" className="size-4" /> Exit
          </Link>
        </div>
      </header>

      <nav aria-label="Checkout progress" className="border-b border-border bg-surface-subtle">
        <ol className="mx-auto flex w-full max-w-5xl items-center overflow-x-auto px-page py-3">
          {steps.map((step, index) => (
            <li key={step.label} className="flex min-w-fit flex-1 items-center last:flex-none">
              <span className={`flex items-center gap-2 text-xs font-semibold ${index === activeIndex ? "text-primary" : index < activeIndex ? "text-success" : "text-disabled-foreground"}`}>
                <span className={`flex size-6 items-center justify-center rounded-full border ${index === activeIndex ? "border-primary bg-primary text-primary-foreground" : index < activeIndex ? "border-success bg-success-soft text-success" : "border-border-strong bg-surface"}`}>
                  {index < activeIndex ? <Check aria-hidden="true" className="size-3.5" /> : index + 1}
                </span>
                {step.label}
              </span>
              {index < steps.length - 1 ? <span aria-hidden="true" className={`mx-3 h-px min-w-6 flex-1 ${index < activeIndex ? "bg-success" : "bg-border"}`} /> : null}
            </li>
          ))}
        </ol>
      </nav>

      <main className="mx-auto w-full max-w-5xl px-page py-7 sm:py-10">
        {children}
      </main>
    </div>
  );
}
