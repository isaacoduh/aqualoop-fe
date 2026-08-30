import { BusinessDetail } from "@/features/discovery";

export default async function BusinessDetailPage({
  params,
}: PageProps<"/app/businesses/[businessId]">) {
  const { businessId } = await params;

  return <BusinessDetail businessId={businessId} />;
}
