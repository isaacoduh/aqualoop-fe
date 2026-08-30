import { SuccessPanel } from "@/features/auth";

export default function AccountActivatedPage() {
  return (
    <SuccessPanel
      eyebrow="Account active"
      title="Welcome to AquaLoop"
      description="Your account is ready. Sign in to find nearby refill businesses and manage your water orders."
      actionLabel="Continue to sign in"
      actionHref="/auth/sign-in"
      secondaryLabel="Back to AquaLoop home"
      secondaryHref="/"
    />
  );
}
