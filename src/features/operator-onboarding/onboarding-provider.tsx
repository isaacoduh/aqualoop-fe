"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { OperatorApplicationResult } from "@/data/mock-db/repositories/operator-onboarding.repository";
import type { FulfilmentMode } from "@/domain/types";

const storageKey = "aqualoop.operatorApplication";

export interface OperatorOnboardingDraft {
  firstName: string; lastName: string; email: string; phone: string; accountVerified: boolean;
  legalName: string; tradingName: string; registrationNumber: string; identityDocumentLabel: string;
  complianceDocumentLabel: string;
  location: { line1: string; line2: string; city: string; state: string };
  fulfilmentModes: FulfilmentMode[]; deliveryRadiusKm: number;
  businessName: string; description: string; businessPhone: string; businessEmail: string;
  securityReady: boolean; photoLabel: string; planId: string; result: OperatorApplicationResult | null;
}

const initialDraft: OperatorOnboardingDraft = {
  firstName: "", lastName: "", email: "", phone: "", accountVerified: false,
  legalName: "", tradingName: "", registrationNumber: "", identityDocumentLabel: "",
  complianceDocumentLabel: "", location: { line1: "", line2: "", city: "", state: "" },
  fulfilmentModes: [], deliveryRadiusKm: 8, businessName: "", description: "",
  businessPhone: "", businessEmail: "", securityReady: false, photoLabel: "", planId: "plan_starter", result: null,
};

interface OperatorOnboardingContextValue {
  draft: OperatorOnboardingDraft;
  update: (patch: Partial<OperatorOnboardingDraft>) => void;
  reset: () => void;
}

const Context = createContext<OperatorOnboardingContextValue | null>(null);

export function OperatorOnboardingProvider({children}:{children:React.ReactNode}) {
  const [draft,setDraft]=useState(initialDraft);
  useEffect(()=>{const timer=window.setTimeout(()=>{const stored=sessionStorage.getItem(storageKey);if(!stored)return;try{setDraft(JSON.parse(stored) as OperatorOnboardingDraft)}catch{sessionStorage.removeItem(storageKey)}},0);return()=>window.clearTimeout(timer)},[]);
  const update=useCallback((patch:Partial<OperatorOnboardingDraft>)=>setDraft((current)=>{const next={...current,...patch};sessionStorage.setItem(storageKey,JSON.stringify(next));return next}),[]);
  const reset=useCallback(()=>{sessionStorage.removeItem(storageKey);setDraft(initialDraft)},[]);
  const value=useMemo(()=>({draft,update,reset}),[draft,update,reset]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useOperatorOnboarding(){const value=useContext(Context);if(!value)throw new Error("useOperatorOnboarding must be used inside OperatorOnboardingProvider");return value}
