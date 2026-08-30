import { PlanSuccessScreen } from "@/features/operator-business";
export default async function PlanSuccessPage({searchParams}:{searchParams:Promise<{reference?:string}>}){const {reference}=await searchParams;return <PlanSuccessScreen reference={reference}/>}
