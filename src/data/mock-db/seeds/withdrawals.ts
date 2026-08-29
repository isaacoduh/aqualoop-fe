import type { Withdrawal } from "@/domain/types";

export const withdrawals: Withdrawal[] = [
  { id:"wd_001", operatorId:"op_001", businessId:"biz_001", walletId:"wal_op_001", amount:120000, status:"PENDING", requestedAt:"2026-08-29T08:20:00Z" },
  { id:"wd_002", operatorId:"op_002", businessId:"biz_002", walletId:"wal_op_002", amount:90000, status:"PAID", requestedAt:"2026-08-26T10:20:00Z", processedAt:"2026-08-27T13:10:00Z" }
];
