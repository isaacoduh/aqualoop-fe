import { db, delay } from "@/data/mock-db/db";
import type {
  Address,
  Business,
  BusinessProduct,
  ConfirmationCode,
  Delivery,
  FulfilmentMode,
  ID,
  Inventory,
  Order,
  OrderItem,
  Payment,
  Product,
} from "@/domain/types";

export interface CheckoutCatalogItem {
  product: Product;
  listing: BusinessProduct;
  inventory?: Inventory;
  availableQuantity: number;
}

export interface CheckoutCatalog {
  business: Business;
  items: CheckoutCatalogItem[];
}

export interface CheckoutLineInput {
  productId: ID;
  quantity: number;
}

export interface CompleteCheckoutInput {
  customerId: ID;
  businessId: ID;
  items: CheckoutLineInput[];
  fulfilmentMode: FulfilmentMode;
  addressId?: ID;
  paymentMethodId: ID;
  notes?: string;
}

export interface CompletedCheckout {
  order: Order;
  items: OrderItem[];
  payment: Payment;
  confirmationCode: ConfirmationCode;
  delivery?: Delivery;
}

export const CHECKOUT_DELIVERY_FEE = 1200;

function createReference(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function findCheckoutCatalog(businessId: ID): CheckoutCatalog | undefined {
  const business = db.findById("businesses", businessId);

  if (!business || business.status !== "ACTIVE") return undefined;

  const products = db.all("products");
  const inventories = db.where(
    "inventories",
    (inventory) => inventory.businessId === businessId,
  );
  const listings = db.where(
    "businessProducts",
    (listing) => listing.businessId === businessId && listing.active,
  );

  return {
    business,
    items: listings.flatMap((listing) => {
      const product = products.find(
        (candidate) => candidate.id === listing.productId && candidate.active,
      );
      if (!product) return [];

      const inventory = inventories.find(
        (candidate) => candidate.productId === listing.productId,
      );

      return [
        {
          product,
          listing,
          inventory,
          availableQuantity: inventory
            ? Math.max(0, inventory.filledQty - inventory.reservedQty)
            : 0,
        },
      ];
    }),
  };
}

export const checkoutRepository = {
  async catalog(businessId: ID): Promise<CheckoutCatalog | null> {
    await delay(450);
    return findCheckoutCatalog(businessId) ?? null;
  },

  async complete(input: CompleteCheckoutInput): Promise<CompletedCheckout> {
    await delay(900);

    const catalog = findCheckoutCatalog(input.businessId);
    if (!catalog || !catalog.business.isOpen) {
      throw new Error("This business is not accepting orders right now.");
    }

    if (input.items.length === 0) {
      throw new Error("Add at least one available product to continue.");
    }

    if (!catalog.business.fulfilmentModes.includes(input.fulfilmentMode)) {
      throw new Error("The selected fulfilment method is not available.");
    }

    let deliveryAddress: Address | undefined;
    if (input.fulfilmentMode === "DELIVERY") {
      deliveryAddress = input.addressId
        ? db.findById("addresses", input.addressId)
        : undefined;
      if (!deliveryAddress || deliveryAddress.ownerId !== input.customerId) {
        throw new Error("Choose a valid delivery address.");
      }
    }

    const paymentMethod = db.findById("paymentMethods", input.paymentMethodId);
    if (!paymentMethod || paymentMethod.userId !== input.customerId) {
      throw new Error("Choose a valid payment method.");
    }

    const validatedLines = input.items.map((line) => {
      if (!Number.isInteger(line.quantity) || line.quantity <= 0) {
        throw new Error("Product quantities must be positive whole numbers.");
      }

      const catalogItem = catalog.items.find(
        (item) => item.product.id === line.productId,
      );
      if (!catalogItem || !catalogItem.inventory) {
        throw new Error("One of the selected products is unavailable.");
      }
      if (line.quantity > catalogItem.availableQuantity) {
        throw new Error(`${catalogItem.product.name} no longer has enough stock.`);
      }

      return { ...line, catalogItem };
    });

    const subtotal = validatedLines.reduce(
      (sum, line) => sum + line.catalogItem.listing.price * line.quantity,
      0,
    );
    const depositAmount = validatedLines.reduce(
      (sum, line) =>
        sum + line.catalogItem.listing.depositAmount * line.quantity,
      0,
    );
    const deliveryFee =
      input.fulfilmentMode === "DELIVERY" ? CHECKOUT_DELIVERY_FEE : 0;
    const total = subtotal + depositAmount + deliveryFee;

    if (subtotal < catalog.business.minimumOrder) {
      throw new Error(
        `This business requires a minimum product subtotal of ${catalog.business.minimumOrder}.`,
      );
    }

    if (paymentMethod.type === "WALLET") {
      const wallet = db.where(
        "wallets",
        (candidate) =>
          candidate.ownerType === "USER" && candidate.ownerId === input.customerId,
      )[0];
      if (!wallet || wallet.cachedBalance < total) {
        throw new Error("Your wallet balance is not enough for this order.");
      }
    }

    const now = new Date();
    const orderId = createReference("ord");
    const orderNumber = `AQ-${String(Date.now()).slice(-6)}`;
    const order = db.insert("orders", {
      id: orderId,
      orderNumber,
      customerId: input.customerId,
      businessId: input.businessId,
      deliveryAddressId: deliveryAddress?.id,
      fulfilmentMode: input.fulfilmentMode,
      status: "CONFIRMED",
      paymentStatus: "PAID",
      currency: "GBP",
      subtotal,
      deliveryFee,
      depositAmount,
      discount: 0,
      total,
      notes: input.notes?.trim() || undefined,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });

    const orderItems = validatedLines.map((line) =>
      db.insert("orderItems", {
        id: createReference("oi"),
        orderId,
        productId: line.productId,
        quantity: line.quantity,
        unitPrice: line.catalogItem.listing.price,
        depositAmount:
          line.catalogItem.listing.depositAmount * line.quantity,
        lineTotal: line.catalogItem.listing.price * line.quantity,
        expectedEmptyReturns:
          line.catalogItem.product.type === "BOTTLE_EXCHANGE"
            ? line.quantity
            : 0,
      }),
    );

    validatedLines.forEach((line) => {
      const inventory = line.catalogItem.inventory;
      if (!inventory) return;
      db.update("inventories", inventory.id, {
        reservedQty: inventory.reservedQty + line.quantity,
        updatedAt: now.toISOString(),
      });
      db.insert("inventoryMovements", {
        id: createReference("im"),
        inventoryId: inventory.id,
        type: "RESERVATION",
        quantity: -line.quantity,
        reason: `Reserved for ${orderNumber}`,
        actorId: input.customerId,
        correlationId: orderId,
        createdAt: now.toISOString(),
      });
    });

    if (paymentMethod.type === "WALLET") {
      const wallet = db.where(
        "wallets",
        (candidate) =>
          candidate.ownerType === "USER" && candidate.ownerId === input.customerId,
      )[0];
      if (wallet) {
        db.update("wallets", wallet.id, {
          cachedBalance: wallet.cachedBalance - total,
          updatedAt: now.toISOString(),
        });
        db.insert("ledgerEntries", {
          id: createReference("le"),
          walletId: wallet.id,
          direction: "DEBIT",
          type: "ORDER_PAYMENT",
          amount: total,
          referenceType: "ORDER",
          referenceId: orderId,
          description: `Payment for ${orderNumber}`,
          createdAt: now.toISOString(),
        });
      }
    }

    const payment = db.insert("payments", {
      id: createReference("pay"),
      orderId,
      userId: input.customerId,
      paymentMethodId: paymentMethod.id,
      providerReference: createReference(
        paymentMethod.type === "WALLET" ? "WAL" : "PSK",
      ),
      amount: total,
      currency: "GBP",
      status: "PAID",
      createdAt: now.toISOString(),
      paidAt: now.toISOString(),
    });

    const confirmationCode = db.insert("confirmationCodes", {
      id: createReference("ccc"),
      orderId,
      businessId: input.businessId,
      customerId: input.customerId,
      displayCode: String(100000 + (Date.now() % 900000)),
      status: "ACTIVE",
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: now.toISOString(),
    });

    const delivery =
      input.fulfilmentMode === "DELIVERY"
        ? db.insert("deliveries", {
            id: createReference("del"),
            orderId,
            businessId: input.businessId,
            customerId: input.customerId,
            status: "UNASSIGNED",
            createdAt: now.toISOString(),
          })
        : undefined;

    return { order, items: orderItems, payment, confirmationCode, delivery };
  },
};
