import { OperatorOverviewAdminScreen } from "@/features/admin-accounts";
export default async function OperatorPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <OperatorOverviewAdminScreen operatorId={id}/>}
