import { BusinessDeliveriesAdminScreen } from "@/features/admin-accounts";
export default async function BusinessDeliveriesPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <BusinessDeliveriesAdminScreen businessId={id}/>}
