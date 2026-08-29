import { db, delay } from "@/data/mock-db/db";
import type { ID, Inventory } from "@/domain/types";

export const inventoryRepository = {
  async listForBusiness(businessId: ID): Promise<Inventory[]> {
    await delay();
    return db.where("inventories", (row) => row.businessId === businessId);
  },

  async reserve(businessId: ID, productId: ID, quantity: number): Promise<Inventory> {
    await delay();

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Reservation quantity must be a positive integer");
    }

    const inventory = db.where(
      "inventories",
      (row) => row.businessId === businessId && row.productId === productId,
    )[0];

    if (!inventory) throw new Error("Inventory not found");

    const available = inventory.filledQty - inventory.reservedQty;

    if (available < quantity) throw new Error("Insufficient inventory");

    return db.update("inventories", inventory.id, {
      reservedQty: inventory.reservedQty + quantity,
      updatedAt: new Date().toISOString(),
    });
  }
};
