import { db, delay } from "@/data/mock-db/db";
import type {
  Business, ConfirmationCode, Delivery, ID, Inventory, InventoryMovement, Order,
  OrderItem, Product, User,
} from "@/domain/types";

export interface OperatorOrderLine extends OrderItem { product?: Product }
export interface OperatorOrderDetail {
  order: Order;
  customer?: User;
  items: OperatorOrderLine[];
  code?: ConfirmationCode;
  delivery?: Delivery;
}
export interface OperatorStockItem { inventory: Inventory; product?: Product }

function businessFor(operatorId: ID): Business {
  const business = db.where("businesses", (row) => row.operatorId === operatorId)[0];
  if (!business) throw new Error("No business is linked to this operator.");
  return business;
}

function orderDetail(order: Order): OperatorOrderDetail {
  return {
    order,
    customer: db.findById("users", order.customerId),
    items: db.where("orderItems", (item) => item.orderId === order.id).map((item) => ({
      ...item, product: db.findById("products", item.productId),
    })),
    code: db.where("confirmationCodes", (row) => row.orderId === order.id)[0],
    delivery: db.where("deliveries", (row) => row.orderId === order.id)[0],
  };
}

function ownedOrder(operatorId: ID, orderId: ID): Order {
  const business = businessFor(operatorId);
  const order = db.findById("orders", orderId);
  if (!order || order.businessId !== business.id) throw new Error("Order not found for this business.");
  return order;
}

