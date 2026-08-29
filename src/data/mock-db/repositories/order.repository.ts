import { db, delay } from "@/data/mock-db/db";
import type { ID, Order, OrderItem, OrderStatus } from "@/domain/types";

export const orderRepository = {
  async listForCustomer(customerId: ID): Promise<Order[]> {
    await delay();
    return db.where("orders", (order) => order.customerId === customerId);
  },

  async listForBusiness(businessId: ID): Promise<Order[]> {
    await delay();
    return db.where("orders", (order) => order.businessId === businessId);
  },

  async findById(id: ID): Promise<Order | undefined> {
    await delay();
    return db.findById("orders", id);
  },

  async items(orderId: ID): Promise<OrderItem[]> {
    await delay();
    return db.where("orderItems", (item) => item.orderId === orderId);
  },

  async updateStatus(id: ID, status: OrderStatus): Promise<Order> {
    await delay();
    return db.update("orders", id, { status, updatedAt: new Date().toISOString() });
  }
};
