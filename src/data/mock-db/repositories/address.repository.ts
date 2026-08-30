import { db, delay } from "@/data/mock-db/db";
import type { Address, ID } from "@/domain/types";

export const addressRepository = {
  async listForOwner(ownerId: ID): Promise<Address[]> {
    await delay(350);
    return db.where("addresses", (address) => address.ownerId === ownerId);
  },

  async findDefaultForOwner(ownerId: ID): Promise<Address | undefined> {
    await delay(250);
    return db
      .where("addresses", (address) => address.ownerId === ownerId)
      .find((address) => address.isDefault);
  },
};
