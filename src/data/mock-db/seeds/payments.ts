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
  { id:"pay_004", orderId:"ord_10017", userId:"usr_002", paymentMethodId:"pm_003", providerReference:"PSK_AQ_10017", amount:3200, currency:"GBP", status:"REFUNDED", createdAt:"2026-08-27T12:06:00Z", paidAt:"2026-08-27T12:06:04Z" }
];
