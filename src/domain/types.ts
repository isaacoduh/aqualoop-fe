export type ID = string;
export type Currency = "GBP";

/**
 * Monetary values are stored as integer minor units.
 *
 * For GBP, 1600 represents £16.00.
 */
export type MoneyInMinorUnits = number;

export type UserRole = "CUSTOMER" | "OPERATOR" | "ADMIN" | "SUPER_ADMIN";
export type AccountStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "BLOCKED" | "DELETED";
export type BusinessStatus = "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "CLOSED";
export type FulfilmentMode = "DELIVERY" | "PICKUP";
export type OrderStatus =
  | "DRAFT"
  | "PAYMENT_PENDING"
  | "CONFIRMED"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type PaymentMethodType = "CARD" | "WALLET";
export type DeliveryStatus =
  | "UNASSIGNED"
  | "ASSIGNED"
  | "PICKED_UP"
  | "EN_ROUTE"
  | "ARRIVED"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";
export type ConfirmationCodeStatus = "ISSUED" | "ACTIVE" | "REDEEMED" | "EXPIRED" | "REVOKED";
export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type WithdrawalStatus = "PENDING" | "APPROVED" | "REJECTED" | "PAID";
export type NotificationChannel = "IN_APP" | "EMAIL" | "SMS" | "PUSH";

export interface Coordinates { lat: number; lng: number; }

export interface Address {
  id: ID;
  ownerId: ID;
  label: "HOME" | "WORK" | "BUSINESS" | "OTHER";
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: "NG";
  postalCode?: string;
  coordinates: Coordinates;
  isDefault: boolean;
}

