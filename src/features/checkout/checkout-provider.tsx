"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { CompletedCheckout } from "@/data/mock-db/repositories/checkout.repository";
import type { FulfilmentMode } from "@/domain/types";

const storageKey = "aqualoop.checkoutDraft";

export interface CheckoutDraft {
  businessId: string | null;
  quantities: Record<string, number>;
  fulfilmentMode: FulfilmentMode | null;
  addressId: string | null;
  paymentMethodId: string | null;
  notes: string;
  completed: CompletedCheckout | null;
}

interface CheckoutContextValue {
  draft: CheckoutDraft;
  selectBusiness: (businessId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  setFulfilmentMode: (mode: FulfilmentMode) => void;
  setAddress: (addressId: string) => void;
  setPaymentMethod: (paymentMethodId: string) => void;
  setNotes: (notes: string) => void;
  setCompleted: (checkout: CompletedCheckout) => void;
  reset: () => void;
}

const initialDraft: CheckoutDraft = {
  businessId: null,
  quantities: {},
  fulfilmentMode: null,
  addressId: null,
  paymentMethodId: null,
  notes: "",
  completed: null,
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<CheckoutDraft>(initialDraft);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      const stored = sessionStorage.getItem(storageKey);
      if (!stored) return;

      try {
        setDraft(JSON.parse(stored) as CheckoutDraft);
      } catch {
        sessionStorage.removeItem(storageKey);
      }
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  const updateDraft = useCallback(
    (updater: (current: CheckoutDraft) => CheckoutDraft) => {
      setDraft((current) => {
        const next = updater(current);
        sessionStorage.setItem(storageKey, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const value = useMemo<CheckoutContextValue>(
    () => ({
      draft,
      selectBusiness: (businessId) =>
        updateDraft((current) =>
          current.businessId === businessId
            ? current
            : {
                ...initialDraft,
                businessId,
              },
        ),
      setQuantity: (productId, quantity) =>
        updateDraft((current) => {
          const quantities = { ...current.quantities };
          if (quantity <= 0) delete quantities[productId];
          else quantities[productId] = quantity;
          return { ...current, quantities, completed: null };
        }),
      setFulfilmentMode: (fulfilmentMode) =>
        updateDraft((current) => ({
          ...current,
          fulfilmentMode,
          addressId:
            fulfilmentMode === "PICKUP" ? null : current.addressId,
          completed: null,
        })),
      setAddress: (addressId) =>
        updateDraft((current) => ({ ...current, addressId, completed: null })),
      setPaymentMethod: (paymentMethodId) =>
        updateDraft((current) => ({
          ...current,
          paymentMethodId,
          completed: null,
        })),
      setNotes: (notes) =>
        updateDraft((current) => ({ ...current, notes, completed: null })),
      setCompleted: (completed) =>
        updateDraft((current) => ({ ...current, completed })),
      reset: () => {
        sessionStorage.removeItem(storageKey);
        setDraft(initialDraft);
      },
    }),
    [draft, updateDraft],
  );

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout(): CheckoutContextValue {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used inside CheckoutProvider");
  }
  return context;
}
