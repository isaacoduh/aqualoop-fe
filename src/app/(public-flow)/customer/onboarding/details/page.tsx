import Link from "next/link";

import { AuthCard, CustomerDetailsForm } from "@/features/auth";

export default function CustomerDetailsPage() {
  return (
    <AuthCard
      eyebrow="Customer account - Step 1 of 2"
      title="Tell us about yourself"
      description="These details identify your orders, deliveries, and confirmation codes."
      footer={<>Already registered? <Link href="/auth/sign-in" className="font-semibold text-primary hover:text-primary-hover">Sign in</Link></>}
      className="max-w-2xl"
    >
      <CustomerDetailsForm />
    </AuthCard>
  );
}
