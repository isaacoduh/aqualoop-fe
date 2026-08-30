import { ProductFormScreen } from "@/features/admin-operations";
export default async function EditProductPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <ProductFormScreen productId={id}/>}
