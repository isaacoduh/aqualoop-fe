import { PlanDetailScreen } from "@/features/operator-business";
export default async function PlanPage({params}:{params:Promise<{planId:string}>}){const {planId}=await params;return <PlanDetailScreen planId={planId}/>}
