"use client";

import { Check, Droplets } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { EmptyState } from "@/components/ui";

const steps=[
  {label:"Account",prefixes:["/operator/register","/operator/verify","/operator/account-created"]},
  {label:"Operator",prefixes:["/operator/onboarding"]},
  {label:"Business",prefixes:["/operator/businesses/new"]},
  {label:"Review",prefixes:["/operator/businesses/new/payment","/operator/businesses/new/payment-success","/operator/businesses/new/submitted"]},
] as const;

export function OperatorFlowProgress(){const pathname=usePathname();let active=steps.findIndex((step)=>step.prefixes.some((prefix)=>pathname===prefix||pathname.startsWith(`${prefix}/`)));if(pathname.includes("/payment")||pathname.includes("/submitted"))active=3;return <nav aria-label="Application progress" className="mx-auto mb-7 max-w-3xl"><ol className="flex items-center overflow-x-auto rounded-card border border-border bg-surface px-4 py-3 shadow-sm">{steps.map((step,index)=><li key={step.label} className="flex min-w-fit flex-1 items-center last:flex-none"><span className={`flex items-center gap-2 text-xs font-semibold ${index===active?"text-primary":index<active?"text-success":"text-disabled-foreground"}`}><span className={`flex size-6 items-center justify-center rounded-full border ${index===active?"border-primary bg-primary text-primary-foreground":index<active?"border-success bg-success-soft text-success":"border-border-strong"}`}>{index<active?<Check className="size-3.5"/>:index+1}</span>{step.label}</span>{index<steps.length-1?<span className={`mx-3 h-px min-w-5 flex-1 ${index<active?"bg-success":"bg-border"}`}/>:null}</li>)}</ol></nav>}

export function FlowHeading({eyebrow,title,description}:{eyebrow:string;title:string;description:string}){return <header><p className="text-xs font-bold tracking-[0.16em] text-primary uppercase">{eyebrow}</p><h1 className="mt-2 text-heading-1 font-semibold">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></header>}

export function FlowGuard({title,description,href,label}:{title:string;description:string;href:string;label:string}){return <EmptyState icon={Droplets} title={title} description={description} action={<Link href={href} className="rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">{label}</Link>}/>}
