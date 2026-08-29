import type { Wallet, LedgerEntry } from "@/domain/types";

export const wallets: Wallet[] = [
  { id:"wal_usr_001", ownerType:"USER", ownerId:"usr_001", currency:"GBP", cachedBalance:18500, updatedAt:"2026-08-29T09:30:00Z" },
  { id:"wal_usr_002", ownerType:"USER", ownerId:"usr_002", currency:"GBP", cachedBalance:6200, updatedAt:"2026-08-29T09:30:00Z" },
  { id:"wal_op_001", ownerType:"OPERATOR", ownerId:"op_001", currency:"GBP", cachedBalance:528000, updatedAt:"2026-08-29T09:30:00Z" },
  { id:"wal_op_002", ownerType:"OPERATOR", ownerId:"op_002", currency:"GBP", cachedBalance:311400, updatedAt:"2026-08-29T09:30:00Z" }
];

export const ledgerEntries: LedgerEntry[] = [
  { id:"le_001", walletId:"wal_op_001", direction:"CREDIT", type:"ORDER_EARNING", amount:9720, referenceType:"ORDER", referenceId:"ord_10021", description:"Pending earnings for AQ-10021", createdAt:"2026-08-29T07:16:00Z" },
  { id:"le_002", walletId:"wal_op_002", direction:"CREDIT", type:"ORDER_EARNING", amount:5310, referenceType:"ORDER", referenceId:"ord_10018", description:"Completed earnings for AQ-10018", createdAt:"2026-08-28T18:36:00Z" },
  { id:"le_003", walletId:"wal_usr_002", direction:"CREDIT", type:"REFUND", amount:3200, referenceType:"ORDER", referenceId:"ord_10017", description:"Refund for cancelled AQ-10017", createdAt:"2026-08-27T12:30:00Z" }
];
