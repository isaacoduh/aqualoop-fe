import Link from "next/link";

import { AuthCard, ResetPasswordForm } from "@/features/auth";

export default function ResetPasswordPage() {
  return (
    <AuthCard
      eyebrow="Account recovery"
      title="Choose a new password"
      description="Create a strong password you have not used for this account before."
      footer={<Link href="/auth/sign-in" className="font-semibold text-primary hover:text-primary-hover">Cancel and return to sign in</Link>}
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
