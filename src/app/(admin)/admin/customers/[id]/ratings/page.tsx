import { CustomerRatingsAdminScreen } from "@/features/admin-accounts";
export default async function CustomerRatingsPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <CustomerRatingsAdminScreen customerId={id}/>}
