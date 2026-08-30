import { db, delay } from "@/data/mock-db/db";
import type { ID, Notification } from "@/domain/types";

export const notificationRepository = {
  async listForUser(userId: ID): Promise<Notification[]> {
    await delay();
    return db.where("notifications", (row) => row.userId === userId);
  },

  async markRead(userId: ID, id: ID): Promise<Notification> {
    await delay();
    const notification = db.findById("notifications", id);
    if (!notification || notification.userId !== userId) {
      throw new Error("Notification not found.");
    }
    return db.update("notifications", id, { read: true });
  },

  async markAllRead(userId: ID): Promise<Notification[]> {
    await delay(400);
    return db.where("notifications", (row) => row.userId === userId).map((notification) =>
      notification.read ? notification : db.update("notifications", notification.id, { read: true }),
    );
  },
};
