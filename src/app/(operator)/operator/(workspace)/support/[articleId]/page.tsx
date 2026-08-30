import { OperatorSupportArticleScreen } from "@/features/operator-business";
export default async function SupportArticlePage({params}:{params:Promise<{articleId:string}>}){const {articleId}=await params;return <OperatorSupportArticleScreen articleId={articleId}/>}