export interface User {
  id: ID;
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  status: AccountStatus;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Operator {
  id: ID;
  userId: ID;
  legalName: string;
  tradingName: string;
  status: VerificationStatus;
  planId: ID;
  bankAccountId?: ID;
  createdAt: string;
}

export interface Business {
  id: ID;
  operatorId: ID;
  name: string;
  slug: string;
  description: string;
  phone: string;
  email: string;
  status: BusinessStatus;
  isOpen: boolean;
  rating: number;
  reviewCount: number;
  fulfilmentModes: FulfilmentMode[];
  deliveryRadiusKm: number;
  minimumOrder: MoneyInMinorUnits;
  addressId: ID;
  coordinates: Coordinates;
  openingHours: Record<string, [string, string] | null>;
  heroImageUrl: string;
  logoUrl: string;
  createdAt: string;
}

export interface Product {
  id: ID;
  name: string;
  slug: string;
  sizeLitres: number;
  type: "REFILL" | "BOTTLE_EXCHANGE";
  description: string;
  imageUrl: string;
  active: boolean;
}

export interface BusinessProduct {
  id: ID;
  businessId: ID;
  productId: ID;
  price: MoneyInMinorUnits;
  depositAmount: MoneyInMinorUnits;
  active: boolean;
}

export interface Inventory {
  id: ID;
  businessId: ID;
  productId: ID;
  filledQty: number;
  emptyQty: number;
  reservedQty: number;
  damagedQty: number;
  reorderLevel: number;
  updatedAt: string;
}

export interface InventoryMovement {
  id: ID;
  inventoryId: ID;
  type: "RECEIPT" | "SALE" | "RETURN" | "RESERVATION" | "RELEASE" | "ADJUSTMENT" | "DAMAGE";
  quantity: number;
  reason: string;
  actorId: ID;
  correlationId?: ID;
  createdAt: string;
}

export interface Order {
  id: ID;
  orderNumber: string;
  customerId: ID;
  businessId: ID;
  deliveryAddressId?: ID;
  fulfilmentMode: FulfilmentMode;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  currency: Currency;
  subtotal: MoneyInMinorUnits;
  deliveryFee: MoneyInMinorUnits;
  depositAmount: MoneyInMinorUnits;
  discount: MoneyInMinorUnits;
  total: MoneyInMinorUnits;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: ID;
  orderId: ID;
  productId: ID;
  quantity: number;
  unitPrice: MoneyInMinorUnits;
  depositAmount: MoneyInMinorUnits;
  lineTotal: MoneyInMinorUnits;
  expectedEmptyReturns: number;
}

export interface PaymentMethod {
  id: ID;
  userId: ID;
  type: PaymentMethodType;
  provider: "PAYSTACK" | "MOCK_WALLET";
  brand?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Payment {
  id: ID;
  orderId: ID;
  userId: ID;
  paymentMethodId: ID;
  providerReference: string;
  amount: MoneyInMinorUnits;
  currency: Currency;
  status: PaymentStatus;
  createdAt: string;
  paidAt?: string;
}

export interface Wallet {
  id: ID;
  ownerType: "USER" | "OPERATOR";
  ownerId: ID;
  currency: Currency;
  cachedBalance: MoneyInMinorUnits;
  updatedAt: string;
}

export interface LedgerEntry {
  id: ID;
  walletId: ID;
  direction: "CREDIT" | "DEBIT";
  type: "ORDER_PAYMENT" | "ORDER_EARNING" | "REFUND" | "WITHDRAWAL" | "ADJUSTMENT";
  amount: MoneyInMinorUnits;
  referenceType: "ORDER" | "PAYMENT" | "WITHDRAWAL" | "SYSTEM";
  referenceId: ID;
  description: string;
  createdAt: string;
}

export interface ConfirmationCode {
  id: ID;
  orderId: ID;
  businessId: ID;
  customerId: ID;
  displayCode: string;
  status: ConfirmationCodeStatus;
  expiresAt: string;
  redeemedAt?: string;
  createdAt: string;
}

export interface Delivery {
  id: ID;
  orderId: ID;
  businessId: ID;
  customerId: ID;
  assignedToName?: string;
  assignedToPhone?: string;
  status: DeliveryStatus;
  pickupAt?: string;
  completedAt?: string;
  etaMinutes?: number;
  createdAt: string;
}

export interface Review {
  id: ID;
  orderId: ID;
  customerId: ID;
  businessId: ID;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  createdAt: string;
}

export interface Withdrawal {
  id: ID;
  operatorId: ID;
  businessId: ID;
  walletId: ID;
  amount: MoneyInMinorUnits;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string;
}

export interface Plan {
  id: ID;
  name: "STARTER" | "GROWTH" | "PRO";
  monthlyFee: MoneyInMinorUnits;
  settlementFeePercent: number;
  maxBusinesses: number;
  analyticsRetentionDays: number;
  active: boolean;
}

export interface VerificationRequest {
  id: ID;
  operatorId: ID;
  businessId: ID;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewerId?: ID;
  notes?: string;
}

export interface Notification {
  id: ID;
  userId: ID;
  title: string;
  body: string;
  channel: NotificationChannel;
  type: "ORDER" | "PAYMENT" | "DELIVERY" | "ACCOUNT" | "PROMOTION" | "SYSTEM";
  read: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: ID;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
  status: AccountStatus;
  lastLoginAt: string;
}

export interface PlatformSettings {
  registrationEnabled: boolean;
  cardPaymentsEnabled: boolean;
  walletPaymentsEnabled: boolean;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  reviewsEnabled: boolean;
  withdrawalsEnabled: boolean;
  confirmationCodeLifetimeMinutes: number;
  maxFailedLoginAttempts: number;
  accountLockoutMinutes: number;
  minimumWithdrawalByPlan: Record<Plan["name"], MoneyInMinorUnits>;
}

export interface SupportArticle {
  id: ID;
  category: "GETTING_STARTED" | "PAYMENTS" | "DELIVERY" | "ACCOUNT";
  title: string;
  summary: string;
  body: string;
}

export interface AdminPermission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export type AdminPermissionMap = Record<
  AdminUser["role"],
  AdminPermission
>;
