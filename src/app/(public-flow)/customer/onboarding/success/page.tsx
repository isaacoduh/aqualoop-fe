import { SuccessPanel } from "@/features/auth";

export default function CustomerOnboardingSuccessPage() {
  return (
    <SuccessPanel
      eyebrow="Contact details verified"
      title="Your customer profile is ready"
      description="Your email address and mobile number are verified. Activate the account to start using AquaLoop."
      actionLabel="Activate my account"
      actionHref="/customer/onboarding/activated"
    />
  );
}
