import { db, delay } from "@/data/mock-db/db";
import type { AdminUser, ID, PlatformSettings } from "@/domain/types";
import { CURRENT_ADMIN_ID, currentAdmin, requireAdminPermission } from "@/data/mock-db/repositories/admin-authorization";

type PermissionAction="create"|"read"|"update"|"delete";
function validate(settings:PlatformSettings){
  if(settings.platformName.trim().length<3)throw new Error("Platform name must have at least 3 characters.");
  if(!/^\S+@\S+\.\S+$/.test(settings.supportEmail))throw new Error("Enter a valid support email address.");
  const positive:[number,string][]=[[settings.maxCustomerAddresses,"Maximum addresses"],[settings.maxOrderQuantity,"Maximum order quantity"],[settings.cancellationWindowMinutes,"Cancellation window"],[settings.maxRolloverQuantity,"Maximum rollover quantity"],[settings.rolloverWindowDays,"Rollover window"],[settings.confirmationCodeLifetimeMinutes,"Code lifetime"],[settings.maxFailedLoginAttempts,"Failed login attempts"],[settings.accountLockoutMinutes,"Account lockout"],[settings.minimumPasswordLength,"Minimum password length"],[settings.maxDeliveryRadiusKm,"Maximum delivery radius"],[settings.withdrawalProcessingDays,"Withdrawal processing days"]];
  const invalid=positive.find(([value])=>!Number.isFinite(value)||value<1);if(invalid)throw new Error(`${invalid[1]} must be at least 1.`);
  if(settings.minimumPasswordLength<10)throw new Error("Minimum password length cannot be below 10.");
  if(!db.findById("plans",settings.defaultPlanId))throw new Error("Choose an existing default plan.");
}

export const adminSettingsRepository={
  async overview(){await delay(250);return {settings:db.settings(),admin:currentAdmin(),permissions:db.permissions(),plans:db.all("plans")};},
  async update(patch:Partial<PlatformSettings>){await delay(500);requireAdminPermission("update");const next={...db.settings(),...patch};validate(next);return db.updateSettings(patch);},
  async admins(){await delay(300);return {current:currentAdmin(),rows:db.all("admins").sort((a,b)=>a.name.localeCompare(b.name)),permissions:db.permissions()};},
  async updateAdmin(id:ID,patch:{role?:AdminUser["role"];status?:AdminUser["status"]}){await delay(550);requireAdminPermission(patch.status&&patch.status!=="ACTIVE"?"delete":"update");if(id===CURRENT_ADMIN_ID)throw new Error("You cannot change your own role or access status from this screen.");const target=db.findById("admins",id);if(!target)throw new Error("Admin account not found.");if(patch.status&&!["ACTIVE","SUSPENDED"].includes(patch.status))throw new Error("Unsupported admin status.");return db.update("admins",id,patch);},
  async updatePermission(role:AdminUser["role"],action:PermissionAction,enabled:boolean){await delay(450);const admin=requireAdminPermission("delete");if(admin.role!=="SUPER_ADMIN")throw new Error("Only a super admin can edit role permissions.");if(role==="SUPER_ADMIN")throw new Error("Super admin permissions are protected.");return db.updatePermissions(role,{[action]:enabled});},
  async savePlanPolicy(planId:ID,minimumAmount:number){await delay(500);requireAdminPermission("update");const plan=db.findById("plans",planId);if(!plan)throw new Error("Plan not found.");if(!Number.isInteger(minimumAmount)||minimumAmount<0)throw new Error("Minimum withdrawal must be a non-negative amount.");const current=db.settings();return db.updateSettings({minimumWithdrawalByPlan:{...current.minimumWithdrawalByPlan,[plan.name]:minimumAmount}});},
  async resetDemo(){await delay(650);requireAdminPermission("delete");db.reset();return {settings:db.settings(),admin:currentAdmin()};},
};
