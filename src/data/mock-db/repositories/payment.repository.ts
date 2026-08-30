import { db, delay } from "@/data/mock-db/db";
import type { ID, Payment, PaymentMethod, Wallet } from "@/domain/types";

export const paymentRepository = {
  async listMethods(userId: ID): Promise<PaymentMethod[]> {
    await delay();
    return db.where("paymentMethods", (row) => row.userId === userId);
  },

  async listForUser(userId: ID): Promise<Payment[]> {
    await delay();
    return db.where("payments", (row) => row.userId === userId);
  },

  async findWallet(userId: ID): Promise<Wallet | undefined> {
    await delay();
    return db.where(
      "wallets",
      (wallet) => wallet.ownerType === "USER" && wallet.ownerId === userId,
    )[0];
  },

  async findByOrder(orderId: ID): Promise<Payment | undefined> {
    await delay();
    return db.where("payments", (row) => row.orderId === orderId)[0];
  },

  async addTokenizedCard(
    userId: ID,
    input: {
      brand: string;
      last4: string;
      expiryMonth: number;
      expiryYear: number;
    },
  ): Promise<PaymentMethod> {
    await delay(600);
    return db.insert("paymentMethods", {
      id: `pm_demo_${Date.now()}`,
      userId,
      type: "CARD",
      provider: "PAYSTACK",
      brand: input.brand,
      last4: input.last4,
      expiryMonth: input.expiryMonth,
      expiryYear: input.expiryYear,
      isDefault: false,
    });
  }
};
