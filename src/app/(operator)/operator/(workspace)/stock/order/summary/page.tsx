import { StockOrderSummaryScreen } from "@/features/operator-operations";
export default async function StockOrderSummaryPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) { return <StockOrderSummaryScreen values={await searchParams} />; }
