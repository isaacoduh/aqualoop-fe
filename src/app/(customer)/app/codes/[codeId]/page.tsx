import { CodeDetailScreen } from "@/features/customer-activity";
export default async function CodeDetailPage({ params }: { params: Promise<{ codeId: string }> }) { const { codeId } = await params; return <CodeDetailScreen codeId={codeId} />; }
