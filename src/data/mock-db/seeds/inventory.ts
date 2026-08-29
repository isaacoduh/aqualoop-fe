import type { Inventory, InventoryMovement } from "@/domain/types";

export const inventories: Inventory[] = [
  { id:"inv_001", businessId:"biz_001", productId:"prod_10l_refill", filledQty:84, emptyQty:41, reservedQty:6, damagedQty:2, reorderLevel:25, updatedAt:"2026-08-29T08:00:00Z" },
  { id:"inv_002", businessId:"biz_001", productId:"prod_15l_refill", filledQty:62, emptyQty:28, reservedQty:3, damagedQty:1, reorderLevel:20, updatedAt:"2026-08-29T08:00:00Z" },
  { id:"inv_003", businessId:"biz_001", productId:"prod_20l_refill", filledQty:47, emptyQty:33, reservedQty:5, damagedQty:1, reorderLevel:18, updatedAt:"2026-08-29T08:00:00Z" },
  { id:"inv_004", businessId:"biz_002", productId:"prod_10l_refill", filledQty:39, emptyQty:17, reservedQty:2, damagedQty:0, reorderLevel:15, updatedAt:"2026-08-29T08:00:00Z" },
  { id:"inv_005", businessId:"biz_002", productId:"prod_20l_refill", filledQty:21, emptyQty:15, reservedQty:4, damagedQty:2, reorderLevel:20, updatedAt:"2026-08-29T08:00:00Z" },
  { id:"inv_006", businessId:"biz_003", productId:"prod_20l_exchange", filledQty:13, emptyQty:29, reservedQty:0, damagedQty:1, reorderLevel:12, updatedAt:"2026-08-29T08:00:00Z" }
];

export const inventoryMovements: InventoryMovement[] = [
  { id:"im_001", inventoryId:"inv_003", type:"RECEIPT", quantity:30, reason:"Morning replenishment", actorId:"usr_101", createdAt:"2026-08-29T06:40:00Z" },
  { id:"im_002", inventoryId:"inv_003", type:"RESERVATION", quantity:-2, reason:"Reserved for ORD-AQ-10021", actorId:"usr_001", correlationId:"ord_10021", createdAt:"2026-08-29T07:15:00Z" },
  { id:"im_003", inventoryId:"inv_005", type:"SALE", quantity:-2, reason:"Completed order ORD-AQ-10018", actorId:"usr_102", correlationId:"ord_10018", createdAt:"2026-08-28T18:35:00Z" }
];
