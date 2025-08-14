import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";

interface RouterGateProps {
	children: React.ReactNode;
}

const RouterGate = ({ children }: RouterGateProps) => {
	const { user, isLoading, role } = useAuth();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<LoadingSpinner size="lg" />
					<p className="mt-4 text-gray-600">Initializing...</p>
				</div>
			</div>
		);
	}

	// If user is logged in and is admin, redirect to dashboard
	if (user && role === "ADMIN" as any) {
		return <Navigate to="/dashboard" replace />;
	}

	return <>{children}</>;
};

export default RouterGate;
