import { db } from "@/data/mock-db/db";
import type { AdminPermission, AdminUser } from "@/domain/types";

export const CURRENT_ADMIN_ID="adm_001";

export function currentAdmin():AdminUser{
  const admin=db.findById("admins",CURRENT_ADMIN_ID);
  if(!admin||admin.status!=="ACTIVE")throw new Error("The current admin account is unavailable.");
  return admin;
}

export function requireAdminPermission(action:keyof AdminPermission):AdminUser{
  const admin=currentAdmin();
  if(!db.permissions()[admin.role][action])throw new Error(`Your ${admin.role.toLowerCase().replaceAll("_"," ")} role cannot ${action} this record.`);
  return admin;
}
