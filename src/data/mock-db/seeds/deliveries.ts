import type { Delivery } from "@/domain/types";

export const deliveries: Delivery[] = [
  { id:"del_001", orderId:"ord_10021", businessId:"biz_001", customerId:"usr_001", assignedToName:"Tobi James", assignedToPhone:"+2348033331001", status:"EN_ROUTE", pickupAt:"2026-08-29T09:05:00Z", etaMinutes:24, createdAt:"2026-08-29T08:55:00Z" },
  { id:"del_002", orderId:"ord_10019", businessId:"biz_001", customerId:"usr_003", status:"UNASSIGNED", createdAt:"2026-08-28T15:40:00Z" },
  { id:"del_003", orderId:"ord_10018", businessId:"biz_002", customerId:"usr_001", assignedToName:"Sola Martins", assignedToPhone:"+2348033331002", status:"COMPLETED", pickupAt:"2026-08-28T17:55:00Z", completedAt:"2026-08-28T18:35:00Z", createdAt:"2026-08-28T17:40:00Z" }
];
