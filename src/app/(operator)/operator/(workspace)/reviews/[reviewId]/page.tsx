import { ReviewDetailScreen } from "@/features/operator-business";
export default async function ReviewPage({params}:{params:Promise<{reviewId:string}>}){const {reviewId}=await params;return <ReviewDetailScreen reviewId={reviewId}/>}
