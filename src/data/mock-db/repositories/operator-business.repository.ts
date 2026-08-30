import { db, delay } from "@/data/mock-db/db";
import type { BankAccount, Business, ID, Operator, Plan, User, Wallet } from "@/domain/types";

function context(operatorId: ID): { operator: Operator; user: User; business: Business; wallet: Wallet } {
  const operator = db.findById("operators", operatorId);
  const user = operator ? db.findById("users", operator.userId) : undefined;
  const business = db.where("businesses", (row) => row.operatorId === operatorId)[0];
  const wallet = db.where("wallets", (row) => row.ownerType === "OPERATOR" && row.ownerId === operatorId)[0];
  if (!operator || !user || !business || !wallet) throw new Error("Operator account data is incomplete.");
  return { operator, user, business, wallet };
}

export const operatorBusinessRepository = {
  async finance(operatorId: ID) {
    await delay(350); const { operator, wallet } = context(operatorId);
    return { wallet, plan: db.findById("plans", operator.planId), entries: db.where("ledgerEntries", (row) => row.walletId === wallet.id).sort((a,b) => b.createdAt.localeCompare(a.createdAt)) };
  },
  async plans(operatorId: ID): Promise<{ current?: Plan; plans: Plan[] }> {
    await delay(300); const { operator } = context(operatorId);
    return { current: db.findById("plans", operator.planId), plans: db.where("plans", (row) => row.active) };
  },
  async findPlan(operatorId: ID, planId: ID): Promise<{ plan: Plan; current?: Plan } | null> {
    const result = await this.plans(operatorId); const plan = result.plans.find((row) => row.id === planId); return plan ? { plan, current: result.current } : null;
  },
  async selectPlan(operatorId: ID, planId: ID): Promise<{ plan: Plan; reference: string }> {
    await delay(600); const { operator, wallet } = context(operatorId); const plan = db.findById("plans", planId);
    if (!plan?.active) throw new Error("That plan is unavailable.");
    if (operator.planId === plan.id) throw new Error("This is already your active plan.");
    if (wallet.cachedBalance < plan.monthlyFee) throw new Error("Your earnings balance is not enough for this plan.");
    const now = new Date().toISOString(); const reference = `PLAN-${String(Date.now()).slice(-6)}`;
    if (plan.monthlyFee > 0) {
      db.update("wallets", wallet.id, { cachedBalance: wallet.cachedBalance - plan.monthlyFee, updatedAt: now });
      db.insert("ledgerEntries", { id:`le_plan_${Date.now()}`, walletId:wallet.id, direction:"DEBIT", type:"ADJUSTMENT", amount:plan.monthlyFee, referenceType:"SYSTEM", referenceId:reference, description:`${plan.name} plan subscription`, createdAt:now });
    }
    db.update("operators", operator.id, { planId: plan.id }); return { plan, reference };
  },
  async withdrawals(operatorId: ID) { await delay(350); const { wallet }=context(operatorId); return { wallet, rows:db.where("withdrawals",(row)=>row.operatorId===operatorId).sort((a,b)=>b.requestedAt.localeCompare(a.requestedAt)) }; },
  async findWithdrawal(operatorId: ID, id: ID) { await delay(300); return db.where("withdrawals",(row)=>row.operatorId===operatorId&&row.id===id)[0] ?? null; },
  async requestWithdrawal(operatorId: ID, amount: number) {
    await delay(600); const { operator,business,wallet }=context(operatorId); const plan=db.findById("plans",operator.planId); const minimum=plan ? (db.settings().minimumWithdrawalByPlan[plan.name] ?? 0) : 0;
    if (!db.settings().withdrawalsEnabled) throw new Error("Withdrawals are temporarily unavailable.");
    if (!Number.isInteger(amount) || amount < minimum) throw new Error(`Minimum withdrawal is ${minimum} minor units.`);
    if (amount > wallet.cachedBalance) throw new Error("Amount exceeds your available balance.");
    const now=new Date().toISOString(); const id=`wd_${Date.now()}`;
    const row=db.insert("withdrawals",{id,operatorId,businessId:business.id,walletId:wallet.id,amount,status:"PENDING",requestedAt:now});
    db.update("wallets",wallet.id,{cachedBalance:wallet.cachedBalance-amount,updatedAt:now});
    db.insert("ledgerEntries",{id:`le_wd_${Date.now()}`,walletId:wallet.id,direction:"DEBIT",type:"WITHDRAWAL",amount,referenceType:"WITHDRAWAL",referenceId:id,description:"Withdrawal request",createdAt:now}); return row;
  },
  async deliveries(operatorId: ID) { await delay(350); const {business}=context(operatorId); return db.where("deliveries",row=>row.businessId===business.id).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).map(delivery=>({delivery,order:db.findById("orders",delivery.orderId),customer:db.findById("users",delivery.customerId)})); },
  async findDelivery(operatorId: ID,id:ID) { const rows=await this.deliveries(operatorId); return rows.find(row=>row.delivery.id===id) ?? null; },
  async history(operatorId: ID) { await delay(350); const {business}=context(operatorId); return db.where("orders",row=>row.businessId===business.id&&["COMPLETED","CANCELLED","REFUNDED"].includes(row.status)).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)); },
  async reviews(operatorId: ID) { await delay(350); const {business}=context(operatorId); return db.where("reviews",row=>row.businessId===business.id).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).map(review=>({review,customer:db.findById("users",review.customerId),order:db.findById("orders",review.orderId)})); },
  async findReview(operatorId: ID,id:ID) { const rows=await this.reviews(operatorId); return rows.find(row=>row.review.id===id) ?? null; },
  async profile(operatorId: ID) { await delay(300); const base=context(operatorId); const bank=base.operator.bankAccountId?db.findById("bankAccounts",base.operator.bankAccountId):undefined; return {...base,bank}; },
  async updateProfile(operatorId: ID,input:{firstName:string;lastName:string;phone:string;businessName:string;description:string}) {
    await delay(550); const {user,business}=context(operatorId); if(input.firstName.trim().length<2||input.lastName.trim().length<2||input.phone.trim().length<7) throw new Error("Enter valid contact details."); if(input.businessName.trim().length<3||input.description.trim().length<20) throw new Error("Add a business name and description of at least 20 characters.");
    db.update("users",user.id,{firstName:input.firstName.trim(),lastName:input.lastName.trim(),phone:input.phone.trim()}); db.update("businesses",business.id,{name:input.businessName.trim(),description:input.description.trim()}); return this.profile(operatorId);
  },
  async updateBank(operatorId: ID,input:{bankName:string;accountName:string;accountNumber:string}):Promise<BankAccount> {
    await delay(650); const {operator}=context(operatorId); if(input.bankName.trim().length<3||input.accountName.trim().length<3||!/^\d{8,12}$/.test(input.accountNumber)) throw new Error("Enter valid bank account details.");
    const now=new Date().toISOString(); const existing=operator.bankAccountId?db.findById("bankAccounts",operator.bankAccountId):undefined; const value={operatorId,bankName:input.bankName.trim(),accountName:input.accountName.trim(),accountNumberLast4:input.accountNumber.slice(-4),verified:false,updatedAt:now};
    if(existing)return db.update("bankAccounts",existing.id,value); const bank=db.insert("bankAccounts",{id:`bank_${Date.now()}`,...value}); db.update("operators",operator.id,{bankAccountId:bank.id}); return bank;
  },
  async terminate(operatorId: ID,phrase:string) { await delay(700); if(phrase!=="TERMINATE") throw new Error("Type TERMINATE exactly to continue."); const {operator,user,business}=context(operatorId); db.update("users",user.id,{status:"DELETED"}); db.update("operators",operator.id,{status:"REJECTED"}); db.update("businesses",business.id,{status:"CLOSED",isOpen:false}); return true; },
  async supportArticles() { await delay(250); return db.all("supportArticles"); },
  async findSupportArticle(id:ID) { await delay(250); return db.findById("supportArticles",id) ?? null; },
};
