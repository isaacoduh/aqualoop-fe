import Link from "next/link";

import { AuthCard, ForgotPasswordForm } from "@/features/auth";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter your account email or phone number. We will send instructions if it matches an account."
      footer={<Link href="/auth/sign-in" className="font-semibold text-primary hover:text-primary-hover">Back to sign in</Link>}
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
