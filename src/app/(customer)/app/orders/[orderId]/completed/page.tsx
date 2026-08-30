import { OrderCompletedScreen } from "@/features/customer-activity";
export default async function OrderCompletedPage({ params }: { params: Promise<{ orderId: string }> }) { const { orderId } = await params; return <OrderCompletedScreen orderId={orderId} />; }
