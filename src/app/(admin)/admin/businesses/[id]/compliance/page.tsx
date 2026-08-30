import { BusinessComplianceAdminScreen } from "@/features/admin-accounts";
export default async function BusinessCompliancePage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <BusinessComplianceAdminScreen businessId={id}/>}
