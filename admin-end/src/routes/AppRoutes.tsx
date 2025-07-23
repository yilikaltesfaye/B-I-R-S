import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { LoginPage } from "@/pages/LoginPage";
import { UnauthorizedPage } from "@/pages/UnauthorizedPage";
import { UsersPage } from "@/pages/UsersPage";
import { AuthoritiesPage } from "@/pages/AuthoritiesPage";
import { CategoriesPage } from "@/pages/CategoriesPage";
import { ReportsPage } from "@/pages/ReportsPage";

export const AppRoutes: React.FC = () => {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	if (!user) {
		return (
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		);
	}

	return (
		<Routes>
			<Route path="/login" element={<Navigate to="/" replace />} />
			<Route path="/unauthorized" element={<UnauthorizedPage />} />
			<Route path="/" element={<Layout />}>
				<Route index element={<Dashboard />} />
				<Route path="users" element={<UsersPage />} />
				<Route path="authorities" element={<AuthoritiesPage />} />
				<Route path="categories" element={<CategoriesPage />} />
				<Route path="reports" element={<ReportsPage />} />
			</Route>
		</Routes>
	);
};
