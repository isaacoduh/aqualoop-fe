import "client-only";

import * as seed from "@/data/mock-db/seeds";
import type {
  Address,
  AdminPermissionMap,
  AdminUser,
  Business,
  BusinessProduct,
  ConfirmationCode,
  Delivery,
  ID,
  Inventory,
  InventoryMovement,
  LedgerEntry,
  Notification,
  Operator,
  Order,
  OrderItem,
  Payment,
  PaymentMethod,
  Plan,
  PlatformSettings,
  Product,
  Review,
  SupportArticle,
  User,
  VerificationRequest,
  Wallet,
  Withdrawal,
} from "@/domain/types";

const clone = <T>(value: T): T => structuredClone(value);

type TableMap = {
  users: User[];
  addresses: Address[];
  operators: Operator[];
  businesses: Business[];
  products: Product[];
  businessProducts: BusinessProduct[];
  inventories: Inventory[];
  inventoryMovements: InventoryMovement[];
  orders: Order[];
  orderItems: OrderItem[];
  payments: Payment[];
  paymentMethods: PaymentMethod[];
  wallets: Wallet[];
  ledgerEntries: LedgerEntry[];
  confirmationCodes: ConfirmationCode[];
  deliveries: Delivery[];
  reviews: Review[];
  notifications: Notification[];
  withdrawals: Withdrawal[];
  plans: Plan[];
  verificationRequests: VerificationRequest[];
  admins: AdminUser[];
  supportArticles: SupportArticle[];
};

type TableName = keyof TableMap;
type TableRow<K extends TableName> = TableMap[K][number];

interface DatabaseState {
  tables: TableMap;
  platformSettings: PlatformSettings;
  adminPermissions: AdminPermissionMap;
}

class MemoryDatabase {
  private state: DatabaseState;

  constructor() {
    this.state = this.createSeedState();
  }

  private createSeedState(): DatabaseState {
    return clone({
      tables: {
        users: seed.users,
        addresses: seed.addresses,
        operators: seed.operators,
        businesses: seed.businesses,
        products: seed.products,
        businessProducts: seed.businessProducts,
        inventories: seed.inventories,
        inventoryMovements: seed.inventoryMovements,
        orders: seed.orders,
        orderItems: seed.orderItems,
        payments: seed.payments,
        paymentMethods: seed.paymentMethods,
        wallets: seed.wallets,
        ledgerEntries: seed.ledgerEntries,
        confirmationCodes: seed.confirmationCodes,
        deliveries: seed.deliveries,
        reviews: seed.reviews,
        notifications: seed.notifications,
        withdrawals: seed.withdrawals,
        plans: seed.plans,
        verificationRequests: seed.verificationRequests,
        admins: seed.admins,
        supportArticles: seed.supportArticles,
      },
      platformSettings: seed.platformSettings,
      adminPermissions: seed.adminPermissions,
    });
  }

  private table<K extends TableName>(name: K): Array<TableRow<K>> {
    // TableMap guarantees this relationship. Keep the assertion internal.
    return this.state.tables[name] as unknown as Array<TableRow<K>>;
  }

  reset(): void {
    this.state = this.createSeedState();
  }

  all<K extends TableName>(name: K): TableMap[K] {
    return clone(this.state.tables[name]);
  }

  findById<K extends TableName>(
    name: K,
    id: ID,
  ): TableRow<K> | undefined {
    const row = this.table(name).find((candidate) => candidate.id === id);

    return row ? clone(row) : undefined;
  }

  where<K extends TableName>(
    name: K,
    predicate: (row: TableRow<K>) => boolean,
  ): TableMap[K] {
    return clone(this.table(name).filter(predicate)) as TableMap[K];
  }

  insert<K extends TableName>(
    name: K,
    value: TableRow<K>,
  ): TableRow<K> {
    const stored = clone(value);

    this.table(name).push(stored);

    return clone(stored);
  }

  update<K extends TableName>(
    name: K,
    id: ID,
    patch: Partial<Omit<TableRow<K>, "id">>,
  ): TableRow<K> {
    const rows = this.table(name);
    const index = rows.findIndex((row) => row.id === id);

    if (index < 0) {
      throw new Error(`${String(name)}:${id} not found`);
    }

    const updated = {
      ...rows[index],
      ...clone(patch),
    } as TableRow<K>;

    rows[index] = updated;

    return clone(updated);
  }

  settings(): PlatformSettings {
    return clone(this.state.platformSettings);
  }

  updateSettings(
    patch: Partial<PlatformSettings>,
  ): PlatformSettings {
    this.state.platformSettings = {
      ...this.state.platformSettings,
      ...clone(patch),
    };

    return clone(this.state.platformSettings);
  }

  permissions(): AdminPermissionMap {
    return clone(this.state.adminPermissions);
  }
}

export const db = new MemoryDatabase();

export function delay(milliseconds = 250): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
