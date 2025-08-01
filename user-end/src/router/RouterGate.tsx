import { useAuth } from "@/contexts/AuthContext";
import type { ReactNode } from "react";

const RouterGate = ({ children }: { children: ReactNode }) => {
	const { isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	return <>{children}</>;
};

export default RouterGate;
