"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  LockKeyhole,
  Plus,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  FormField,
  LoadingSkeleton,
  OrderSummary,
  formControlClassName,
} from "@/components/ui";
import {
  addressRepository,
  checkoutRepository,
  paymentRepository,
} from "@/data";
import { SubmitButton } from "@/features/auth/auth-controls";
import { CheckoutGuard } from "@/features/checkout/checkout-guard";
import { checkoutTotals } from "@/features/checkout/checkout-data";
import { useCheckout } from "@/features/checkout/checkout-provider";
import type { PaymentMethod } from "@/domain/types";
import { formatMoney } from "@/lib/money";

function useCompleteCheckout() {
  const router = useRouter();
  const { draft, setCompleted } = useCheckout();

  return useMutation({
    mutationFn: (paymentMethodId?: string) =>
      checkoutRepository.complete({
        customerId: "usr_001",
        businessId: draft.businessId!,
        items: Object.entries(draft.quantities).map(([productId, quantity]) => ({
          productId,
          quantity,
        })),
        fulfilmentMode: draft.fulfilmentMode!,
        addressId: draft.addressId ?? undefined,
        paymentMethodId: paymentMethodId ?? draft.paymentMethodId!,
        notes: draft.notes,
      }),
    onSuccess: (completed) => {
      setCompleted(completed);
      router.push("/order/payment/success");
    },
  });
}

export function OrderReviewScreen() {
  const { draft, setNotes } = useCheckout();
  const catalogQuery = useQuery({
    queryKey: ["checkout-catalog", draft.businessId],
    queryFn: () => checkoutRepository.catalog(draft.businessId!),
    enabled: Boolean(draft.businessId),
  });
  const addressQuery = useQuery({
    queryKey: ["checkout-address", draft.addressId],
    queryFn: async () =>
      (await addressRepository.listForOwner("usr_001")).find(
        (address) => address.id === draft.addressId,
      ),
    enabled: Boolean(draft.addressId),
  });

  if (
    !draft.businessId ||
    Object.keys(draft.quantities).length === 0 ||
    !draft.fulfilmentMode ||
    (draft.fulfilmentMode === "DELIVERY" && !draft.addressId)
  ) {
    return <CheckoutGuard title="Checkout details are incomplete" description="Complete product, fulfilment, and delivery choices before reviewing the order." href="/order/products" actionLabel="Return to checkout" />;
  }

  if (catalogQuery.isLoading) return <LoadingSkeleton className="h-96" />;
  if (!catalogQuery.data) return <CheckoutGuard title="Order cannot be reviewed" description="The selected business catalogue is unavailable." href="/order/business" actionLabel="Choose business" />;

  const totals = checkoutTotals(draft, catalogQuery.data);

  return (
    <div>
      <p className="text-sm font-semibold text-primary">Step 4</p>
      <h1 className="mt-2 text-heading-1 font-semibold text-foreground">Review your order</h1>
      <p className="mt-3 text-sm text-muted-foreground">Prices and stock will be checked once more at payment.</p>

      <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <OrderSummary
            businessName={catalogQuery.data.business.name}
            items={totals.items.map((item) => ({
              id: item.product.id,
              name: item.product.name,
              quantity: item.quantity,
              unitPrice: item.listing.price,
              detail:
                item.listing.depositAmount > 0
                  ? `${formatMoney(item.listing.depositAmount)} deposit each`
                  : undefined,
            }))}
            subtotal={totals.subtotal}
            deliveryFee={totals.deliveryFee}
            depositAmount={totals.depositAmount}
            discount={0}
            total={totals.total}
          />
          <section className="rounded-card border border-border bg-surface p-5 shadow-card">
            <h2 className="font-semibold text-foreground">Order note</h2>
            <p className="mt-1 text-sm text-muted-foreground">Optional instructions for the business or delivery rider.</p>
            <textarea
              defaultValue={draft.notes}
              onBlur={(event) => setNotes(event.target.value)}
              rows={3}
              maxLength={240}
              placeholder="For example, call when you reach the gate."
              className={`${formControlClassName} mt-4 resize-y`}
            />
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-card border border-border bg-surface p-5 shadow-card">
            <p className="text-xs font-bold tracking-wide text-primary uppercase">Fulfilment</p>
            <h2 className="mt-2 font-semibold text-foreground">{draft.fulfilmentMode === "DELIVERY" ? "Doorstep delivery" : "Business pickup"}</h2>
            {draft.fulfilmentMode === "DELIVERY" ? (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {addressQuery.data ? [addressQuery.data.line1, addressQuery.data.line2, addressQuery.data.city].filter(Boolean).join(", ") : "Loading address..."}
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Collect from {catalogQuery.data.business.name}.</p>
            )}
            <Link href="/order/fulfilment" className="mt-4 inline-flex text-sm font-semibold text-primary">Change fulfilment</Link>
          </section>
          <section className="rounded-card bg-primary-soft p-5 text-sm leading-6 text-info">
            <ShieldCheck aria-hidden="true" className="size-5" />
            <p className="mt-3 font-semibold text-foreground">Protected checkout</p>
            <p className="mt-1">Card details are tokenized and never stored in the mock database.</p>
          </section>
        </aside>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Link href={draft.fulfilmentMode === "DELIVERY" ? "/order/address" : "/order/fulfilment"} className="inline-flex min-h-control items-center justify-center gap-2 rounded-control border border-border-strong px-4 py-2.5 text-sm font-semibold text-foreground"><ArrowLeft aria-hidden="true" className="size-4" /> Back</Link>
        <Link href="/order/payment" className="inline-flex min-h-control items-center justify-center gap-2 rounded-control bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">Choose payment <ArrowRight aria-hidden="true" className="size-4" /></Link>
      </div>
    </div>
  );
}

