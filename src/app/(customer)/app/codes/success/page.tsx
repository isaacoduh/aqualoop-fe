import { CodeSuccessScreen } from "@/features/customer-activity";
export default async function CodeSuccessPage({ searchParams }: { searchParams: Promise<{ orderId?: string | string[] }> }) { const query = await searchParams; const orderId = Array.isArray(query.orderId) ? query.orderId[0] : query.orderId; return <CodeSuccessScreen orderId={orderId} />; }
