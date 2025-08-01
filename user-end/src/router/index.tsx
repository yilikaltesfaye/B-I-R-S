import { createBrowserRouter } from "react-router";
import ProtectectRoutes from "./ProtectectRoutes.tsx";
import RouterGate from "./RouterGate.tsx";
import App from "@/App";
import Feed from "@/pages/Protected/Feed";
import LoginPage from "@/pages/public/LoginPage";
import RegisterPage from "@/pages/public/RegisterPage";
import SplashScreen from "@/components/splashScreen";

const router = createBrowserRouter([
	{ path: "/", Component: App },
	{ path: "/login", Component: LoginPage },
	{ path: "/register", Component: RegisterPage },
	{
		element: (
			<RouterGate>
				<ProtectectRoutes />
			</RouterGate>
		),
		children: [
			{ path: "/feed", Component: Feed },
			{ path: "/yello", Component: SplashScreen },
		],
	},
]);

export default router;
