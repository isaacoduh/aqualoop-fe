import type { AdminUser, PlatformSettings } from "@/domain/types";

export const admins: AdminUser[] = [
  { id:"adm_001", name:"Maya Okonkwo", email:"maya.admin@aqualoop.example.test", role:"SUPER_ADMIN", status:"ACTIVE", lastLoginAt:"2026-08-29T08:00:00Z" },
  { id:"adm_002", name:"Femi Lawal", email:"femi.ops@aqualoop.example.test", role:"ADMIN", status:"ACTIVE", lastLoginAt:"2026-08-29T07:45:00Z" },
  { id:"adm_003", name:"Zainab Yusuf", email:"zainab.editor@aqualoop.example.test", role:"EDITOR", status:"ACTIVE", lastLoginAt:"2026-08-28T16:00:00Z" }
];

export const platformSettings: PlatformSettings = {
  platformName:"AquaLoop",
  supportEmail:"support@aqualoop.example.test",
  maintenanceMode:false,
  registrationEnabled:true,
  operatorRegistrationEnabled:true,
  maxCustomerAddresses:10,
  maxOrderQuantity:20,
  cancellationWindowMinutes:15,
  cardPaymentsEnabled:true,
  walletPaymentsEnabled:true,
  deliveryEnabled:true,
  pickupEnabled:true,
  reviewsEnabled:true,
  withdrawalsEnabled:true,
  rolloverEnabled:true,
  maxRolloverQuantity:50,
  rolloverWindowDays:30,
  notificationChannels:{IN_APP:true,EMAIL:true,SMS:true,PUSH:true},
  confirmationCodeLifetimeMinutes:1440,
  maxFailedLoginAttempts:5,
  accountLockoutMinutes:30,
  adminMfaRequired:true,
  minimumPasswordLength:10,
  defaultPlanId:"plan_starter",
  planChangesEnabled:true,
  businessApprovalRequired:true,
  maxDeliveryRadiusKm:50,
  operatorApprovalRequired:true,
  bankVerificationRequired:true,
  withdrawalProcessingDays:3,
  minimumWithdrawalByPlan:{ STARTER:20000, GROWTH:10000, PRO:5000 }
};

export const adminPermissions = {
  SUPER_ADMIN: { create:true, read:true, update:true, delete:true },
  ADMIN: { create:true, read:true, update:true, delete:false },
  EDITOR: { create:false, read:true, update:true, delete:false }
} as const;
