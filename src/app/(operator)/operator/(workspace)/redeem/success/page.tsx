import { RedemptionSuccessScreen } from "@/features/operator-operations";
export default async function RedemptionSuccessPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) { const { orderId } = await searchParams; return <RedemptionSuccessScreen orderId={orderId} />; }
