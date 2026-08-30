import { WithdrawalDetailScreen } from "@/features/operator-business";
export default async function WithdrawalPage({params}:{params:Promise<{withdrawalId:string}>}){const {withdrawalId}=await params;return <WithdrawalDetailScreen withdrawalId={withdrawalId}/>}
