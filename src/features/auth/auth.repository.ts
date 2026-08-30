import "client-only";

import { db, delay } from "@/data/mock-db/db";
import type { User, UserRole } from "@/domain/types";

export const DEMO_PASSWORD = "AquaLoop123!";
export const DEMO_VERIFICATION_CODE = "246810";

export type SignInResult =
  | { status: "authenticated"; user: User }
  | { status: "verification-required"; user: User };

export interface CustomerRegistrationInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export class AuthError extends Error {
  constructor(
    message: string,
    readonly code:
      | "INVALID_CREDENTIALS"
      | "ACCOUNT_RESTRICTED"
      | "DUPLICATE_ACCOUNT"
      | "INVALID_CODE",
  ) {
    super(message);
    this.name = "AuthError";
  }
}

function destinationForRole(role: UserRole): string {
  if (role === "OPERATOR") return "/operator";
  if (role === "ADMIN" || role === "SUPER_ADMIN") return "/admin";
  return "/app";
}

export const authRepository = {
  async signIn(identity: string, password: string): Promise<SignInResult> {
    await delay(700);

    const normalizedIdentity = identity.trim().toLowerCase();
    const user = db.all("users").find(
      (candidate) =>
        candidate.email.toLowerCase() === normalizedIdentity ||
        candidate.phone.replaceAll(" ", "") === identity.replaceAll(" ", ""),
    );

    if (!user || password !== DEMO_PASSWORD) {
      throw new AuthError(
        "Those credentials do not match an AquaLoop account.",
        "INVALID_CREDENTIALS",
      );
    }

    if (["SUSPENDED", "BLOCKED", "DELETED"].includes(user.status)) {
      throw new AuthError(
        "This account cannot sign in right now. Contact AquaLoop support.",
        "ACCOUNT_RESTRICTED",
      );
    }

    if (
      user.status === "PENDING" ||
      !user.isEmailVerified ||
      !user.isPhoneVerified
    ) {
      return { status: "verification-required", user };
    }

    const updatedUser = db.update("users", user.id, {
      lastLoginAt: new Date().toISOString(),
    });

    return { status: "authenticated", user: updatedUser };
  },

  async requestPasswordReset(_identity: string): Promise<void> {
    void _identity;
    await delay(700);
  },

  async resetPassword(_password: string): Promise<void> {
    void _password;
    await delay(700);
  },

  async registerCustomer(
    input: CustomerRegistrationInput,
  ): Promise<User> {
    await delay(800);

    const email = input.email.trim().toLowerCase();
    const phone = input.phone.replaceAll(" ", "");
    const duplicate = db.all("users").some(
      (user) =>
        user.email.toLowerCase() === email ||
        user.phone.replaceAll(" ", "") === phone,
    );

    if (duplicate) {
      throw new AuthError(
        "An account already exists with that email address or phone number.",
        "DUPLICATE_ACCOUNT",
      );
    }

    return db.insert("users", {
      id: `usr_demo_${Date.now()}`,
      role: "CUSTOMER",
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email,
      phone,
      status: "PENDING",
      isEmailVerified: false,
      isPhoneVerified: false,
      createdAt: new Date().toISOString(),
    });
  },

  async verifyAccount(userId: string | null, code: string): Promise<User> {
    await delay(650);

    if (code !== DEMO_VERIFICATION_CODE) {
      throw new AuthError(
        "That verification code is incorrect or has expired.",
        "INVALID_CODE",
      );
    }

    const fallbackUser = db.findById("users", "usr_001");
    const user = userId ? db.findById("users", userId) : fallbackUser;

    if (!user) {
      throw new AuthError(
        "We could not find the account for this verification request.",
        "INVALID_CODE",
      );
    }

    return db.update("users", user.id, {
      status: "ACTIVE",
      isEmailVerified: true,
      isPhoneVerified: true,
    });
  },

  destinationForRole,
};
