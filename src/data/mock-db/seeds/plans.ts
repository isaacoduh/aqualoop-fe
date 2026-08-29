import type { Plan } from "@/domain/types";

export const plans: Plan[] = [
  { id:"plan_starter", name:"STARTER", monthlyFee:0, settlementFeePercent:4.0, maxBusinesses:1, analyticsRetentionDays:30, active:true },
  { id:"plan_growth", name:"GROWTH", monthlyFee:25000, settlementFeePercent:2.5, maxBusinesses:3, analyticsRetentionDays:180, active:true },
  { id:"plan_pro", name:"PRO", monthlyFee:60000, settlementFeePercent:1.5, maxBusinesses:10, analyticsRetentionDays:365, active:true }
];
