import { db, delay } from "@/data/mock-db/db";
import type { Business, ID } from "@/domain/types";

export const businessRepository = {
  async listActive(): Promise<Business[]> {
    await delay();
    return db.where("businesses", (business) => business.status === "ACTIVE");
  },

  async listNearby(): Promise<Business[]> {
    await delay();
    return db.where("businesses", (business) => business.status === "ACTIVE" && business.isOpen);
  },

  async findById(id: ID): Promise<Business | undefined> {
    await delay();
    return db.findById("businesses", id);
  },

  async setOpenState(id: ID, isOpen: boolean): Promise<Business> {
    await delay();
    return db.update("businesses", id, { isOpen });
  }
};
