import { createBrowserRouter } from "react-router";
import ProtectectRoutes from "./ProtectectRoutes.tsx";
import RouterGate from "./RouterGate.tsx";
import HomePage from "../pages/public/HomePage.tsx";
import Dashboard from "../pages/Protected/Dashboard";
import Analytics from "../pages/Protected/Analytics";
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";
import ErrorPage from "../common/ErrorPage.tsx";
import ReportDetail from "../pages/Protected/ReportDetail.tsx";
import SettingPage from "../pages/Protected/Setting.tsx";
import LogoutPage from "../pages/public/LogoutPage.tsx";

const router = createBrowserRouter([
	{ path: "/", Component: HomePage },
	{ path: "/login", Component: LoginPage },
	{ path: "/register", Component: RegisterPage },
	{ path: "/logout", Component: LogoutPage },
	{
		element: (
			<RouterGate>
				<ProtectectRoutes />
			</RouterGate>
		),
		children: [
			{ path: "/dashboard", Component: Dashboard },
			// { path: "/reports", element: <Navigate to="/dashboard" replace /> },
			{ path: "/reports/:id", Component: ReportDetail },
			{ path: "/analytics", Component: Analytics },
			{ path: "/settings", Component: SettingPage },
		],
	},
	{ path: "*", element: <ErrorPage /> },
]);

export default router;
