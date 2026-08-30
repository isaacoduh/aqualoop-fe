import Link from "next/link";

import { AccountTypeChoice, AuthCard } from "@/features/auth";

export default function SignUpPage() {
  return (
    <AuthCard
      eyebrow="Join AquaLoop"
      title="How will you use AquaLoop?"
      description="Choose an account type. You can manage only one role with each demo account."
      footer={<>Already have an account? <Link href="/auth/sign-in" className="font-semibold text-primary hover:text-primary-hover">Sign in</Link></>}
      className="max-w-2xl"
    >
      <AccountTypeChoice />
    </AuthCard>
  );
}
