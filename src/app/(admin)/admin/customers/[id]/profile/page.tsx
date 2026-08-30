import { CustomerProfileAdminScreen } from "@/features/admin-accounts";
export default async function CustomerProfilePage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <CustomerProfileAdminScreen customerId={id}/>}
