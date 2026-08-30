import { ReviewOrderScreen } from "@/features/customer-activity";
export default async function ReviewOrderPage({ params }: { params: Promise<{ orderId: string }> }) { const { orderId } = await params; return <ReviewOrderScreen orderId={orderId} />; }
