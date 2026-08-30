import type { BankAccount } from "@/domain/types";

export const bankAccounts: BankAccount[] = [
  { id:"bank_001", operatorId:"op_001", bankName:"Aqua Demo Bank", accountName:"BlueSpring Water Services Ltd", accountNumberLast4:"4821", verified:true, updatedAt:"2026-08-20T10:00:00Z" },
  { id:"bank_002", operatorId:"op_002", bankName:"Aqua Demo Bank", accountName:"PureDrop Water House Ltd", accountNumberLast4:"1730", verified:true, updatedAt:"2026-08-18T10:00:00Z" },
  { id:"bank_003", operatorId:"op_003", bankName:"Loop Commercial Bank", accountName:"Oasis Bottle Exchange Ltd", accountNumberLast4:"9504", verified:true, updatedAt:"2026-08-19T10:00:00Z" },
];
