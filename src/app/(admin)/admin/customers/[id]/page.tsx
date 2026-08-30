import { CustomerOverviewScreen } from "@/features/admin-accounts";
export default async function CustomerPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <CustomerOverviewScreen customerId={id}/>}
