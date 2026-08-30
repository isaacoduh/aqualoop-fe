import { db, delay } from "@/data/mock-db/db";
import type { ID, SupportArticle, User } from "@/domain/types";

export const customerAccountRepository = {
  async findProfile(customerId: ID): Promise<User | null> {
    await delay(350);
    const user = db.findById("users", customerId);
    return user?.role === "CUSTOMER" ? user : null;
  },

  async updateProfile(
    customerId: ID,
    input: Pick<User, "firstName" | "lastName" | "email" | "phone">,
  ): Promise<User> {
    await delay(550);
    const user = db.findById("users", customerId);
    if (!user || user.role !== "CUSTOMER") throw new Error("Customer profile not found.");
    const email = input.email.trim().toLowerCase();
    const duplicateEmail = db.where("users", (candidate) => candidate.id !== customerId && candidate.email.toLowerCase() === email).length > 0;
    if (duplicateEmail) throw new Error("That email address is already in use.");
    return db.update("users", customerId, {
      firstName: input.firstName.trim(), lastName: input.lastName.trim(), email,
      phone: input.phone.trim(),
      isEmailVerified: email === user.email ? user.isEmailVerified : false,
      isPhoneVerified: input.phone.trim() === user.phone ? user.isPhoneVerified : false,
    });
  },

  async listSupportArticles(): Promise<SupportArticle[]> {
    await delay(350);
    return db.all("supportArticles");
  },

  async findSupportArticle(articleId: ID): Promise<SupportArticle | null> {
    await delay(300);
    return db.findById("supportArticles", articleId) ?? null;
  },

  async contactSupport(customerId: ID, input: { subject: string; message: string }): Promise<string> {
    await delay(650);
    const user = db.findById("users", customerId);
    if (!user || user.role !== "CUSTOMER") throw new Error("Customer profile not found.");
    const reference = `SUP-${String(Date.now()).slice(-6)}`;
    db.insert("notifications", {
      id: `not_support_${Date.now()}`,
      userId: customerId,
      title: "Support request received",
      body: `${reference}: ${input.subject.trim()}. We will respond to ${user.email}.`,
      channel: "IN_APP",
      type: "SYSTEM",
      read: false,
      createdAt: new Date().toISOString(),
    });
    return reference;
  },
};
