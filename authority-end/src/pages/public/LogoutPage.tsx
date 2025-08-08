import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { FiLogOut } from "react-icons/fi";

const LogoutPage = () => {
	const { logout } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const performLogout = async () => {
			try {
				await logout();
				setTimeout(() => {
					navigate("/");
				}, 2000);
			} catch (error) {
				console.error("Logout error:", error);
				navigate("/");
			}
		};

		performLogout();
	}, [logout, navigate]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
			<div className="text-center">
				<div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
					<div className="flex items-center justify-center mb-4">
						<div className="bg-blue-100 p-3 rounded-full">
							<FiLogOut className="h-8 w-8 text-blue-600" />
						</div>
					</div>
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Logging out...
					</h2>
					<p className="text-gray-600">
						Thank you for using the Authority Portal
					</p>
					<div className="mt-4">
						<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LogoutPage;
