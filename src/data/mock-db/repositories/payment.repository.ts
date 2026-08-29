import { db, delay } from "@/data/mock-db/db";
import type { ID, Payment, PaymentMethod } from "@/domain/types";

export const paymentRepository = {
  async listMethods(userId: ID): Promise<PaymentMethod[]> {
    await delay();
    return db.where("paymentMethods", (row) => row.userId === userId);
  },

  async listForUser(userId: ID): Promise<Payment[]> {
    await delay();
    return db.where("payments", (row) => row.userId === userId);
  },

  async findByOrder(orderId: ID): Promise<Payment | undefined> {
    await delay();
    return db.where("payments", (row) => row.orderId === orderId)[0];
  }
};
