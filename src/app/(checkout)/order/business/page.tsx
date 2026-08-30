import { BusinessSelectionScreen } from "@/features/checkout";

export default async function OrderBusinessPage({
  searchParams,
}: {
  searchParams: Promise<{ businessId?: string | string[] }>;
}) {
  const query = await searchParams;
  const highlightedBusinessId = Array.isArray(query.businessId)
    ? query.businessId[0]
    : query.businessId;

  return <BusinessSelectionScreen highlightedBusinessId={highlightedBusinessId} />;
}
