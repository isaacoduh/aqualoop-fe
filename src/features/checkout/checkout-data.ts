import type { CheckoutCatalog } from "@/data/mock-db/repositories/checkout.repository";
import type { CheckoutDraft } from "@/features/checkout/checkout-provider";

export function selectedCatalogItems(
  draft: CheckoutDraft,
  catalog: CheckoutCatalog,
) {
  return catalog.items.flatMap((item) => {
    const quantity = draft.quantities[item.product.id] ?? 0;
    return quantity > 0 ? [{ ...item, quantity }] : [];
  });
}

export function checkoutTotals(
  draft: CheckoutDraft,
  catalog: CheckoutCatalog,
) {
  const items = selectedCatalogItems(draft, catalog);
  const subtotal = items.reduce(
    (sum, item) => sum + item.listing.price * item.quantity,
    0,
  );
  const depositAmount = items.reduce(
    (sum, item) => sum + item.listing.depositAmount * item.quantity,
    0,
  );
  const deliveryFee = draft.fulfilmentMode === "DELIVERY" ? 1200 : 0;
  return {
    items,
    subtotal,
    depositAmount,
    deliveryFee,
    discount: 0,
    total: subtotal + depositAmount + deliveryFee,
  };
}
