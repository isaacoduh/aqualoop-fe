import { PlanFormScreen } from "@/features/admin-operations";
export default async function EditPlanPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <PlanFormScreen planId={id}/>}
