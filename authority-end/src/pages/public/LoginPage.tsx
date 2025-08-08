import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { FiShield, FiEye, FiEyeOff, FiPhone, FiLock } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import type { LoginPayload } from "@/types";

const LoginPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();
	
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginPayload>();

	const onSubmit = async (data: LoginPayload) => {
		try {
			await login(data);
			toast.success("Successfully logged in!");
			navigate("/dashboard");
		} catch (error: any) {
			toast.error(error.message || "Login failed. Please try again.");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="flex items-center justify-center mb-4">
						<div className="bg-blue-600 p-3 rounded-xl">
							<FiShield className="h-8 w-8 text-white" />
						</div>
					</div>
					<h1 className="text-2xl font-bold text-gray-900 mb-2">
						Authority Portal
					</h1>
					<p className="text-gray-600">
						Sign in to manage infrastructure reports
					</p>
				</div>

				{/* Login Form */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Phone Number */}
						<div>
							<label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
								Phone Number
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FiPhone className="h-5 w-5 text-gray-400" />
								</div>
								<input
									{...register("phone", {
										required: "Phone number is required",
										pattern: {
											value: /^\+?[1-9]\d{1,14}$/,
											message: "Please enter a valid phone number",
										},
									})}
									type="tel"
									className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									placeholder="+251912345678"
								/>
							</div>
							{errors.phone && (
								<p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
							)}
						</div>

						{/* Password */}
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
								Password
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FiLock className="h-5 w-5 text-gray-400" />
								</div>
								<input
									{...register("password", {
										required: "Password is required",
										minLength: {
											value: 6,
											message: "Password must be at least 6 characters",
										},
									})}
									type={showPassword ? "text" : "password"}
									className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									placeholder="Enter your password"
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<FiEyeOff className="h-5 w-5 text-gray-400" />
									) : (
										<FiEye className="h-5 w-5 text-gray-400" />
									)}
								</button>
							</div>
							{errors.password && (
								<p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
							)}
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{isSubmitting ? "Signing In..." : "Sign In"}
						</button>
					</form>

					{/* Links */}
					<div className="mt-6 text-center space-y-2">
						<Link
							to="/register"
							className="text-blue-600 hover:text-blue-700 text-sm"
						>
							Don't have an account? Register here
						</Link>
						<br />
						<Link
							to="/"
							className="text-gray-600 hover:text-gray-700 text-sm"
						>
							← Back to Home
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
