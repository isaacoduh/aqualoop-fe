import type { Operator } from "@/domain/types";

export const operators: Operator[] = [
  { id:"op_001", userId:"usr_101", legalName:"BlueSpring Water Services Ltd", tradingName:"BlueSpring", status:"APPROVED", planId:"plan_pro", bankAccountId:"bank_001", createdAt:"2026-03-10T09:00:00Z" },
  { id:"op_002", userId:"usr_102", legalName:"PureDrop Water House Ltd", tradingName:"PureDrop", status:"APPROVED", planId:"plan_growth", bankAccountId:"bank_002", createdAt:"2026-03-12T09:00:00Z" },
  { id:"op_003", userId:"usr_103", legalName:"Oasis Bottle Exchange Ltd", tradingName:"Oasis", status:"APPROVED", planId:"plan_growth", bankAccountId:"bank_003", createdAt:"2026-04-01T09:00:00Z" },
  { id:"op_004", userId:"usr_104", legalName:"ClearFlow Water Market Ltd", tradingName:"ClearFlow", status:"PENDING", planId:"plan_starter", createdAt:"2026-08-20T09:00:00Z" }
];
