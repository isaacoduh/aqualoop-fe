import { PlanPayScreen } from "@/features/operator-business";
export default async function PlanPayPage({params}:{params:Promise<{planId:string}>}){const {planId}=await params;return <PlanPayScreen planId={planId}/>}
