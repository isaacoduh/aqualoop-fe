import { db, delay } from "@/data/mock-db/db";
import type { Delivery, DeliveryStatus, ID } from "@/domain/types";

export const deliveryRepository = {
  async listForBusiness(businessId: ID): Promise<Delivery[]> {
    await delay();
    return db.where("deliveries", (row) => row.businessId === businessId);
  },

  async findByOrder(orderId: ID): Promise<Delivery | undefined> {
    await delay();
    return db.where("deliveries", (row) => row.orderId === orderId)[0];
  },

  async updateStatus(id: ID, status: DeliveryStatus): Promise<Delivery> {
    await delay();
    const patch: Partial<Delivery> = { status };
    if (status === "COMPLETED") patch.completedAt = new Date().toISOString();
    return db.update("deliveries", id, patch);
  }
};
