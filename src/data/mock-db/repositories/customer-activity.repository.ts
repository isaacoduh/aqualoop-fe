import { db, delay } from "@/data/mock-db/db";
import type {
  Address, Business, ConfirmationCode, Delivery, FulfilmentMode, ID,
  LedgerEntry, Order, OrderItem, Payment, PaymentMethod, Product, Review, Wallet,
} from "@/domain/types";

export interface CustomerOrderItem extends OrderItem { product?: Product }

export interface CustomerOrderDetail {
  order: Order;
  business?: Business;
  address?: Address;
  items: CustomerOrderItem[];
  payment?: Payment;
  paymentMethod?: PaymentMethod;
  code?: ConfirmationCode;
  delivery?: Delivery;
  review?: Review;
}

export interface CustomerPaymentDetail {
  payment: Payment;
  order?: Order;
  method?: PaymentMethod;
  business?: Business;
}

function detail(order: Order): CustomerOrderDetail {
  const payment = db.where("payments", (row) => row.orderId === order.id)[0];
  return {
    order,
    business: db.findById("businesses", order.businessId),
    address: order.deliveryAddressId ? db.findById("addresses", order.deliveryAddressId) : undefined,
    items: db.where("orderItems", (item) => item.orderId === order.id).map((item) => ({
      ...item,
      product: db.findById("products", item.productId),
    })),
    payment,
    paymentMethod: payment ? db.findById("paymentMethods", payment.paymentMethodId) : undefined,
    code: db.where("confirmationCodes", (row) => row.orderId === order.id)[0],
    delivery: db.where("deliveries", (row) => row.orderId === order.id)[0],
    review: db.where("reviews", (row) => row.orderId === order.id)[0],
  };
}