export const operatorOperationsRepository = {
  async dashboard(operatorId: ID) {
    await delay(350);
    const business = businessFor(operatorId);
    const orders = db.where("orders", (row) => row.businessId === business.id)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    const stock = db.where("inventories", (row) => row.businessId === business.id);
    return {
      business,
      activeOrders: orders.filter((row) => !["COMPLETED", "CANCELLED", "REFUNDED"].includes(row.status)).map(orderDetail),
      totalOrders: orders.length,
      paidRevenue: orders.filter((row) => row.paymentStatus === "PAID").reduce((sum, row) => sum + row.total, 0),
      lowStock: stock.filter((row) => row.filledQty - row.reservedQty <= row.reorderLevel).length,
      unassigned: orders.filter((row) => row.fulfilmentMode === "DELIVERY").filter((row) => {
        const delivery = db.where("deliveries", (item) => item.orderId === row.id)[0];
        return !delivery || delivery.status === "UNASSIGNED";
      }).length,
    };
  },

  async setTradingStatus(operatorId: ID, isOpen: boolean): Promise<Business> {
    await delay(450);
    const business = businessFor(operatorId);
    if (business.status !== "ACTIVE") throw new Error("Only an active business can change trading status.");
    return db.update("businesses", business.id, { isOpen });
  },

  async listOrders(operatorId: ID): Promise<OperatorOrderDetail[]> {
    await delay(350);
    const business = businessFor(operatorId);
    return db.where("orders", (row) => row.businessId === business.id)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt)).map(orderDetail);
  },

  async findOrder(operatorId: ID, orderId: ID): Promise<OperatorOrderDetail | null> {
    await delay(300);
    try { return orderDetail(ownedOrder(operatorId, orderId)); } catch { return null; }
  },

  async advanceOrder(operatorId: ID, orderId: ID): Promise<OperatorOrderDetail> {
    await delay(500);
    const order = ownedOrder(operatorId, orderId);
    const next = order.status === "CONFIRMED" ? "ACCEPTED"
      : order.status === "ACCEPTED" ? "PREPARING"
      : order.status === "PREPARING" ? (order.fulfilmentMode === "PICKUP" ? "READY" : "OUT_FOR_DELIVERY")
      : order.status === "READY" && order.fulfilmentMode === "PICKUP" ? "COMPLETED" : null;
    if (!next) throw new Error("This order has no available next step.");
    const now = new Date().toISOString();
    const updated = db.update("orders", order.id, { status: next, updatedAt: now });
    const delivery = db.where("deliveries", (row) => row.orderId === order.id)[0];
    if (delivery && next === "OUT_FOR_DELIVERY") db.update("deliveries", delivery.id, { status: delivery.assignedToName ? "EN_ROUTE" : "UNASSIGNED" });
    return orderDetail(updated);
  },

  async assignDelivery(operatorId: ID, orderId: ID, input: { name: string; phone: string; etaMinutes: number }): Promise<OperatorOrderDetail> {
    await delay(550);
    const order = ownedOrder(operatorId, orderId);
    if (order.fulfilmentMode !== "DELIVERY" || ["COMPLETED", "CANCELLED", "REFUNDED"].includes(order.status)) throw new Error("This order cannot be assigned for delivery.");
    if (input.name.trim().length < 2 || input.phone.trim().length < 7) throw new Error("Enter the delivery partner's name and phone number.");
    if (!Number.isInteger(input.etaMinutes) || input.etaMinutes < 5 || input.etaMinutes > 240) throw new Error("ETA must be between 5 and 240 minutes.");
    const current = db.where("deliveries", (row) => row.orderId === order.id)[0];
    const delivery = current
      ? db.update("deliveries", current.id, { assignedToName: input.name.trim(), assignedToPhone: input.phone.trim(), etaMinutes: input.etaMinutes, status: order.status === "OUT_FOR_DELIVERY" ? "EN_ROUTE" : "ASSIGNED" })
      : db.insert("deliveries", { id: `del_${Date.now()}`, orderId: order.id, businessId: order.businessId, customerId: order.customerId, assignedToName: input.name.trim(), assignedToPhone: input.phone.trim(), etaMinutes: input.etaMinutes, status: "ASSIGNED", createdAt: new Date().toISOString() });
    return { ...orderDetail(order), delivery };
  },

  async findRedemption(operatorId: ID, displayCode: string): Promise<OperatorOrderDetail> {
    await delay(400);
    const business = businessFor(operatorId);
    const code = db.where("confirmationCodes", (row) => row.businessId === business.id && row.displayCode === displayCode.trim())[0];
    if (!code) throw new Error("No order matches that confirmation code.");
    return orderDetail(ownedOrder(operatorId, code.orderId));
  },

  async redeem(operatorId: ID, orderId: ID, displayCode: string): Promise<OperatorOrderDetail> {
    await delay(650);
    const order = ownedOrder(operatorId, orderId);
    const code = db.where("confirmationCodes", (row) => row.orderId === order.id && row.displayCode === displayCode.trim())[0];
    if (!code) throw new Error("The confirmation code does not match this order.");
    if (code.status !== "ACTIVE") throw new Error("This confirmation code is no longer active.");
    if (new Date(code.expiresAt).getTime() < Date.now()) {
      db.update("confirmationCodes", code.id, { status: "EXPIRED" });
      throw new Error("This confirmation code has expired.");
    }
    const now = new Date().toISOString();
    db.update("confirmationCodes", code.id, { status: "REDEEMED", redeemedAt: now });
    const completed = db.update("orders", order.id, { status: "COMPLETED", updatedAt: now });
    const delivery = db.where("deliveries", (row) => row.orderId === order.id)[0];
    if (delivery) db.update("deliveries", delivery.id, { status: "COMPLETED", completedAt: now });
    db.where("orderItems", (item) => item.orderId === order.id).forEach((item) => {
      const inventory = db.where("inventories", (row) => row.businessId === order.businessId && row.productId === item.productId)[0];
      if (!inventory) return;
      db.update("inventories", inventory.id, {
        filledQty: Math.max(0, inventory.filledQty - item.quantity),
        reservedQty: Math.max(0, inventory.reservedQty - item.quantity),
        emptyQty: inventory.emptyQty + item.expectedEmptyReturns,
        updatedAt: now,
      });
      db.insert("inventoryMovements", { id: `mov_sale_${item.id}_${Date.now()}`, inventoryId: inventory.id, type: "SALE", quantity: -item.quantity, reason: `Completed ${order.orderNumber}`, actorId: operatorId, correlationId: order.id, createdAt: now });
      if (item.expectedEmptyReturns) db.insert("inventoryMovements", { id: `mov_return_${item.id}_${Date.now()}`, inventoryId: inventory.id, type: "RETURN", quantity: item.expectedEmptyReturns, reason: `Empty returns for ${order.orderNumber}`, actorId: operatorId, correlationId: order.id, createdAt: now });
    });
    return orderDetail(completed);
  },

  async stock(operatorId: ID): Promise<OperatorStockItem[]> {
    await delay(350);
    const business = businessFor(operatorId);
    return db.where("inventories", (row) => row.businessId === business.id).map((inventory) => ({ inventory, product: db.findById("products", inventory.productId) }));
  },

  async stockHistory(operatorId: ID): Promise<Array<{ movement: InventoryMovement; inventory?: Inventory; product?: Product }>> {
    await delay(350);
    const stock = await this.stock(operatorId);
    const ids = new Set(stock.map((row) => row.inventory.id));
    return db.where("inventoryMovements", (row) => ids.has(row.inventoryId)).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((movement) => {
      const inventory = stock.find((row) => row.inventory.id === movement.inventoryId)?.inventory;
      return { movement, inventory, product: inventory ? db.findById("products", inventory.productId) : undefined };
    });
  },

  async receiveStock(operatorId: ID, lines: Array<{ inventoryId: ID; quantity: number }>, note: string): Promise<{ units: number; reference: string }> {
    await delay(650);
    const business = businessFor(operatorId);
    const valid = lines.filter((line) => Number.isInteger(line.quantity) && line.quantity > 0);
    if (!valid.length) throw new Error("Add at least one stock quantity.");
    if (note.trim().length < 4) throw new Error("Add a short delivery reference or note.");
    const now = new Date().toISOString(); const reference = `STK-${String(Date.now()).slice(-6)}`;
    valid.forEach((line) => {
      const inventory = db.findById("inventories", line.inventoryId);
      if (!inventory || inventory.businessId !== business.id) throw new Error("One stock line is invalid.");
      if (line.quantity > 500) throw new Error("A stock line cannot exceed 500 units.");
      db.update("inventories", inventory.id, { filledQty: inventory.filledQty + line.quantity, updatedAt: now });
      db.insert("inventoryMovements", { id: `mov_receipt_${inventory.id}_${Date.now()}`, inventoryId: inventory.id, type: "RECEIPT", quantity: line.quantity, reason: `${note.trim()} · ${reference}`, actorId: operatorId, correlationId: reference, createdAt: now });
    });
    return { units: valid.reduce((sum, line) => sum + line.quantity, 0), reference };
  },
};
