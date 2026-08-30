import type { ConfirmationCode } from "@/domain/types";

export const confirmationCodes: ConfirmationCode[] = [
  { id:"ccc_001", orderId:"ord_10021", businessId:"biz_001", customerId:"usr_001", displayCode:"481263", status:"ACTIVE", expiresAt:"2026-08-31T09:00:00Z", createdAt:"2026-08-29T09:00:00Z" },
  { id:"ccc_002", orderId:"ord_10020", businessId:"biz_003", customerId:"usr_002", displayCode:"739154", status:"ACTIVE", expiresAt:"2026-08-30T08:45:00Z", createdAt:"2026-08-29T08:45:00Z" },
  { id:"ccc_003", orderId:"ord_10018", businessId:"biz_002", customerId:"usr_001", displayCode:"115802", status:"REDEEMED", expiresAt:"2026-08-29T18:30:00Z", redeemedAt:"2026-08-28T18:35:00Z", createdAt:"2026-08-28T17:10:00Z" },
  { id:"ccc_004", orderId:"ord_10015", businessId:"biz_001", customerId:"usr_001", displayCode:"264810", status:"ISSUED", expiresAt:"2026-08-30T14:00:00Z", createdAt:"2026-08-26T11:32:00Z" },
  { id:"ccc_005", orderId:"ord_10016", businessId:"biz_001", customerId:"usr_001", displayCode:"907421", status:"EXPIRED", expiresAt:"2026-08-27T14:00:00Z", createdAt:"2026-08-26T14:24:00Z" },
  { id:"ccc_006", orderId:"ord_10014", businessId:"biz_002", customerId:"usr_001", displayCode:"552193", status:"REVOKED", expiresAt:"2026-08-26T17:20:00Z", createdAt:"2026-08-25T17:22:00Z" }
];
