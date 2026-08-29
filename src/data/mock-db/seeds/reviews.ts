import type { Review } from "@/domain/types";

export const reviews: Review[] = [
  { id:"rev_001", orderId:"ord_10018", customerId:"usr_001", businessId:"biz_002", rating:5, body:"Delivery was quick and the bottles were clean.", createdAt:"2026-08-28T19:10:00Z" },
  { id:"rev_002", orderId:"ord_09988", customerId:"usr_002", businessId:"biz_001", rating:4, body:"Good service. Pickup queue was a little slow.", createdAt:"2026-08-25T13:20:00Z" },
  { id:"rev_003", orderId:"ord_09970", customerId:"usr_003", businessId:"biz_003", rating:5, body:"Very smooth exchange process.", createdAt:"2026-08-23T17:00:00Z" }
];
