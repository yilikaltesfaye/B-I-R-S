import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { FiShield, FiEye, FiEyeOff, FiPhone, FiLock, FiUser, FiMail, FiMapPin } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import type { RegisterPayload } from "@/types";

const RegisterPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const { register: authRegister } = useAuth();
	const navigate = useNavigate();
	
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterPayload>();

	const onSubmit = async (data: RegisterPayload) => {
		try {
			await authRegister(data);
			toast.success("Successfully registered!");
			navigate("/dashboard");
		} catch (error: any) {
			toast.error(error.message || "Registration failed. Please try again.");
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
						Authority Registration
					</h1>
					<p className="text-gray-600">
						Create an account to manage infrastructure reports
					</p>
				</div>

				{/* Registration Form */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Full Name */}
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
								Full Name
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FiUser className="h-5 w-5 text-gray-400" />
								</div>
								<input
									{...register("name", {
										required: "Full name is required",
										minLength: {
											value: 2,
											message: "Name must be at least 2 characters",
										},
									})}
									type="text"
									className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									placeholder="Enter your full name"
								/>
							</div>
							{errors.name && (
								<p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
							)}
						</div>

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

						{/* Email (Optional) */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
								Email (Optional)
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FiMail className="h-5 w-5 text-gray-400" />
								</div>
								<input
									{...register("email", {
										pattern: {
											value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
											message: "Please enter a valid email address",
										},
									})}
									type="email"
									className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									placeholder="your.email@example.com"
								/>
							</div>
							{errors.email && (
								<p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
							)}
						</div>

						{/* Address */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Address
							</label>
							<div className="grid grid-cols-2 gap-3">
								<div>
									<input
										{...register("address.region", {
											required: "Region is required",
										})}
										type="text"
										placeholder="Region"
										className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									/>
									{errors.address?.region && (
										<p className="mt-1 text-sm text-red-600">{errors.address.region.message}</p>
									)}
								</div>
								<div>
									<input
										{...register("address.city", {
											required: "City is required",
										})}
										type="text"
										placeholder="City"
										className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									/>
									{errors.address?.city && (
										<p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
									)}
								</div>
							</div>
							<div className="grid grid-cols-2 gap-3 mt-3">
								<input
									{...register("address.zone")}
									type="text"
									placeholder="Zone (Optional)"
									className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
								<input
									{...register("address.woreda")}
									type="text"
									placeholder="Woreda (Optional)"
									className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
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
									placeholder="Create a password"
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
							{isSubmitting ? "Creating Account..." : "Create Account"}
						</button>
					</form>

					{/* Links */}
					<div className="mt-6 text-center space-y-2">
						<Link
							to="/login"
							className="text-blue-600 hover:text-blue-700 text-sm"
						>
							Already have an account? Sign in here
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

export default RegisterPage;
