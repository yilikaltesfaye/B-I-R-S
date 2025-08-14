import { createBrowserRouter, Navigate } from "react-router";
import ProtectedRoute from "./ProtectedRoutes";
import RouterGate from "./RouterGate";
import Layout from "../components/Layout";

// Public pages
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";
import UnauthorizedPage from "../pages/public/UnauthorizedPage";

// Protected pages
import Dashboard from "../pages/protected/Dashboard";
import UsersPage from "../pages/protected/UsersPage";
import AuthoritiesPage from "../pages/protected/AuthoritiesPage";
import ReportsPage from "../pages/protected/ReportsPage";
import CategoriesPage from "../pages/protected/CategoriesPage";
import SettingsPage from "../pages/protected/SettingsPage";

export const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<RouterGate>
				<Navigate to="/login" replace />
			</RouterGate>
		),
	},
	{
		path: "/login",
		element: (
			<RouterGate>
				<LoginPage />
			</RouterGate>
		),
	},
	{
		path: "/register",
		element: (
			<RouterGate>
				<RegisterPage />
			</RouterGate>
		),
	},
	{
		path: "/unauthorized",
		element: <UnauthorizedPage />,
	},
	{
		path: "/dashboard",
		element: (
			<ProtectedRoute>
				<Layout>
					<Dashboard />
				</Layout>
			</ProtectedRoute>
		),
	},
	{
		path: "/users",
		element: (
			<ProtectedRoute>
				<Layout>
					<UsersPage />
				</Layout>
			</ProtectedRoute>
		),
	},
	{
		path: "/authorities",
		element: (
			<ProtectedRoute>
				<Layout>
					<AuthoritiesPage />
				</Layout>
			</ProtectedRoute>
		),
	},
	{
		path: "/reports",
		element: (
			<ProtectedRoute>
				<Layout>
					<ReportsPage />
				</Layout>
			</ProtectedRoute>
		),
	},
	{
		path: "/categories",
		element: (
			<ProtectedRoute>
				<Layout>
					<CategoriesPage />
				</Layout>
			</ProtectedRoute>
		),
	},
	{
		path: "/settings",
		element: (
			<ProtectedRoute>
				<Layout>
					<SettingsPage />
				</Layout>
			</ProtectedRoute>
		),
	},
	{
		path: "*",
		element: <Navigate to="/dashboard" replace />,
	},
]);
