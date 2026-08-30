import { BusinessSubmittedScreen } from "@/features/operator-onboarding";
export default async function BusinessSubmittedPage({searchParams}:{searchParams:Promise<{state?:string|string[]}>}){const query=await searchParams;const raw=Array.isArray(query.state)?query.state[0]:query.state;const state=raw==="approved"||raw==="rejected"?raw:"pending";return <BusinessSubmittedScreen preview={state}/>}
