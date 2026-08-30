import { ConfirmCodeScreen } from "@/features/customer-activity";
export default async function ConfirmCodePage({ searchParams }: { searchParams: Promise<{ code?: string | string[] }> }) { const query = await searchParams; const code = Array.isArray(query.code) ? query.code[0] : query.code; return <ConfirmCodeScreen initialCode={code} />; }
