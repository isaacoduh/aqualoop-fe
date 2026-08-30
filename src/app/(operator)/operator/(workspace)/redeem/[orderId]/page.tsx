import { RedemptionDetailScreen } from "@/features/operator-operations";
export default async function RedemptionPage({ params }: { params: Promise<{ orderId: string }> }) { const { orderId } = await params; return <RedemptionDetailScreen orderId={orderId} />; }
