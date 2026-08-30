import { BusinessEarningsAdminScreen } from "@/features/admin-accounts";
export default async function BusinessEarningsPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <BusinessEarningsAdminScreen businessId={id}/>}
