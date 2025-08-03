import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { type LoginInput, loginSchema } from "@/schema";

const LoginPage = () => {
	const { user, login } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();

	const from = location.state?.from?.pathname || "/feed";

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
	});

	useEffect(() => {
		if (user && location.state?.from?.pathname !== "redirected") {
			navigate(from, { replace: true, state: { from: "redirected" } });
		}
	}, [user, location.state, navigate, from]);

	const onSubmit = async (data: LoginInput) => {
		try {
			await login({
				phone: data.phone,
				password: data.password,
				appContext: "user",
			});
			toast.success("Login successful");
		} catch (err) {
			toast.error("Login failed");
		}
	};

	return (
		<div className="max-w-md mx-auto p-4">
			<h1 className="text-5xl mb-6">Login</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div>
					<label htmlFor="phone" className="block font-medium mb-1">
						Phone
					</label>
					<input
						type="tel"
						id="phone"
						placeholder="+251912345678"
						{...register("phone")}
						className="input input-bordered w-full"
					/>
					{errors.phone && (
						<p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
					)}
				</div>
				<div>
					<label htmlFor="password" className="block font-medium mb-1">
						Password
					</label>
					<input
						type="password"
						id="password"
						placeholder="Enter your password"
						{...register("password")}
						className="input input-bordered w-full"
						autoComplete="current-password"
						inputMode="text"
					/>
					{errors.password && (
						<p className="text-red-600 text-sm mt-1">
							{errors.password.message}
						</p>
					)}
				</div>
				<button
					type="submit"
					disabled={isSubmitting}
					className="btn btn-primary w-full mt-4"
				>
					{isSubmitting ? "Logging in..." : "Login"}
				</button>
			</form>
			<p>
				Don't have an account? <Link to="/register">Register</Link>
			</p>
		</div>
	);
};

export default LoginPage;
