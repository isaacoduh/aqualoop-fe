import { PurchaseHistoryDetailScreen } from "@/features/customer-activity";
export default async function PurchaseHistoryDetailPage({ params }: { params: Promise<{ purchaseId: string }> }) { const { purchaseId } = await params; return <PurchaseHistoryDetailScreen purchaseId={purchaseId} />; }
