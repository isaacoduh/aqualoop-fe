import { db, delay } from "@/data/mock-db/db";
import type { ID, Notification } from "@/domain/types";

export const notificationRepository = {
  async listForUser(userId: ID): Promise<Notification[]> {
    await delay();
    return db.where("notifications", (row) => row.userId === userId);
  },

  async markRead(id: ID): Promise<Notification> {
    await delay();
    return db.update("notifications", id, { read: true });
  }
};
