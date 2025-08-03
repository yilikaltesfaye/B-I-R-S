import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import type { RegisterPayload } from "@/types";
import { type RegisterInput, registerSchema } from "@/schema";

const RegisterPage = () => {
	const { register: signup, user } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();
	const from = location.state?.from?.pathname || "/feed";

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
	});

	useEffect(() => {
		if (user && location.state?.from?.pathname !== "redirected") {
			navigate(from, { replace: true, state: { from: "redirected" } });
		}
	}, [user, location.state, navigate, from]);

	const onSubmit = async (data: RegisterInput) => {
		const payload: RegisterPayload = {
			...data,
			appContext: "user",
		};

		try {
			const res: any = await signup(payload); // expects { title, message } in response
			toast.success(res?.message || "Registration successful", {
				id: "register-success",
			});
		} catch (err: any) {
			const errorRes = err?.response?.data;
			toast.error(errorRes?.message || "Registration failed", {
				id: "register-error",
			});
		}
	};

	return (
		<div>
			<h1>Register</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label htmlFor="fullName">Full Name</label>
					<input id="fullName" {...register("fullName")} />
					{errors.fullName && <p>{errors.fullName.message}</p>}
				</div>

				<div>
					<label htmlFor="phone">Phone</label>
					<input id="phone" {...register("phone")} />
					{errors.phone && <p>{errors.phone.message}</p>}
				</div>

				<div>
					<label htmlFor="password">Password</label>
					<input type="password" id="password" {...register("password")} />
					{errors.password && <p>{errors.password.message}</p>}
				</div>

				<div>
					<label htmlFor="email">Email (optional)</label>
					<input type="email" id="email" {...register("email")} />
					{errors.email && <p>{errors.email.message}</p>}
				</div>

				<div>
					<input placeholder="Region" {...register("address.region")} />
					<input placeholder="Zone" {...register("address.zone")} />
					<input placeholder="Woreda" {...register("address.woreda")} />
					<input placeholder="City" {...register("address.city")} />
					<input placeholder="Sub City" {...register("address.subCity")} />
					<input placeholder="Kebele" {...register("address.kebele")} />
				</div>

				<button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Registering..." : "Register"}
				</button>
			</form>
			<p>
				Already have an account? <Link to="/login">Login</Link>
			</p>
		</div>
	);
};

export default RegisterPage;
