import { db, delay } from "@/data/mock-db/db";
import type { FulfilmentMode, ID, Plan, VerificationStatus } from "@/domain/types";

export interface OperatorApplicationInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  legalName: string;
  tradingName: string;
  registrationNumber: string;
  identityDocumentLabel: string;
  complianceDocumentLabel: string;
  location: { line1: string; line2?: string; city: string; state: string };
  fulfilmentModes: FulfilmentMode[];
  deliveryRadiusKm: number;
  businessName: string;
  description: string;
  businessPhone: string;
  businessEmail: string;
  securityReady: boolean;
  photoLabel: string;
  planId: ID;
  existingApplication?: Pick<OperatorApplicationResult, "operatorId" | "businessId" | "verificationRequestId">;
}

export interface OperatorApplicationResult {
  operatorId: ID;
  businessId: ID;
  verificationRequestId: ID;
  plan: Plan;
  paymentReference: string;
  status: VerificationStatus;
}

export const operatorOnboardingRepository = {
  async listPlans(): Promise<Plan[]> {
    await delay(350);
    return db.where("plans", (plan) => plan.active);
  },

  async submit(input: OperatorApplicationInput): Promise<OperatorApplicationResult> {
    await delay(900);
    const email = input.email.trim().toLowerCase();
    const existingOperator = input.existingApplication
      ? db.findById("operators", input.existingApplication.operatorId)
      : undefined;
    const duplicate = db.where(
      "users",
      (user) => user.email.toLowerCase() === email && user.id !== existingOperator?.userId,
    ).length > 0;
    if (duplicate) throw new Error("An account already uses this email address.");
    const plan = db.findById("plans", input.planId);
    if (!plan || !plan.active) throw new Error("Choose an active operator plan.");
    if (!input.securityReady) throw new Error("Complete the business security step.");
    if (input.fulfilmentModes.length === 0) throw new Error("Choose at least one fulfilment method.");

    const stamp = Date.now();
    const now = new Date().toISOString();
    const userId = `usr_op_${stamp}`;
    const operatorId = `op_${stamp}`;
    const addressId = `addr_biz_${stamp}`;
    const businessId = `biz_${stamp}`;
    const verificationRequestId = `vr_${stamp}`;
    const paymentReference = plan.monthlyFee === 0 ? `FREE-${stamp}` : `PLAN-${stamp}`;

    if (input.existingApplication && existingOperator) {
      const business = db.findById("businesses", input.existingApplication.businessId);
      const request = db.findById("verificationRequests", input.existingApplication.verificationRequestId);
      const user = db.findById("users", existingOperator.userId);
      if (!business || !request || !user) throw new Error("The existing application could not be updated.");
      db.update("users", user.id, {
        firstName: input.firstName.trim(), lastName: input.lastName.trim(), email,
        phone: input.phone.trim(), status: "PENDING",
      });
      db.update("operators", existingOperator.id, {
        legalName: input.legalName.trim(), tradingName: input.tradingName.trim(), status: "PENDING", planId: plan.id,
      });
      db.update("addresses", business.addressId, {
        line1: input.location.line1.trim(), line2: input.location.line2?.trim() || undefined,
        city: input.location.city.trim(), state: input.location.state.trim(),
      });
      db.update("businesses", business.id, {
        name: input.businessName.trim(), description: input.description.trim(), phone: input.businessPhone.trim(),
        email: input.businessEmail.trim().toLowerCase(), status: "PENDING_VERIFICATION", isOpen: false,
        fulfilmentModes: input.fulfilmentModes,
        deliveryRadiusKm: input.fulfilmentModes.includes("DELIVERY") ? input.deliveryRadiusKm : 0,
      });
      db.update("verificationRequests", request.id, {
        status: "PENDING", submittedAt: now, reviewedAt: undefined, reviewerId: undefined,
        notes: `Resubmitted documents: ${input.identityDocumentLabel}, ${input.complianceDocumentLabel}. Photo: ${input.photoLabel}. Registration: ${input.registrationNumber}.`,
      });
      return {
        operatorId: existingOperator.id, businessId: business.id, verificationRequestId: request.id,
        plan, paymentReference, status: "PENDING",
      };
    }

    db.insert("users", {
      id: userId, role: "OPERATOR", firstName: input.firstName.trim(), lastName: input.lastName.trim(),
      email, phone: input.phone.trim(), status: "PENDING", isEmailVerified: true,
      isPhoneVerified: true, createdAt: now,
    });
    db.insert("operators", {
      id: operatorId, userId, legalName: input.legalName.trim(), tradingName: input.tradingName.trim(),
      status: "PENDING", planId: plan.id, createdAt: now,
    });
    db.insert("addresses", {
      id: addressId, ownerId: businessId, label: "BUSINESS", line1: input.location.line1.trim(),
      line2: input.location.line2?.trim() || undefined, city: input.location.city.trim(),
      state: input.location.state.trim(), country: "NG", coordinates: { lat: 6.4439, lng: 3.47 },
      isDefault: true,
    });
    db.insert("businesses", {
      id: businessId, operatorId, name: input.businessName.trim(),
      slug: `${input.businessName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${String(stamp).slice(-4)}`,
      description: input.description.trim(), phone: input.businessPhone.trim(),
      email: input.businessEmail.trim().toLowerCase(), status: "PENDING_VERIFICATION", isOpen: false,
      rating: 0, reviewCount: 0, fulfilmentModes: input.fulfilmentModes,
      deliveryRadiusKm: input.fulfilmentModes.includes("DELIVERY") ? input.deliveryRadiusKm : 0,
      minimumOrder: 0, addressId, coordinates: { lat: 6.4439, lng: 3.47 },
      openingHours: { monday: null, tuesday: null, wednesday: null, thursday: null, friday: null, saturday: null, sunday: null },
      heroImageUrl: "", logoUrl: "", createdAt: now,
    });
    db.insert("verificationRequests", {
      id: verificationRequestId, operatorId, businessId, status: "PENDING", submittedAt: now,
      notes: `Documents received: ${input.identityDocumentLabel}, ${input.complianceDocumentLabel}. Photo: ${input.photoLabel}. Registration: ${input.registrationNumber}.`,
    });
    db.insert("notifications", {
      id: `not_operator_${stamp}`, userId, title: "Business application submitted",
      body: `${input.businessName.trim()} is awaiting verification review.`, channel: "IN_APP",
      type: "ACCOUNT", read: false, createdAt: now,
    });

    return { operatorId, businessId, verificationRequestId, plan, paymentReference, status: "PENDING" };
  },
};
