import Link from "next/link";

import { AuthCard, SignInForm } from "@/features/auth";

export default function SignInPage() {
  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Sign in to AquaLoop"
      description="Access your orders, refill businesses, confirmation codes, and account."
      footer={<>New to AquaLoop? <Link href="/auth/sign-up" className="font-semibold text-primary hover:text-primary-hover">Create an account</Link></>}
    >
      <SignInForm />
    </AuthCard>
  );
}
