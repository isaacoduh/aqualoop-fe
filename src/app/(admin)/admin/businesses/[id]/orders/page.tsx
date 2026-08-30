import { BusinessOrdersAdminScreen } from "@/features/admin-accounts";
export default async function BusinessOrdersPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <BusinessOrdersAdminScreen businessId={id}/>}
