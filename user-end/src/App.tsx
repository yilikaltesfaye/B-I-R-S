import { Navigate } from "react-router";
import SplashScreen from "./components/splashScreen";
import { useAuth } from "./contexts/AuthContext";

const App = () => {
	const { user, isLoading } = useAuth();
	if (user) {
		return <Navigate to={"/feed"} />;
	}
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
			</div>
		);
	}
	return <SplashScreen />;
};

export default App;
