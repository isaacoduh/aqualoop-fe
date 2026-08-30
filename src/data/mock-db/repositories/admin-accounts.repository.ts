import { db, delay } from "@/data/mock-db/db";
import type { AccountStatus, BusinessStatus, ID, VerificationStatus } from "@/domain/types";
import { requireAdminPermission } from "@/data/mock-db/repositories/admin-authorization";

function customerDetail(customerId: ID) {
  const user = db.findById("users", customerId);
  if (!user || user.role !== "CUSTOMER") return null;
  const orders = db.where("orders", (row) => row.customerId === customerId).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
  const wallet = db.where("wallets", (row) => row.ownerType === "USER" && row.ownerId === customerId)[0];
  return {
    user,
    addresses: db.where("addresses", (row) => row.ownerId === customerId),
    orders,
    reviews: db.where("reviews", (row) => row.customerId === customerId).sort((a,b) => b.createdAt.localeCompare(a.createdAt)),
    payments: db.where("payments", (row) => row.userId === customerId).sort((a,b) => b.createdAt.localeCompare(a.createdAt)),
    wallet,
    ledger: wallet ? db.where("ledgerEntries", (row) => row.walletId === wallet.id).sort((a,b) => b.createdAt.localeCompare(a.createdAt)) : [],
  };
}

function operatorDetail(operatorId: ID) {
  const operator = db.findById("operators", operatorId);
  const user = operator ? db.findById("users", operator.userId) : undefined;
  if (!operator || !user) return null;
  const businesses = db.where("businesses", (row) => row.operatorId === operatorId);
  const businessIds = new Set(businesses.map((row) => row.id));
  const wallet = db.where("wallets", (row) => row.ownerType === "OPERATOR" && row.ownerId === operatorId)[0];
  return {
    operator, user, businesses, wallet,
    plan: db.findById("plans", operator.planId),
    orders: db.where("orders", (row) => businessIds.has(row.businessId)).sort((a,b) => b.createdAt.localeCompare(a.createdAt)),
    withdrawals: db.where("withdrawals", (row) => row.operatorId === operatorId).sort((a,b) => b.requestedAt.localeCompare(a.requestedAt)),
    verification: db.where("verificationRequests", (row) => row.operatorId === operatorId).sort((a,b) => b.submittedAt.localeCompare(a.submittedAt)),
    ledger: wallet ? db.where("ledgerEntries", (row) => row.walletId === wallet.id).sort((a,b) => b.createdAt.localeCompare(a.createdAt)) : [],
  };
}

function businessDetail(businessId: ID) {
  const business = db.findById("businesses", businessId);
  if (!business) return null;
  const operator = db.findById("operators", business.operatorId);
  const user = operator ? db.findById("users", operator.userId) : undefined;
  const wallet = operator ? db.where("wallets", (row) => row.ownerType === "OPERATOR" && row.ownerId === operator.id)[0] : undefined;
  const stock = db.where("inventories", (row) => row.businessId === businessId).map((inventory) => ({ inventory, product: db.findById("products", inventory.productId) }));
  return {
    business, operator, user, wallet,
    address: db.findById("addresses", business.addressId),
    stock,
    deliveries: db.where("deliveries", (row) => row.businessId === businessId).sort((a,b) => b.createdAt.localeCompare(a.createdAt)),
    orders: db.where("orders", (row) => row.businessId === businessId).sort((a,b) => b.createdAt.localeCompare(a.createdAt)),
    reviews: db.where("reviews", (row) => row.businessId === businessId).sort((a,b) => b.createdAt.localeCompare(a.createdAt)),
    verification: db.where("verificationRequests", (row) => row.businessId === businessId).sort((a,b) => b.submittedAt.localeCompare(a.submittedAt)),
    earnings: wallet ? db.where("ledgerEntries", (row) => row.walletId === wallet.id && row.type === "ORDER_EARNING").sort((a,b) => b.createdAt.localeCompare(a.createdAt)) : [],
  };
}

