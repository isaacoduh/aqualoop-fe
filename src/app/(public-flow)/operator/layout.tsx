import { OperatorOnboardingProvider, OperatorFlowProgress } from "@/features/operator-onboarding";

export default function OperatorApplicationLayout({children}:{children:React.ReactNode}){return <OperatorOnboardingProvider><OperatorFlowProgress/>{children}</OperatorOnboardingProvider>}
