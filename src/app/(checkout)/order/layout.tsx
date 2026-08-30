import { CheckoutProvider, CheckoutShell } from "@/features/checkout";

export default function OrderLayout({ children }: LayoutProps<"/order">) {
  return (
    <CheckoutProvider>
      <CheckoutShell>{children}</CheckoutShell>
    </CheckoutProvider>
  );
}
