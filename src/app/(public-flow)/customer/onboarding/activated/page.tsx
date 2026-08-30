import { SuccessPanel } from "@/features/auth";

export default function CustomerOnboardingActivatedPage() {
  return (
    <SuccessPanel
      eyebrow="Welcome aboard"
      title="You are ready to refill"
      description="Discover verified refill businesses, compare products, and place your first pickup or delivery order."
      actionLabel="Explore nearby businesses"
      actionHref="/app"
      secondaryLabel="Go to sign in"
      secondaryHref="/auth/sign-in"
    />
  );
}
