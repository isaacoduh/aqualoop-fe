import { db, delay } from "@/data/mock-db/db";
import type { ID, Review } from "@/domain/types";

export const reviewRepository = {
  async listForBusiness(businessId: ID): Promise<Review[]> {
    await delay();
    return db.where("reviews", (row) => row.businessId === businessId);
  },

  async create(customerId: ID, input: { orderId: ID; rating: Review["rating"]; body: string }): Promise<Review> {
    await delay(500);
    const order = db.findById("orders", input.orderId);
    if (!order || order.customerId !== customerId || order.status !== "COMPLETED") {
      throw new Error("Only completed orders can be reviewed.");
    }
    if (db.where("reviews", (review) => review.orderId === order.id).length > 0) {
      throw new Error("This order has already been reviewed.");
    }
    const review = db.insert("reviews", {
      id: `rev_${Date.now()}`,
      orderId: order.id,
      customerId,
      businessId: order.businessId,
      rating: input.rating,
      body: input.body.trim(),
      createdAt: new Date().toISOString(),
    });
    const business = db.findById("businesses", order.businessId);
    if (business) {
      const reviewCount = business.reviewCount + 1;
      db.update("businesses", business.id, {
        reviewCount,
        rating: (business.rating * business.reviewCount + review.rating) / reviewCount,
      });
    }
    return review;
  },
};
