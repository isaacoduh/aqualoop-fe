import { OperatorProfileAdminScreen } from "@/features/admin-accounts";
export default async function OperatorProfilePage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <OperatorProfileAdminScreen operatorId={id}/>}
