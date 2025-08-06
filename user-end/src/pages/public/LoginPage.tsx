import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { type LoginInput, loginSchema } from "@/schema";
import AuthLayout from "./AuthLayout";

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
		<AuthLayout AuthPage="Login">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex-grow flex flex-col gap-6 items-center justify-between"
			>
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-2 w-full">
						<label htmlFor="phone" className="text-start italic font-extrabold">
							Phone
						</label>
						<input
							type="tel"
							id="phone"
							placeholder="+251912345678"
							{...register("phone")}
							className="outline-2 py-2 px-2 rounded-l-2xl w-full"
						/>
						{errors.phone && (
							<p className="text-red-600 text-sm mt-1">
								{errors.phone.message}
							</p>
						)}
					</div>
					<div className="flex flex-col gap-2 w-full">
						<label
							htmlFor="password"
							className="text-start italic font-extrabold"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							placeholder="Enter your password"
							{...register("password")}
							className="outline-2 py-2 px-2 rounded-l-2xl w-full"
							autoComplete="current-password"
							inputMode="text"
						/>
						{errors.password && (
							<p className="text-red-600 text-sm mt-1">
								{errors.password.message}
							</p>
						)}
					</div>
				</div>
				<button
					type="submit"
					disabled={isSubmitting}
					className="btn w-full mt-4 cursor-pointer"
				>
					{isSubmitting ? "Logging in..." : "Login"}
				</button>
			</form>
		</AuthLayout>
	);
};

export default LoginPage;
