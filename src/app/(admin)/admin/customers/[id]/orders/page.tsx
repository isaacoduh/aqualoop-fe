import { CustomerOrdersAdminScreen } from "@/features/admin-accounts";
export default async function CustomerOrdersPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <CustomerOrdersAdminScreen customerId={id}/>}