export function PaymentSelectionScreen() {
  const router = useRouter();
  const { draft, setPaymentMethod } = useCheckout();
  const completeMutation = useCompleteCheckout();
  const query = useQuery({
    queryKey: ["checkout-payment-options", "usr_001"],
    queryFn: async () => {
      const [methods, wallet] = await Promise.all([
        paymentRepository.listMethods("usr_001"),
        paymentRepository.findWallet("usr_001"),
      ]);
      return { methods, wallet };
    },
  });

  if (!draft.businessId || !draft.fulfilmentMode || Object.keys(draft.quantities).length === 0) {
    return <CheckoutGuard title="Review the order first" description="Payment options appear after the checkout details are complete." href="/order/summary" actionLabel="Review order" />;
  }

  const walletMethod = query.data?.methods.find((method) => method.type === "WALLET");
  const cards = query.data?.methods.filter((method) => method.type === "CARD") ?? [];

  function selectCard(method: PaymentMethod) {
    setPaymentMethod(method.id);
    router.push("/order/payment/card");
  }

  function payWithWallet() {
    if (!walletMethod) return;
    setPaymentMethod(walletMethod.id);
    completeMutation.mutate(walletMethod.id);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold text-primary">Step 5</p>
      <h1 className="mt-2 text-heading-1 font-semibold text-foreground">Choose a payment method</h1>
      <p className="mt-3 text-sm text-muted-foreground">Payment is simulated; no real charge will be made.</p>

      {query.isLoading ? <LoadingSkeleton className="mt-7 h-72" /> : null}
      {query.data ? (
        <div className="mt-7 space-y-4">
          <section className="rounded-card border border-border bg-surface p-5 shadow-card">
            <div className="flex items-start gap-4">
              <span className="flex size-11 items-center justify-center rounded-control bg-primary-soft text-primary"><WalletCards aria-hidden="true" className="size-5" /></span>
              <div className="flex-1">
                <h2 className="font-semibold text-foreground">AquaLoop wallet</h2>
                <p className="mt-1 text-sm text-muted-foreground">Available balance: {query.data.wallet ? formatMoney(query.data.wallet.cachedBalance) : "Unavailable"}</p>
              </div>
            </div>
            <button type="button" onClick={payWithWallet} disabled={!walletMethod || !query.data.wallet || completeMutation.isPending} className="mt-5 inline-flex min-h-control w-full items-center justify-center rounded-control border border-border-strong px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary disabled:opacity-50">
              {completeMutation.isPending ? "Confirming wallet payment..." : "Pay with wallet"}
            </button>
          </section>

          {cards.map((card) => (
            <button key={card.id} type="button" onClick={() => selectCard(card)} className="flex w-full items-center gap-4 rounded-card border border-border bg-surface p-5 text-left shadow-card transition hover:border-primary">
              <span className="flex size-11 items-center justify-center rounded-control bg-surface-muted text-foreground"><CreditCard aria-hidden="true" className="size-5" /></span>
              <span className="flex-1"><span className="block font-semibold text-foreground">{card.brand} ending {card.last4}</span><span className="mt-1 block text-sm text-muted-foreground">Expires {String(card.expiryMonth).padStart(2, "0")}/{card.expiryYear}</span></span>
              <ArrowRight aria-hidden="true" className="size-5 text-primary" />
            </button>
          ))}

          <Link href="/order/payment/card/new" className="flex min-h-control w-full items-center justify-center gap-2 rounded-control border border-dashed border-border-strong bg-surface px-4 py-3 text-sm font-semibold text-primary hover:border-primary"><Plus aria-hidden="true" className="size-4" /> Add a tokenized demo card</Link>
        </div>
      ) : null}
      {completeMutation.isError ? <p role="alert" className="mt-4 rounded-control bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{completeMutation.error.message}</p> : null}
      <Link href="/order/summary" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft aria-hidden="true" className="size-4" /> Back to review</Link>
    </div>
  );
}

export function SavedCardPaymentScreen() {
  const { draft, setPaymentMethod } = useCheckout();
  const completeMutation = useCompleteCheckout();
  const query = useQuery({
    queryKey: ["checkout-payment-methods", "usr_001"],
    queryFn: () => paymentRepository.listMethods("usr_001"),
  });

  if (!draft.businessId || !draft.fulfilmentMode) {
    return <CheckoutGuard title="Checkout is incomplete" description="Complete the order review before confirming card payment." href="/order/summary" actionLabel="Review order" />;
  }

  const cards = query.data?.filter((method) => method.type === "CARD") ?? [];
  const selectedId = draft.paymentMethodId && cards.some((card) => card.id === draft.paymentMethodId)
    ? draft.paymentMethodId
    : cards.find((card) => card.isDefault)?.id ?? cards[0]?.id;

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm font-semibold text-primary">Saved card payment</p>
      <h1 className="mt-2 text-heading-1 font-semibold text-foreground">Confirm your card</h1>
      <p className="mt-3 text-sm text-muted-foreground">Choose a tokenized card. The demo does not store or submit card numbers.</p>
      <div className="mt-7 space-y-3">
        {query.isLoading ? <LoadingSkeleton className="h-36" /> : null}
        {cards.map((card) => {
          const selected = card.id === selectedId;
          return (
            <button key={card.id} type="button" onClick={() => setPaymentMethod(card.id)} className={`flex w-full items-center gap-4 rounded-card border bg-surface p-5 text-left ${selected ? "border-primary ring-3 ring-primary/10" : "border-border"}`}>
              <CreditCard aria-hidden="true" className="size-6 text-primary" />
              <span className="flex-1"><span className="block font-semibold text-foreground">{card.brand} •••• {card.last4}</span><span className="mt-1 block text-sm text-muted-foreground">Expires {String(card.expiryMonth).padStart(2, "0")}/{card.expiryYear}</span></span>
              {selected ? <Check aria-label="Selected" className="size-5 text-primary" /> : null}
            </button>
          );
        })}
      </div>
      <div className="mt-6 rounded-control bg-primary-soft px-4 py-3 text-sm text-info"><LockKeyhole aria-hidden="true" className="mr-2 inline size-4" /> Payment confirmation is simulated locally.</div>
      {completeMutation.isError ? <p role="alert" className="mt-4 rounded-control bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{completeMutation.error.message}</p> : null}
      <SubmitButton pending={completeMutation.isPending} disabled={!selectedId} onClick={() => { if (selectedId) { setPaymentMethod(selectedId); completeMutation.mutate(selectedId); } }} className="mt-6">Pay securely</SubmitButton>
      <Link href="/order/payment" className="mt-4 flex min-h-control items-center justify-center text-sm font-semibold text-primary">Choose another payment method</Link>
    </div>
  );
}

type CardErrors = Record<string, string>;

export function NewCardScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setPaymentMethod } = useCheckout();
  const [errors, setErrors] = useState<CardErrors>({});
  const mutation = useMutation({
    mutationFn: (input: Parameters<typeof paymentRepository.addTokenizedCard>[1]) =>
      paymentRepository.addTokenizedCard("usr_001", input),
    onSuccess: (card) => {
      setPaymentMethod(card.id);
      queryClient.invalidateQueries({ queryKey: ["checkout-payment-methods", "usr_001"] });
      queryClient.invalidateQueries({ queryKey: ["checkout-payment-options", "usr_001"] });
      router.push("/order/payment/card");
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const cardNumber = String(formData.get("cardNumber") ?? "").replace(/\D/g, "");
    const expiry = String(formData.get("expiry") ?? "").trim();
    const securityCode = String(formData.get("securityCode") ?? "").trim();
    const [monthText, yearText] = expiry.split("/");
    const expiryMonth = Number(monthText);
    const expiryYear = 2000 + Number(yearText);
    const nextErrors: CardErrors = {};
    if (cardNumber.length !== 16) nextErrors.cardNumber = "Enter the 16-digit demo card number.";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) nextErrors.expiry = "Use MM/YY format.";
    if (!/^\d{3,4}$/.test(securityCode)) nextErrors.securityCode = "Enter a valid demo security code.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      mutation.mutate({
        brand: cardNumber.startsWith("4") ? "Visa" : "Mastercard",
        last4: cardNumber.slice(-4),
        expiryMonth,
        expiryYear,
      });
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/order/payment" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft aria-hidden="true" className="size-4" /> Back to payment methods</Link>
      <p className="mt-6 text-sm font-semibold text-primary">Tokenized card</p>
      <h1 className="mt-2 text-heading-1 font-semibold text-foreground">Add a demo card</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Use test details only. The card number and security code are discarded after tokenization.</p>
      <form onSubmit={handleSubmit} className="mt-7 space-y-5 rounded-panel border border-border bg-surface p-5 shadow-card sm:p-7" noValidate>
        <FormField id="cardNumber" label="Demo card number" description="Use 4242 4242 4242 4242." error={errors.cardNumber} required disabled={mutation.isPending}>{(props) => <input {...props} name="cardNumber" inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" className={formControlClassName} />}</FormField>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="expiry" label="Expiry" error={errors.expiry} required disabled={mutation.isPending}>{(props) => <input {...props} name="expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="09/28" className={formControlClassName} />}</FormField>
          <FormField id="securityCode" label="Security code" error={errors.securityCode} required disabled={mutation.isPending}>{(props) => <input {...props} name="securityCode" inputMode="numeric" autoComplete="cc-csc" placeholder="123" className={formControlClassName} />}</FormField>
        </div>
        {mutation.isError ? <p role="alert" className="text-sm font-medium text-danger">{mutation.error.message}</p> : null}
        <SubmitButton pending={mutation.isPending}><CreditCard aria-hidden="true" className="size-4" /> Tokenize demo card</SubmitButton>
      </form>
    </div>
  );
}
