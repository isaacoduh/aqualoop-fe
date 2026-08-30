import { AssignOrderScreen } from "@/features/operator-operations";
export default async function AssignOperatorOrderPage({ params }: { params: Promise<{ orderId: string }> }) { const { orderId } = await params; return <AssignOrderScreen orderId={orderId} />; }
