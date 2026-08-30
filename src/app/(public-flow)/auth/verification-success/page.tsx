import { SuccessPanel } from "@/features/auth";

export default function VerificationSuccessPage() {
  return (
    <SuccessPanel
      eyebrow="Verification complete"
      title="Your details are verified"
      description="AquaLoop has confirmed your account details. One final step will activate your account."
      actionLabel="Activate account"
      actionHref="/auth/account-activated"
      secondaryLabel="Return to sign in"
      secondaryHref="/auth/sign-in"
    />
  );
}
