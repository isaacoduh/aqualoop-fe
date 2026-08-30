import type { BlocklistEntry, CleanupRun, RolloverRequest } from "@/domain/types";

export const rolloverRequests: RolloverRequest[] = [
  { id:"rr_001", operatorId:"op_002", businessId:"biz_002", productId:"prod_20l_refill", quantity:12, reason:"Move excess empty containers into next settlement cycle.", status:"PENDING", requestedAt:"2026-08-29T10:10:00Z" },
  { id:"rr_002", operatorId:"op_003", businessId:"biz_003", productId:"prod_20l_exchange", quantity:8, reason:"Carry forward reusable bottle allocation.", status:"APPROVED", requestedAt:"2026-08-26T11:00:00Z", processedAt:"2026-08-27T09:15:00Z" },
];

export const blocklistEntries: BlocklistEntry[] = [
  { id:"blk_001", type:"EMAIL", value:"fraud@example.test", reason:"Repeated fraudulent payment attempts.", active:true, createdBy:"adm_001", createdAt:"2026-08-20T12:00:00Z" },
  { id:"blk_002", type:"PHONE", value:"+2348000000999", reason:"Abusive account activity.", active:true, createdBy:"adm_002", createdAt:"2026-08-22T09:30:00Z" },
];

export const cleanupRuns: CleanupRun[] = [
  { id:"cln_001", scope:"EXPIRED_CODES", affectedRows:3, adminId:"adm_001", runAt:"2026-08-28T06:00:00Z" },
];
