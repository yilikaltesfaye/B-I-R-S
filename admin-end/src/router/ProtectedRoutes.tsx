import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const { user, isLoading, role } = useAuth();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<LoadingSpinner size="lg" />
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	// Only allow ADMIN role
	if (role !== "ADMIN" as any) {
		return <Navigate to="/unauthorized" replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
