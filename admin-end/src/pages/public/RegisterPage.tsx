import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AuthLayout from "./AuthLayout";
import LoadingSpinner from "../../components/LoadingSpinner";

const RegisterPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
		address: {
			region: "",
			zone: "",
			woreda: "",
			city: "",
			subCity: "",
			kebele: ""
		}
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const { register } = useAuth();
	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		
		if (name.startsWith('address.')) {
			const addressField = name.split('.')[1];
			setFormData(prev => ({
				...prev,
				address: {
					...prev.address,
					[addressField]: value
				}
			}));
		} else {
			setFormData(prev => ({
				...prev,
				[name]: value
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			setIsLoading(false);
			return;
		}

		try {
			const registerData = {
				name: formData.name,
				email: formData.email,
				phone: formData.phone,
				password: formData.password,
				address: formData.address,
				role: "ADMIN"
			};
			
			await register(registerData);
			navigate("/dashboard");
		} catch (err: any) {
			setError(err.response?.data?.message || "Registration failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthLayout>
			<div>
				<h3 className="text-lg font-medium text-gray-900 mb-6">
					Create Admin Account
				</h3>

				{error && (
					<div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
						<div className="text-sm text-red-600">{error}</div>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 gap-6">
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-gray-700">
								Full Name
							</label>
							<input
								id="name"
								name="name"
								type="text"
								required
								value={formData.name}
								onChange={handleChange}
								className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="Enter your full name"
							/>
						</div>

						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700">
								Email address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={formData.email}
								onChange={handleChange}
								className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="Enter your email"
							/>
						</div>

						<div>
							<label htmlFor="phone" className="block text-sm font-medium text-gray-700">
								Phone Number
							</label>
							<input
								id="phone"
								name="phone"
								type="tel"
								required
								value={formData.phone}
								onChange={handleChange}
								className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="Enter your phone number"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label htmlFor="address.region" className="block text-sm font-medium text-gray-700">
									Region
								</label>
								<input
									id="address.region"
									name="address.region"
									type="text"
									required
									value={formData.address.region}
									onChange={handleChange}
									className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									placeholder="Region"
								/>
							</div>
							<div>
								<label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
									City
								</label>
								<input
									id="address.city"
									name="address.city"
									type="text"
									required
									value={formData.address.city}
									onChange={handleChange}
									className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									placeholder="City"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700">
								Password
							</label>
							<div className="mt-1 relative">
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									required
									value={formData.password}
									onChange={handleChange}
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
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
								Confirm Password
							</label>
							<div className="mt-1 relative">
								<input
									id="confirmPassword"
									name="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									required
									value={formData.confirmPassword}
									onChange={handleChange}
									className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									placeholder="Confirm your password"
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								>
									{showConfirmPassword ? (
										<FaEyeSlash className="h-4 w-4 text-gray-400" />
									) : (
										<FaEye className="h-4 w-4 text-gray-400" />
									)}
								</button>
							</div>
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={isLoading}
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<LoadingSpinner size="sm" />
							) : (
								"Create Account"
							)}
						</button>
					</div>
				</form>

				<div className="mt-6">
					<div className="text-center">
						<span className="text-sm text-gray-600">
							Already have an account?{" "}
							<Link
								to="/login"
								className="font-medium text-blue-600 hover:text-blue-500"
							>
								Sign in
							</Link>
						</span>
					</div>
				</div>
			</div>
		</AuthLayout>
	);
};

export default RegisterPage;