export const adminAccountsRepository = {
  async dashboard() {
    await delay(350);
    const orders = db.all("orders"); const stock = db.all("inventories");
    return {
      customers: db.where("users", (row) => row.role === "CUSTOMER").length,
      operators: db.all("operators").length,
      businesses: db.all("businesses").length,
      activeBusinesses: db.where("businesses", (row) => row.status === "ACTIVE").length,
      orderValue: orders.filter((row) => row.paymentStatus === "PAID").reduce((sum,row) => sum + row.total, 0),
      activeOrders: orders.filter((row) => !["COMPLETED","CANCELLED","REFUNDED"].includes(row.status)).length,
      pendingVerification: db.where("verificationRequests", (row) => row.status === "PENDING").length,
      pendingWithdrawals: db.where("withdrawals", (row) => row.status === "PENDING").length,
      lowStock: stock.filter((row) => row.filledQty - row.reservedQty <= row.reorderLevel).length,
      recentOrders: orders.sort((a,b) => b.createdAt.localeCompare(a.createdAt)).slice(0,5),
    };
  },
  async customers() { await delay(350); return db.where("users", (row) => row.role === "CUSTOMER").sort((a,b) => b.createdAt.localeCompare(a.createdAt)).map((user) => { const detail=customerDetail(user.id)!; return { user, orderCount:detail.orders.length, spend:detail.orders.filter(row=>row.paymentStatus==="PAID").reduce((sum,row)=>sum+row.total,0), ratingCount:detail.reviews.length }; }); },
  async customer(id: ID) { await delay(300); return customerDetail(id); },
  async setCustomerStatus(id: ID, status: AccountStatus) { await delay(500); requireAdminPermission(status==="BLOCKED"?"delete":"update"); const detail=customerDetail(id); if(!detail)throw new Error("Customer not found."); if(!["ACTIVE","SUSPENDED","BLOCKED"].includes(status))throw new Error("Unsupported customer status."); return db.update("users",id,{status}); },
  async operators() { await delay(350); return db.all("operators").sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).map((operator)=>{const detail=operatorDetail(operator.id)!;return {operator,user:detail.user,businessCount:detail.businesses.length,orderCount:detail.orders.length,balance:detail.wallet?.cachedBalance??0};}); },
  async operator(id: ID) { await delay(300); return operatorDetail(id); },
  async setOperatorStatus(id: ID, status: VerificationStatus) { await delay(550); requireAdminPermission(status==="REJECTED"?"delete":"update"); const detail=operatorDetail(id); if(!detail)throw new Error("Operator not found."); db.update("operators",id,{status}); if(status==="APPROVED")db.update("users",detail.user.id,{status:"ACTIVE"}); if(status==="REJECTED"){db.update("users",detail.user.id,{status:"SUSPENDED"});detail.businesses.filter(row=>row.status==="ACTIVE").forEach(row=>db.update("businesses",row.id,{status:"SUSPENDED",isOpen:false}));} return operatorDetail(id)!; },
  async businesses() { await delay(350); return db.all("businesses").sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).map((business)=>{const detail=businessDetail(business.id)!;return {business,operator:detail.operator,user:detail.user,orderCount:detail.orders.length,availableStock:detail.stock.reduce((sum,row)=>sum+Math.max(0,row.inventory.filledQty-row.inventory.reservedQty),0)};}); },
  async business(id: ID) { await delay(300); return businessDetail(id); },
  async setBusinessStatus(id: ID, status: BusinessStatus) { await delay(550); requireAdminPermission(status==="CLOSED"?"delete":"update"); const detail=businessDetail(id); if(!detail)throw new Error("Business not found."); const updated=db.update("businesses",id,{status,isOpen:status==="ACTIVE"?detail.business.isOpen:false}); return {...businessDetail(id)!,business:updated}; },
};