export const customerActivityRepository = {
  async listOrders(customerId: ID): Promise<CustomerOrderDetail[]> {
    await delay(450);
    return db.where("orders", (order) => order.customerId === customerId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .map(detail);
  },

  async findOrder(customerId: ID, orderId: ID): Promise<CustomerOrderDetail | null> {
    await delay(400);
    const order = db.findById("orders", orderId);
    return order?.customerId === customerId ? detail(order) : null;
  },

  async listPayments(customerId: ID): Promise<CustomerPaymentDetail[]> {
    await delay(400);
    return db.where("payments", (payment) => payment.userId === customerId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .map((payment) => {
        const order = db.findById("orders", payment.orderId);
        return {
          payment,
          order,
          method: db.findById("paymentMethods", payment.paymentMethodId),
          business: order ? db.findById("businesses", order.businessId) : undefined,
        };
      });
  },

  async walletActivity(customerId: ID): Promise<{ wallet: Wallet | null; entries: LedgerEntry[] }> {
    await delay(400);
    const wallet = db.where("wallets", (row) => row.ownerType === "USER" && row.ownerId === customerId)[0];
    return {
      wallet: wallet ?? null,
      entries: wallet ? db.where("ledgerEntries", (entry) => entry.walletId === wallet.id)
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt)) : [],
    };
  },

  async listCodes(customerId: ID): Promise<Array<{ code: ConfirmationCode; order?: Order; business?: Business }>> {
    await delay(400);
    return db.where("confirmationCodes", (code) => code.customerId === customerId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .map((code) => ({
        code,
        order: db.findById("orders", code.orderId),
        business: db.findById("businesses", code.businessId),
      }));
  },

  async findCode(customerId: ID, codeId: ID): Promise<{ code: ConfirmationCode; order: CustomerOrderDetail } | null> {
    await delay(350);
    const code = db.findById("confirmationCodes", codeId);
    const order = code ? db.findById("orders", code.orderId) : undefined;
    return code?.customerId === customerId && order?.customerId === customerId
      ? { code, order: detail(order) }
      : null;
  },

  async confirmReceipt(customerId: ID, displayCode: string): Promise<CustomerOrderDetail> {
    await delay(650);
    const code = db.where("confirmationCodes", (row) => row.customerId === customerId && row.displayCode === displayCode)[0];
    if (!code) throw new Error("That confirmation code was not found.");
    if (code.status !== "ACTIVE") throw new Error("This confirmation code is no longer active.");
    if (new Date(code.expiresAt).getTime() < Date.now()) {
      db.update("confirmationCodes", code.id, { status: "EXPIRED" });
      throw new Error("This confirmation code has expired.");
    }
    const now = new Date().toISOString();
    db.update("confirmationCodes", code.id, { status: "REDEEMED", redeemedAt: now });
    const order = db.update("orders", code.orderId, { status: "COMPLETED", updatedAt: now });
    const delivery = db.where("deliveries", (row) => row.orderId === order.id)[0];
    if (delivery) db.update("deliveries", delivery.id, { status: "COMPLETED", completedAt: now });
    db.where("orderItems", (item) => item.orderId === order.id).forEach((item) => {
      const inventory = db.where("inventories", (row) => row.businessId === order.businessId && row.productId === item.productId)[0];
      if (inventory) db.update("inventories", inventory.id, {
        filledQty: Math.max(0, inventory.filledQty - item.quantity),
        reservedQty: Math.max(0, inventory.reservedQty - item.quantity),
        emptyQty: inventory.emptyQty + item.expectedEmptyReturns,
        updatedAt: now,
      });
    });
    return detail(order);
  },

  async cancelOrder(customerId: ID, orderId: ID, reason: string): Promise<CustomerOrderDetail> {
    await delay(650);
    const order = db.findById("orders", orderId);
    if (!order || order.customerId !== customerId) throw new Error("Order not found.");
    if (!["DRAFT", "PAYMENT_PENDING", "CONFIRMED"].includes(order.status)) {
      throw new Error("This order has progressed too far to cancel online.");
    }
    const now = new Date().toISOString();
    const cancelled = db.update("orders", order.id, {
      status: "CANCELLED",
      paymentStatus: order.paymentStatus === "PAID" ? "REFUNDED" : order.paymentStatus,
      notes: [order.notes, `Cancellation: ${reason.trim()}`].filter(Boolean).join(" | "),
      updatedAt: now,
    });
    const payment = db.where("payments", (row) => row.orderId === order.id)[0];
    if (payment?.status === "PAID") {
      db.update("payments", payment.id, { status: "REFUNDED" });
      const method = db.findById("paymentMethods", payment.paymentMethodId);
      if (method?.type === "WALLET") {
        const wallet = db.where("wallets", (row) => row.ownerId === customerId && row.ownerType === "USER")[0];
        if (wallet) {
          db.update("wallets", wallet.id, { cachedBalance: wallet.cachedBalance + payment.amount, updatedAt: now });
          db.insert("ledgerEntries", {
            id: `le_ref_${Date.now()}`, walletId: wallet.id, direction: "CREDIT", type: "REFUND",
            amount: payment.amount, referenceType: "ORDER", referenceId: order.id,
            description: `Refund for cancelled ${order.orderNumber}`, createdAt: now,
          });
        }
      }
    }
    const code = db.where("confirmationCodes", (row) => row.orderId === order.id)[0];
    if (code && ["ISSUED", "ACTIVE"].includes(code.status)) db.update("confirmationCodes", code.id, { status: "REVOKED" });
    const delivery = db.where("deliveries", (row) => row.orderId === order.id)[0];
    if (delivery) db.update("deliveries", delivery.id, { status: "CANCELLED" });
    db.where("orderItems", (item) => item.orderId === order.id).forEach((item) => {
      const inventory = db.where("inventories", (row) => row.businessId === order.businessId && row.productId === item.productId)[0];
      if (inventory) db.update("inventories", inventory.id, {
        reservedQty: Math.max(0, inventory.reservedQty - item.quantity), updatedAt: now,
      });
    });
    return detail(cancelled);
  },

  async createCustomOrder(customerId: ID, input: {
    businessId: ID; productId: ID; quantity: number; fulfilmentMode: FulfilmentMode; notes: string;
  }): Promise<CustomerOrderDetail> {
    await delay(700);
    const business = db.findById("businesses", input.businessId);
    const product = db.findById("products", input.productId);
    const listing = db.where("businessProducts", (row) => row.businessId === input.businessId && row.productId === input.productId && row.active)[0];
    if (!business || business.status !== "ACTIVE" || !product || !listing) throw new Error("Choose an available business and product.");
    if (!business.fulfilmentModes.includes(input.fulfilmentMode)) throw new Error("That fulfilment option is unavailable.");
    if (!Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > 20) throw new Error("Quantity must be between 1 and 20.");
    const now = new Date().toISOString();
    const id = `ord_custom_${Date.now()}`;
    const subtotal = listing.price * input.quantity;
    const depositAmount = listing.depositAmount * input.quantity;
    const deliveryFee = input.fulfilmentMode === "DELIVERY" ? 1200 : 0;
    const order = db.insert("orders", {
      id, orderNumber: `AQ-C${String(Date.now()).slice(-5)}`, customerId, businessId: business.id,
      fulfilmentMode: input.fulfilmentMode, status: "PAYMENT_PENDING", paymentStatus: "PENDING",
      currency: "GBP", subtotal, deliveryFee, depositAmount, discount: 0,
      total: subtotal + deliveryFee + depositAmount, notes: input.notes.trim(), createdAt: now, updatedAt: now,
    });
    db.insert("orderItems", {
      id: `oi_custom_${Date.now()}`, orderId: id, productId: product.id, quantity: input.quantity,
      unitPrice: listing.price, depositAmount, lineTotal: subtotal,
      expectedEmptyReturns: product.type === "BOTTLE_EXCHANGE" ? input.quantity : 0,
    });
    return detail(order);
  },
};
