import type { Payment, PaymentMethod } from "@/domain/types";

export const paymentMethods: PaymentMethod[] = [
  { id:"pm_001", userId:"usr_001", type:"CARD", provider:"PAYSTACK", brand:"Visa", last4:"4242", expiryMonth:9, expiryYear:2028, isDefault:true },
  { id:"pm_002", userId:"usr_001", type:"WALLET", provider:"MOCK_WALLET", isDefault:false },
  { id:"pm_003", userId:"usr_002", type:"CARD", provider:"PAYSTACK", brand:"Mastercard", last4:"5100", expiryMonth:5, expiryYear:2029, isDefault:true }
];

export const payments: Payment[] = [
  { id:"pay_001", orderId:"ord_10021", userId:"usr_001", paymentMethodId:"pm_001", providerReference:"PSK_AQ_10021", amount:10800, currency:"GBP", status:"PAID", createdAt:"2026-08-29T07:15:00Z", paidAt:"2026-08-29T07:15:08Z" },
  { id:"pay_002", orderId:"ord_10020", userId:"usr_002", paymentMethodId:"pm_003", providerReference:"PSK_AQ_10020", amount:11800, currency:"GBP", status:"PAID", createdAt:"2026-08-29T06:11:00Z", paidAt:"2026-08-29T06:11:05Z" },
  { id:"pay_003", orderId:"ord_10018", userId:"usr_001", paymentMethodId:"pm_001", providerReference:"PSK_AQ_10018", amount:5900, currency:"GBP", status:"PAID", createdAt:"2026-08-28T16:03:00Z", paidAt:"2026-08-28T16:03:07Z" },
  { id:"pay_004", orderId:"ord_10017", userId:"usr_002", paymentMethodId:"pm_003", providerReference:"PSK_AQ_10017", amount:3200, currency:"GBP", status:"REFUNDED", createdAt:"2026-08-27T12:06:00Z", paidAt:"2026-08-27T12:06:04Z" },
  { id:"pay_005", orderId:"ord_10016", userId:"usr_001", paymentMethodId:"pm_001", providerReference:"PSK_AQ_10016", amount:2400, currency:"GBP", status:"PAID", createdAt:"2026-08-26T14:11:00Z", paidAt:"2026-08-26T14:11:05Z" },
  { id:"pay_006", orderId:"ord_10015", userId:"usr_001", paymentMethodId:"pm_001", providerReference:"PSK_AQ_10015", amount:2100, currency:"GBP", status:"PAID", createdAt:"2026-08-26T11:31:00Z", paidAt:"2026-08-26T11:31:04Z" },
  { id:"pay_007", orderId:"ord_10014", userId:"usr_001", paymentMethodId:"pm_001", providerReference:"PSK_AQ_10014", amount:2600, currency:"GBP", status:"FAILED", createdAt:"2026-08-25T17:21:00Z" },
  { id:"pay_008", orderId:"ord_10013", userId:"usr_001", paymentMethodId:"pm_001", providerReference:"PSK_AQ_10013", amount:1600, currency:"GBP", status:"PENDING", createdAt:"2026-08-25T09:05:00Z" }
];
