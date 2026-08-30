import { BusinessRatingsAdminScreen } from "@/features/admin-accounts";
export default async function BusinessRatingsPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <BusinessRatingsAdminScreen businessId={id}/>}
