import type { SupportArticle } from "@/domain/types";

export const supportArticles: SupportArticle[] = [
  {
    id: "sup_001",
    category: "GETTING_STARTED",
    title: "How bottle exchange works",
    summary: "Understand refills, exchanges, deposits and empty bottle returns.",
    body: "Choose an eligible exchange product, return the expected empty bottle at hand-off, and the business records the return during fulfilment."
  },
  {
    id: "sup_002",
    category: "PAYMENTS",
    title: "A payment is pending",
    summary: "What to do when a card payment has not completed.",
    body: "Keep the order open while payment status is being confirmed, and do not submit a duplicate payment. AquaLoop refreshes the status automatically; contact support if it remains pending."
  },
  {
    id: "sup_003",
    category: "DELIVERY",
    title: "My delivery is late",
    summary: "Track a delayed delivery and contact support.",
    body: "Check the latest delivery status and ETA. If the order is beyond its promised window, contact support with the order number."
  },
  {
    id: "sup_004",
    category: "ACCOUNT",
    title: "Update your account details",
    summary: "Change profile information and saved addresses.",
    body: "Profile and address changes are managed independently so delivery addresses can be reused across orders."
  }
];
