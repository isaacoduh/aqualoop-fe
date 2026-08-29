import type { Order, OrderItem } from "@/domain/types";

export const orders: Order[] = [
  {
    id:"ord_10021", orderNumber:"AQ-10021", customerId:"usr_001", businessId:"biz_001",
    deliveryAddressId:"addr_usr_001_home", fulfilmentMode:"DELIVERY", status:"OUT_FOR_DELIVERY",
    paymentStatus:"PAID", currency:"GBP", subtotal:7600, deliveryFee:1200, depositAmount:2000,
    discount:0, total:10800, notes:"Call when you reach the gate.",
    createdAt:"2026-08-29T07:14:00Z", updatedAt:"2026-08-29T09:20:00Z"
  },
  {
    id:"ord_10020", orderNumber:"AQ-10020", customerId:"usr_002", businessId:"biz_003",
    fulfilmentMode:"PICKUP", status:"READY", paymentStatus:"PAID", currency:"GBP",
    subtotal:8200, deliveryFee:0, depositAmount:3600, discount:0, total:11800,
    createdAt:"2026-08-29T06:10:00Z", updatedAt:"2026-08-29T08:45:00Z"
  },
  {
    id:"ord_10019", orderNumber:"AQ-10019", customerId:"usr_003", businessId:"biz_001",
    deliveryAddressId:"addr_usr_001_work", fulfilmentMode:"DELIVERY", status:"PREPARING",
    paymentStatus:"PAID", currency:"GBP", subtotal:4800, deliveryFee:1000, depositAmount:0,
    discount:300, total:5500, createdAt:"2026-08-28T15:20:00Z", updatedAt:"2026-08-28T15:45:00Z"
  },
  {
    id:"ord_10018", orderNumber:"AQ-10018", customerId:"usr_001", businessId:"biz_002",
    deliveryAddressId:"addr_usr_001_home", fulfilmentMode:"DELIVERY", status:"COMPLETED",
    paymentStatus:"PAID", currency:"GBP", subtotal:5000, deliveryFee:900, depositAmount:0,
    discount:0, total:5900, createdAt:"2026-08-28T16:02:00Z", updatedAt:"2026-08-28T18:35:00Z"
  },
  {
    id:"ord_10017", orderNumber:"AQ-10017", customerId:"usr_002", businessId:"biz_001",
    fulfilmentMode:"PICKUP", status:"CANCELLED", paymentStatus:"REFUNDED", currency:"GBP",
    subtotal:3200, deliveryFee:0, depositAmount:0, discount:0, total:3200,
    createdAt:"2026-08-27T12:05:00Z", updatedAt:"2026-08-27T12:22:00Z"
  }
];

export const orderItems: OrderItem[] = [
  { id:"oi_001", orderId:"ord_10021", productId:"prod_20l_refill", quantity:2, unitPrice:2400, depositAmount:0, lineTotal:4800, expectedEmptyReturns:2 },
  { id:"oi_002", orderId:"ord_10021", productId:"prod_10l_exchange", quantity:1, unitPrice:2800, depositAmount:2000, lineTotal:2800, expectedEmptyReturns:1 },
  { id:"oi_003", orderId:"ord_10020", productId:"prod_20l_exchange", quantity:2, unitPrice:4100, depositAmount:3600, lineTotal:8200, expectedEmptyReturns:2 },
  { id:"oi_004", orderId:"ord_10019", productId:"prod_20l_refill", quantity:2, unitPrice:2400, depositAmount:0, lineTotal:4800, expectedEmptyReturns:2 },
  { id:"oi_005", orderId:"ord_10018", productId:"prod_20l_refill", quantity:2, unitPrice:2500, depositAmount:0, lineTotal:5000, expectedEmptyReturns:2 },
  { id:"oi_006", orderId:"ord_10017", productId:"prod_10l_refill", quantity:2, unitPrice:1600, depositAmount:0, lineTotal:3200, expectedEmptyReturns:2 }
];
