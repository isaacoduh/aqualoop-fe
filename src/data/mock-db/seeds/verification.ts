import type { VerificationRequest } from "@/domain/types";

export const verificationRequests: VerificationRequest[] = [
  { id:"vr_001", operatorId:"op_004", businessId:"biz_004", status:"PENDING", submittedAt:"2026-08-21T09:10:00Z", notes:"Awaiting review of water-quality certificate and premises document." },
  { id:"vr_002", operatorId:"op_003", businessId:"biz_003", status:"APPROVED", submittedAt:"2026-04-01T10:00:00Z", reviewedAt:"2026-04-02T08:40:00Z", reviewerId:"adm_002" }
];
