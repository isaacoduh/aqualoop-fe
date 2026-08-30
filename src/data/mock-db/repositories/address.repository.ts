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

  async createForOwner(
    ownerId: ID,
    input: Pick<Address, "label" | "line1" | "line2" | "city" | "state">,
  ): Promise<Address> {
    await delay(500);
    return db.insert("addresses", {
      id: `addr_${ownerId}_${Date.now()}`,
      ownerId,
      label: input.label,
      line1: input.line1.trim(),
      line2: input.line2?.trim() || undefined,
      city: input.city.trim(),
      state: input.state.trim(),
      country: "NG",
      coordinates: { lat: 6.4439, lng: 3.47 },
      isDefault: false,
    });
  },
};
