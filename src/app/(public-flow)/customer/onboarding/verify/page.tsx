import Link from "next/link";

import { AuthCard, VerificationForm } from "@/features/auth";

export default function CustomerVerifyPage() {
  return (
    <AuthCard
      eyebrow="Customer account - Step 2 of 2"
      title="Verify your contact details"
      description="Enter the code sent to your email address and mobile number to secure your new account."
      footer={<Link href="/customer/onboarding/details" className="font-semibold text-primary hover:text-primary-hover">Change account details</Link>}
    >
      <VerificationForm flow="customer" />
    </AuthCard>
  );
}
