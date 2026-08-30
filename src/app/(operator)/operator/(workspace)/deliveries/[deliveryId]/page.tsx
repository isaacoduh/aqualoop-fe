import { DeliveryDetailScreen } from "@/features/operator-business";
export default async function DeliveryPage({params}:{params:Promise<{deliveryId:string}>}){const {deliveryId}=await params;return <DeliveryDetailScreen deliveryId={deliveryId}/>}
