import { db, delay } from "@/data/mock-db/db";
import type { Address, Business, Coordinates, ID } from "@/domain/types";

export interface BusinessDiscoveryItem {
  business: Business;
  address: Address;
  distanceKm: number;
}

const defaultOrigin: Coordinates = { lat: 6.4439, lng: 3.47 };

function distanceBetween(origin: Coordinates, destination: Coordinates): number {
  const earthRadiusKm = 6371;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDelta = toRadians(destination.lat - origin.lat);
  const longitudeDelta = toRadians(destination.lng - origin.lng);
  const originLatitude = toRadians(origin.lat);
  const destinationLatitude = toRadians(destination.lat);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(originLatitude) *
      Math.cos(destinationLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function discoveryItem(
  business: Business,
  addresses: Address[],
  origin: Coordinates,
): BusinessDiscoveryItem | undefined {
  const address = addresses.find((candidate) => candidate.id === business.addressId);

  if (!address) return undefined;

  return {
    business,
    address,
    distanceKm: Number(distanceBetween(origin, business.coordinates).toFixed(1)),
  };
}

export const businessRepository = {
  async listActive(): Promise<Business[]> {
    await delay();
    return db.where("businesses", (business) => business.status === "ACTIVE");
  },

  async listNearby(): Promise<Business[]> {
    await delay();
    return db.where("businesses", (business) => business.status === "ACTIVE" && business.isOpen);
  },

  async listDiscovery(
    origin: Coordinates = defaultOrigin,
  ): Promise<BusinessDiscoveryItem[]> {
    await delay(450);
    const addresses = db.all("addresses");

    return db
      .where("businesses", (business) => business.status === "ACTIVE")
      .flatMap((business) => {
        const item = discoveryItem(business, addresses, origin);
        return item ? [item] : [];
      })
      .sort((left, right) => left.distanceKm - right.distanceKm);
  },

  async findDiscoveryById(
    id: ID,
    origin: Coordinates = defaultOrigin,
  ): Promise<BusinessDiscoveryItem | undefined> {
    await delay(350);
    const business = db.findById("businesses", id);

    if (!business || business.status !== "ACTIVE") return undefined;

    return discoveryItem(business, db.all("addresses"), origin);
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
