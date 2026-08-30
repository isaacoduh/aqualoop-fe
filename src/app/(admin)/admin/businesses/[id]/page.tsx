import { BusinessOverviewAdminScreen } from "@/features/admin-accounts";
export default async function BusinessPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <BusinessOverviewAdminScreen businessId={id}/>}
