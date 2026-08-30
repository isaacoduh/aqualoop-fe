import { EditAddressProfileScreen } from "@/features/customer-account";
export default async function EditAddressPage({params}:{params:Promise<{addressId:string}>}){const {addressId}=await params;return <EditAddressProfileScreen addressId={addressId}/>}
