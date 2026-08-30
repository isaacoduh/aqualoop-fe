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
  },

  async setDefaultMethod(userId: ID, methodId: ID): Promise<PaymentMethod> {
    await delay(400);
    const method = db.findById("paymentMethods", methodId);
    if (!method || method.userId !== userId || method.type !== "CARD") {
      throw new Error("Choose a valid card.");
    }
    db.where("paymentMethods", (candidate) => candidate.userId === userId)
      .forEach((candidate) => {
        if (candidate.type === "CARD") {
          db.update("paymentMethods", candidate.id, { isDefault: candidate.id === methodId });
        }
      });
    return db.findById("paymentMethods", methodId)!;
  },

  async removeCard(userId: ID, methodId: ID): Promise<void> {
    await delay(400);
    const method = db.findById("paymentMethods", methodId);
    if (!method || method.userId !== userId || method.type !== "CARD") {
      throw new Error("Choose a valid card.");
    }
    const cardCount = db.where("paymentMethods", (candidate) => candidate.userId === userId && candidate.type === "CARD").length;
    if (cardCount <= 1) throw new Error("Keep at least one saved card.");
    if (method.isDefault) {
      const replacement = db.where(
        "paymentMethods",
        (candidate) => candidate.userId === userId && candidate.type === "CARD" && candidate.id !== methodId,
      )[0];
      if (replacement) db.update("paymentMethods", replacement.id, { isDefault: true });
    }
    db.remove("paymentMethods", methodId);
  },
};
