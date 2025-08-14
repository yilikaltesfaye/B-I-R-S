import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AuthLayout from "./AuthLayout";
import LoadingSpinner from "../../components/LoadingSpinner";

const LoginPage = () => {
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			await login({ phone, password, appContext: "admin" } as any);
			navigate("/dashboard");
		} catch (err: any) {
			setError(
				err.response?.data?.message || "Login failed. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthLayout>
			<div>
				<h3 className="text-lg font-medium text-gray-900 mb-6">
					Sign in to Admin Panel
				</h3>

				{error && (
					<div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
						<div className="text-sm text-red-600">{error}</div>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="phone"
							className="block text-sm font-medium text-gray-700"
						>
							Phone Number
						</label>
						<div className="mt-1">
							<input
								id="phone"
								name="phome"
								type="tel"
								autoComplete="tel"
								required
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="Enter your PHone Number"
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Password
						</label>
						<div className="mt-1 relative">
							<input
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								autoComplete="current-password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="Enter your password"
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 pr-3 flex items-center"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<FaEyeSlash className="h-4 w-4 text-gray-400" />
								) : (
									<FaEye className="h-4 w-4 text-gray-400" />
								)}
							</button>
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={isLoading}
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? <LoadingSpinner size="sm" /> : "Sign in"}
						</button>
					</div>
				</form>

				<div className="mt-6">
					<div className="text-center">
						<span className="text-sm text-gray-600">
							Don't have an account?{" "}
							<Link
								to="/register"
								className="font-medium text-blue-600 hover:text-blue-500"
							>
								Sign up
							</Link>
						</span>
					</div>
				</div>
			</div>
		</AuthLayout>
	);
};

export default LoginPage;
