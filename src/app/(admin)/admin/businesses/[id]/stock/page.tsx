import { BusinessStockAdminScreen } from "@/features/admin-accounts";
export default async function BusinessStockPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <BusinessStockAdminScreen businessId={id}/>}
