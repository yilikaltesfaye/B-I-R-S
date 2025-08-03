import { createBrowserRouter } from "react-router";
import ProtectectRoutes from "./ProtectectRoutes.tsx";
import RouterGate from "./RouterGate.tsx";
import HomePage from "@/pages/public/HomePage.tsx";
import Feed from "@/pages/Protected/Feed";
import LoginPage from "@/pages/public/LoginPage";
import RegisterPage from "@/pages/public/RegisterPage";
import ErrorPage from "@/common/ErrorPage.tsx";
import MyReportsPage from "@/pages/Protected/MyReportsPage.tsx";
import CreateReportPage from "@/pages/Protected/CreateReportPage.tsx";

const router = createBrowserRouter([
	{ path: "/", Component: HomePage },
	{ path: "/login", Component: LoginPage },
	{ path: "/register", Component: RegisterPage },
	{
		element: (
			<RouterGate>
				<ProtectectRoutes />
			</RouterGate>
		),
		// errorElement: <ErrorPage />,
		children: [
			{ path: "/feed", Component: Feed },
			{ path: "/reports", Component: MyReportsPage },
			{ path: "/report/new", Component: CreateReportPage },
			{ path: "/activity", Component: Feed },
			{ path: "/settings", Component: Feed },
			{ path: "*", element: <ErrorPage /> },
		],
	},
	{ path: "*", element: <ErrorPage /> },
]);

export default router;
