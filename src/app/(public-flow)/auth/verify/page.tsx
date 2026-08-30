import { AuthCard, VerificationForm } from "@/features/auth";

export default function VerifyPage() {
  return (
    <AuthCard
      eyebrow="Security check"
      title="Verify your account"
      description="Enter the code sent to the email address and phone number associated with your account."
    >
      <VerificationForm flow="auth" />
    </AuthCard>
  );
}
