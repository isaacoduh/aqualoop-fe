import { db, delay } from "@/data/mock-db/db";
import type { BusinessProduct, ID, Product } from "@/domain/types";

export const productRepository = {
  async list(): Promise<Product[]> {
    await delay();
    return db.all("products");
  },

  async listForBusiness(
    businessId: ID,
  ): Promise<Array<{ product: Product; listing: BusinessProduct }>> {
    await delay();
    const listings = db.where(
      "businessProducts",
      (row) => row.businessId === businessId && row.active,
    );
    const products = db.all("products");

    return listings.flatMap((listing) => {
      const product = products.find(
        (candidate) => candidate.id === listing.productId,
      );

      if (!product || !product.active) {
        return [];
      }

      return [{ product, listing }];
    });
  }
};
