import { RedemptionAssignedScreen } from "@/features/operator-operations";
export default async function RedemptionAssignedPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) { const { orderId } = await searchParams; return <RedemptionAssignedScreen orderId={orderId} />; }
