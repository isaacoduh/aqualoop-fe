import { StockOrderSuccessScreen } from "@/features/operator-operations";
export default async function StockOrderSuccessPage({ searchParams }: { searchParams: Promise<{ units?: string; reference?: string }> }) { const { units, reference } = await searchParams; return <StockOrderSuccessScreen units={units} reference={reference} />; }
