import { db, delay } from "@/data/mock-db/db";
import type { ID, Review } from "@/domain/types";

export const reviewRepository = {
  async listForBusiness(businessId: ID): Promise<Review[]> {
    await delay();
    return db.where("reviews", (row) => row.businessId === businessId);
  }
};
