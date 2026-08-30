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

  async findForOwner(ownerId: ID, addressId: ID): Promise<Address | null> {
    await delay(250);
    const address = db.findById("addresses", addressId);
    return address?.ownerId === ownerId ? address : null;
  },

  async updateForOwner(
    ownerId: ID,
    addressId: ID,
    input: Pick<Address, "label" | "line1" | "line2" | "city" | "state">,
  ): Promise<Address> {
    await delay(500);
    const address = db.findById("addresses", addressId);
    if (!address || address.ownerId !== ownerId) throw new Error("Address not found.");
    return db.update("addresses", addressId, {
      label: input.label,
      line1: input.line1.trim(),
      line2: input.line2?.trim() || undefined,
      city: input.city.trim(),
      state: input.state.trim(),
    });
  },

  async setDefault(ownerId: ID, addressId: ID): Promise<Address> {
    await delay(400);
    const address = db.findById("addresses", addressId);
    if (!address || address.ownerId !== ownerId) throw new Error("Address not found.");
    db.where("addresses", (candidate) => candidate.ownerId === ownerId).forEach((candidate) => {
      db.update("addresses", candidate.id, { isDefault: candidate.id === addressId });
    });
    return db.findById("addresses", addressId)!;
  },

  async removeForOwner(ownerId: ID, addressId: ID): Promise<void> {
    await delay(450);
    const address = db.findById("addresses", addressId);
    if (!address || address.ownerId !== ownerId) throw new Error("Address not found.");
    const addresses = db.where("addresses", (candidate) => candidate.ownerId === ownerId);
    if (addresses.length <= 1) throw new Error("Keep at least one delivery address.");
    const usedByActiveOrder = db.where(
      "orders",
      (order) => order.customerId === ownerId && order.deliveryAddressId === addressId && !["COMPLETED", "CANCELLED", "REFUNDED"].includes(order.status),
    ).length > 0;
    if (usedByActiveOrder) throw new Error("This address is used by an active order.");
    db.remove("addresses", addressId);
    if (address.isDefault) {
      const replacement = db.where("addresses", (candidate) => candidate.ownerId === ownerId)[0];
      if (replacement) db.update("addresses", replacement.id, { isDefault: true });
    }
  },
};
