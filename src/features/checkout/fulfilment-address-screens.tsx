"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  PackageCheck,
  Plus,
  Store,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { FormField, LoadingSkeleton, formControlClassName } from "@/components/ui";
import { addressRepository, checkoutRepository } from "@/data";
import { CheckoutGuard } from "@/features/checkout/checkout-guard";
import { useCheckout } from "@/features/checkout/checkout-provider";
import { SubmitButton } from "@/features/auth/auth-controls";
import { formatMoney } from "@/lib/money";

export function FulfilmentScreen() {
  const router = useRouter();
  const { draft, setFulfilmentMode } = useCheckout();
  const query = useQuery({
    queryKey: ["checkout-catalog", draft.businessId],
    queryFn: () => checkoutRepository.catalog(draft.businessId!),
    enabled: Boolean(draft.businessId),
  });

  if (!draft.businessId || Object.keys(draft.quantities).length === 0) {
    return <CheckoutGuard title="Select products first" description="Choose a business and add products before deciding how to receive the order." href="/order/products" actionLabel="Select products" />;
  }

  if (query.isLoading) return <LoadingSkeleton className="h-80" />;
  if (!query.data) return <CheckoutGuard title="Business unavailable" description="Choose another approved business to continue checkout." href="/order/business" actionLabel="Choose business" />;

  const catalog = query.data;
  const options = [
    {
      mode: "DELIVERY" as const,
      icon: Truck,
      title: "Doorstep delivery",
      description: `Delivered to a saved address within ${catalog.business.deliveryRadiusKm} km.`,
      detail: `${formatMoney(1200)} delivery fee`,
    },
    {
      mode: "PICKUP" as const,
      icon: Store,
      title: "Business pickup",
      description: "Collect the order from the business when it is ready.",
      detail: "No delivery fee",
    },
  ].filter((option) => catalog.business.fulfilmentModes.includes(option.mode));

  function continueCheckout() {
    if (!draft.fulfilmentMode) return;
    router.push(draft.fulfilmentMode === "DELIVERY" ? "/order/address" : "/order/summary");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold text-primary">Step 3</p>
      <h1 className="mt-2 text-heading-1 font-semibold text-foreground">How would you like your order?</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Available options are set by {catalog.business.name}.</p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {options.map((option) => {
          const Icon = option.icon;
          const selected = draft.fulfilmentMode === option.mode;
          return (
            <button key={option.mode} type="button" onClick={() => setFulfilmentMode(option.mode)} className={`relative rounded-card border bg-surface p-5 text-left shadow-card transition ${selected ? "border-primary ring-3 ring-primary/10" : "border-border hover:border-border-strong"}`}>
              {selected ? <span className="absolute top-4 right-4 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check aria-hidden="true" className="size-4" /></span> : null}
              <span className="flex size-11 items-center justify-center rounded-control bg-primary-soft text-primary"><Icon aria-hidden="true" className="size-5" /></span>
              <span className="mt-4 block font-semibold text-foreground">{option.title}</span>
              <span className="mt-2 block text-sm leading-6 text-muted-foreground">{option.description}</span>
              <span className="mt-4 block text-sm font-semibold text-primary">{option.detail}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Link href="/order/products" className="inline-flex min-h-control items-center justify-center gap-2 rounded-control border border-border-strong px-4 py-2.5 text-sm font-semibold text-foreground"><ArrowLeft aria-hidden="true" className="size-4" /> Back</Link>
        <button type="button" onClick={continueCheckout} disabled={!draft.fulfilmentMode} className="inline-flex min-h-control items-center justify-center gap-2 rounded-control bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:bg-disabled disabled:text-disabled-foreground">Continue <ArrowRight aria-hidden="true" className="size-4" /></button>
      </div>
    </div>
  );
}

export function AddressSelectionScreen() {
  const { draft, setAddress } = useCheckout();
  const query = useQuery({
    queryKey: ["checkout-addresses", "usr_001"],
    queryFn: () => addressRepository.listForOwner("usr_001"),
  });

  if (draft.fulfilmentMode !== "DELIVERY") {
    return <CheckoutGuard title="Delivery is not selected" description="Address selection is only required for a delivery order." href="/order/fulfilment" actionLabel="Choose fulfilment" />;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold text-primary">Step 3 - Delivery</p>
      <h1 className="mt-2 text-heading-1 font-semibold text-foreground">Choose a delivery address</h1>
      <p className="mt-3 text-sm text-muted-foreground">The business will confirm delivery coverage before dispatch.</p>

      <div className="mt-7 space-y-3">
        {query.isLoading ? Array.from({ length: 2 }, (_, index) => <LoadingSkeleton key={index} className="h-28" />) : null}
        {query.data?.map((address) => {
          const selected = draft.addressId === address.id;
          return (
            <button key={address.id} type="button" onClick={() => setAddress(address.id)} className={`flex w-full items-start gap-4 rounded-card border bg-surface p-5 text-left transition ${selected ? "border-primary ring-3 ring-primary/10" : "border-border hover:border-border-strong"}`}>
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${selected ? "bg-primary text-primary-foreground" : "bg-surface-muted text-muted-foreground"}`}><MapPin aria-hidden="true" className="size-4" /></span>
              <span className="flex-1">
                <span className="block text-xs font-bold tracking-wide text-primary uppercase">{address.label}</span>
                <span className="mt-1 block font-semibold text-foreground">{address.line1}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{[address.line2, address.city, address.state].filter(Boolean).join(", ")}</span>
              </span>
              {selected ? <Check aria-label="Selected" className="size-5 text-primary" /> : null}
            </button>
          );
        })}
      </div>

      <Link href="/order/address/new" className="mt-4 inline-flex min-h-control w-full items-center justify-center gap-2 rounded-control border border-dashed border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold text-primary hover:border-primary"><Plus aria-hidden="true" className="size-4" /> Add another address</Link>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Link href="/order/fulfilment" className="inline-flex min-h-control items-center justify-center gap-2 rounded-control border border-border-strong px-4 py-2.5 text-sm font-semibold text-foreground"><ArrowLeft aria-hidden="true" className="size-4" /> Back</Link>
        <Link href="/order/summary" aria-disabled={!draft.addressId} className={`inline-flex min-h-control items-center justify-center gap-2 rounded-control px-5 py-2.5 text-sm font-semibold ${draft.addressId ? "bg-primary text-primary-foreground hover:bg-primary-hover" : "pointer-events-none bg-disabled text-disabled-foreground"}`}>Review order <ArrowRight aria-hidden="true" className="size-4" /></Link>
      </div>
    </div>
  );
}

type AddressErrors = Record<string, string>;

export function NewAddressScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setAddress } = useCheckout();
  const [errors, setErrors] = useState<AddressErrors>({});
  const mutation = useMutation({
    mutationFn: (input: Parameters<typeof addressRepository.createForOwner>[1]) =>
      addressRepository.createForOwner("usr_001", input),
    onSuccess: (address) => {
      setAddress(address.id);
      queryClient.invalidateQueries({ queryKey: ["checkout-addresses", "usr_001"] });
      router.push("/order/address");
    },
  });

  if (draft.fulfilmentMode !== "DELIVERY") {
    return <CheckoutGuard title="Choose delivery first" description="New checkout addresses are available when doorstep delivery is selected." href="/order/fulfilment" actionLabel="Choose fulfilment" />;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const input = {
      label: String(formData.get("label") ?? "HOME") as "HOME" | "WORK" | "BUSINESS" | "OTHER",
      line1: String(formData.get("line1") ?? "").trim(),
      line2: String(formData.get("line2") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      state: String(formData.get("state") ?? "").trim(),
    };
    const nextErrors: AddressErrors = {};
    if (input.line1.length < 5) nextErrors.line1 = "Enter a complete street address.";
    if (input.city.length < 2) nextErrors.city = "Enter a city.";
    if (input.state.length < 2) nextErrors.state = "Enter a state or region.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) mutation.mutate(input);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/order/address" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft aria-hidden="true" className="size-4" /> Back to addresses</Link>
      <p className="mt-6 text-sm font-semibold text-primary">Delivery address</p>
      <h1 className="mt-2 text-heading-1 font-semibold text-foreground">Add a new address</h1>
      <form onSubmit={handleSubmit} className="mt-7 space-y-5 rounded-panel border border-border bg-surface p-5 shadow-card sm:p-7" noValidate>
        <FormField id="label" label="Address label" required disabled={mutation.isPending}>{(props) => <select {...props} name="label" className={formControlClassName}><option value="HOME">Home</option><option value="WORK">Work</option><option value="OTHER">Other</option></select>}</FormField>
        <FormField id="line1" label="Street address" error={errors.line1} required disabled={mutation.isPending}>{(props) => <input {...props} name="line1" autoComplete="address-line1" className={formControlClassName} />}</FormField>
        <FormField id="line2" label="Area or landmark" disabled={mutation.isPending}>{(props) => <input {...props} name="line2" autoComplete="address-line2" className={formControlClassName} />}</FormField>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="city" label="City" error={errors.city} required disabled={mutation.isPending}>{(props) => <input {...props} name="city" autoComplete="address-level2" className={formControlClassName} />}</FormField>
          <FormField id="state" label="State" error={errors.state} required disabled={mutation.isPending}>{(props) => <input {...props} name="state" autoComplete="address-level1" className={formControlClassName} />}</FormField>
        </div>
        {mutation.isError ? <p role="alert" className="text-sm font-medium text-danger">{mutation.error.message}</p> : null}
        <SubmitButton pending={mutation.isPending}><PackageCheck aria-hidden="true" className="size-4" /> Save delivery address</SubmitButton>
      </form>
    </div>
  );
}
