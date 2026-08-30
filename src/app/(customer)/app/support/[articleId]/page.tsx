import { SupportArticleScreen } from "@/features/customer-account";
export default async function SupportArticlePage({params}:{params:Promise<{articleId:string}>}){const {articleId}=await params;return <SupportArticleScreen articleId={articleId}/>}
