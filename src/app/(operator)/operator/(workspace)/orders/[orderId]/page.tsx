import { OperatorOrderDetailScreen } from "@/features/operator-operations";
export default async function OperatorOrderPage({ params }: { params: Promise<{ orderId: string }> }) { const { orderId } = await params; return <OperatorOrderDetailScreen orderId={orderId} />; }
