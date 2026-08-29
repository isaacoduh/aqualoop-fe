import type { Notification } from "@/domain/types";

export const notifications: Notification[] = [
  { id:"not_001", userId:"usr_001", title:"Your delivery is on the way", body:"Order AQ-10021 has left BlueSpring Refill Hub. ETA: 24 minutes.", channel:"IN_APP", type:"DELIVERY", read:false, createdAt:"2026-08-29T09:06:00Z" },
  { id:"not_002", userId:"usr_001", title:"Confirmation code activated", body:"Use code 481263 when receiving order AQ-10021.", channel:"IN_APP", type:"ORDER", read:false, createdAt:"2026-08-29T09:00:00Z" },
  { id:"not_003", userId:"usr_002", title:"Order ready for pickup", body:"AQ-10020 is ready at Oasis Bottle Exchange.", channel:"IN_APP", type:"ORDER", read:true, createdAt:"2026-08-29T08:45:00Z" },
  { id:"not_004", userId:"usr_101", title:"Low stock warning", body:"20L refill stock is approaching the reorder level.", channel:"IN_APP", type:"SYSTEM", read:false, createdAt:"2026-08-29T08:10:00Z" }
];
