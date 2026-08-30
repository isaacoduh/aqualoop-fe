import { ArrowRight, Droplets, Leaf, Recycle, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui";
import { PageHeading } from "@/features/customer-activity";

export function AboutScreen() {
  return <div><PageHeading eyebrow="About AquaLoop" title="Refill water, reuse more" description="AquaLoop connects customers with approved local water businesses while tracking orders, bottle exchanges, and secure handovers." /><section className="mt-7 overflow-hidden rounded-panel bg-aqua-950 p-7 text-white sm:p-10"><Droplets className="size-10 text-aqua-200" /><h2 className="mt-6 max-w-2xl text-3xl font-semibold">A simpler loop for everyday drinking water</h2><p className="mt-4 max-w-2xl leading-7 text-aqua-100">Find nearby refill partners, pay through tokenized methods, receive with a one-time confirmation code, and keep reusable bottles circulating.</p></section><div className="mt-6 grid gap-4 md:grid-cols-3">{[[Recycle,"Reusable by design","Bottle exchanges connect deposits and empty returns to completed orders."],[ShieldCheck,"Approved partners","Customer discovery includes only active, approved businesses."],[Truck,"Clear fulfilment","Delivery and pickup progress stay connected to each order."]].map(([Icon,title,body])=><Card key={String(title)} className="p-5"><Icon className="size-5 text-primary"/><h2 className="mt-4 font-semibold">{String(title)}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{String(body)}</p></Card>)}</div><nav aria-label="Company information" className="mt-8 grid gap-3 sm:grid-cols-3"><Link href="/app/privacy" className="inline-flex min-h-control items-center justify-between rounded-control border border-border-strong px-4 py-3 text-sm font-semibold">Privacy notice <ArrowRight className="size-4"/></Link><Link href="/app/terms" className="inline-flex min-h-control items-center justify-between rounded-control border border-border-strong px-4 py-3 text-sm font-semibold">Terms of service <ArrowRight className="size-4"/></Link><Link href="/app/support" className="inline-flex min-h-control items-center justify-between rounded-control border border-border-strong px-4 py-3 text-sm font-semibold">Help centre <ArrowRight className="size-4"/></Link></nav><p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground"><Leaf className="size-4 text-success"/> Demo product information for the AquaLoop frontend prototype.</p></div>;
}

const sections = {
  privacy: [
    ["Information we use","AquaLoop uses account details, saved addresses, order activity, payment tokens, and support messages to provide the customer experience."],
    ["Payment data","The prototype stores only tokenized card metadata such as brand, last four digits, and expiry. Card numbers and security codes are discarded."],
    ["Location and delivery","Saved coordinates and addresses help show nearby businesses and fulfil deliveries. Customers control which address is the default."],
    ["Your choices","You can update profile details and saved addresses from the customer account. Contact support for questions about account data."],
  ],
  terms: [
    ["Using AquaLoop","Customers must provide accurate account, delivery, and order information and use confirmation codes only at a genuine handover."],
    ["Orders and availability","Businesses control stock, opening hours, pricing, fulfilment modes, and minimum orders. Availability is rechecked at checkout."],
    ["Payments and refunds","Payments in this frontend are simulated. Production payment, cancellation, and refund rules must be finalized before launch."],
    ["Reusable containers","Bottle deposits and expected empty returns are recorded with eligible exchange products and completed handovers."],
  ],
} as const;

export function PolicyScreen({type}:{type:"privacy"|"terms"}) {
  const privacy=type==="privacy"; return <article className="mx-auto max-w-3xl"><PageHeading eyebrow="Customer information" title={privacy?"Privacy notice":"Terms of service"} description={privacy?"How the AquaLoop prototype handles customer information.":"The working terms represented by this customer prototype."}/><div className="mt-7 rounded-panel border border-border bg-surface p-6 shadow-card sm:p-8"><p className="rounded-control bg-warning-soft px-4 py-3 text-sm text-warning">Prototype copy — legal review is required before production use.</p><div className="mt-7 space-y-7">{sections[type].map(([title,body])=><section key={title}><h2 className="text-lg font-semibold">{title}</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">{body}</p></section>)}</div><p className="mt-8 border-t border-border pt-5 text-xs text-muted-foreground">Last prototype update: 30 August 2026</p></div><Link href="/app/about" className="mt-5 inline-flex text-sm font-semibold text-primary">Return to About AquaLoop</Link></article>;
}
