import { CancelOrderScreen } from "@/features/customer-activity";
export default async function CancelOrderPage({ params }: { params: Promise<{ orderId: string }> }) { const { orderId } = await params; return <CancelOrderScreen orderId={orderId} />; }
