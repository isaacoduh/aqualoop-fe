import { BusinessProfileAdminScreen } from "@/features/admin-accounts";
export default async function BusinessProfilePage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <BusinessProfileAdminScreen businessId={id}/>}
