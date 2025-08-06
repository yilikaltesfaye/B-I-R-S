import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import type { RegisterPayload } from "@/types";
import { type RegisterInput, registerSchema } from "@/schema";
import AuthLayout from "./AuthLayout";

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
		<AuthLayout AuthPage="Register">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex-grow flex flex-col gap-2 lg:gap-6 items-center justify-between w-full"
			>
				<div className="flex flex-col lg:gap-2  overflow-scroll h-96 sm:h-full w-full scrollbar-none">
					<div className="flex flex-col sm:flex-row gap-2 w-full">
						<div className="flex flex-col gap-2 w-full">
							<label
								className="text-start italic font-extrabold"
								htmlFor="fullName"
							>
								Full Name*
							</label>
							<input
								id="fullName"
								{...register("fullName")}
								className="border-2 py-2 px-2 rounded-l-2xl w-full"
								placeholder="Enter your Full Name"
							/>
							{errors.fullName && (
								<p className="text-red-500">{errors.fullName.message}</p>
							)}
						</div>
						<div className="flex flex-col gap-2 w-full">
							<label
								className="text-start italic font-extrabold"
								htmlFor="email"
							>
								Email
							</label>
							<input
								type="email"
								id="email"
								{...register("email")}
								className="border-2 py-2 px-2 rounded-l-2xl w-full"
								placeholder="Enter your Email Address"
							/>
							{errors.email && (
								<p className="text-red-500">{errors.email.message}</p>
							)}
						</div>
					</div>
					<div className="flex flex-col sm:flex-row gap-2">
						<div className="flex flex-col gap-2 w-full">
							<label
								className="text-start italic font-extrabold"
								htmlFor="phone"
							>
								Phone*
							</label>
							<input
								id="phone"
								{...register("phone")}
								className="border-2 py-2 px-2 rounded-l-2xl w-full"
								placeholder="Enter your Phone Number"
							/>
							{errors.phone && (
								<p className="text-red-500">{errors.phone.message}</p>
							)}
						</div>
						<div className="flex flex-col gap-2 w-full">
							<label
								className="text-start italic font-extrabold"
								htmlFor="password"
							>
								Password*
							</label>
							<input
								type="password"
								id="password"
								{...register("password")}
								className="border-2 py-2 px-2 rounded-l-2xl w-full"
								placeholder="Enter new Password"
							/>
							{errors.password && (
								<p className="text-red-500">{errors.password.message}</p>
							)}
						</div>
					</div>
					<p className="text-start italic font-extrabold text-xl mt-2">
						Address
					</p>
					<fieldset className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-6">
						<div className="flex flex-col gap-2">
							<label
								className="text-start italic font-extrabold"
								htmlFor="Region"
							>
								Region*
							</label>
							{/* <input
								id="Region"
								placeholder="Region*"
								{...register("address.region")}
							className="border-2 py-2 px-2 rounded-l-2xl w-full"
								/> */}
							<select
								id="Region"
								{...register("address.region")}
								className="border-2 py-2 px-2 rounded-l-2xl w-full"
							>
								<option value="" disabled selected>
									Select your Region
								</option>
								<option value="Sidama">Sidama</option>
								<option value="Oromia">Oromia</option>
								<option value="Amhara">Amhara</option>
								<option value="Tigray">Tigray</option>
								<option value="Diredawa">Diredawa</option>
								<option value="Addis Ababa">Addis Ababa</option>
								<option value="Somalia">Somalia</option>
							</select>
						</div>
						<div className="flex flex-col gap-2">
							<label
								className="text-start italic font-extrabold"
								htmlFor="Zone"
							>
								Zone
							</label>
							<input
								id="Zone"
								placeholder="Zone"
								{...register("address.zone")}
								className="border-2 py-2 px-2 rounded-l-2xl w-full"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label
								className="text-start italic font-extrabold"
								htmlFor="Woreda"
							>
								Woreda
							</label>
							<input
								id="Woreda"
								placeholder="Woreda"
								{...register("address.woreda")}
								className="border-2 py-2 px-2 rounded-l-2xl w-full"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label
								className="text-start italic font-extrabold"
								htmlFor="City"
							>
								City
							</label>
							<input
								id="City"
								placeholder="City"
								{...register("address.city")}
								className="border-2 py-2 px-2 rounded-l-2xl w-full"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label
								className="text-start italic font-extrabold"
								htmlFor="Sub-City"
							>
								Sub City
							</label>
							<input
								id="Sub-City"
								placeholder="Sub City"
								{...register("address.subCity")}
								className="border-2 py-2 px-2 rounded-l-2xl w-full"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label
								className="text-start italic font-extrabold"
								htmlFor="Kebele"
							>
								Kebele
							</label>
							<input
								id="Kebele"
								placeholder="Kebele"
								{...register("address.kebele")}
								className="border-2 py-2 px-2 rounded-l-2xl w-full"
							/>
						</div>
					</fieldset>
				</div>
				<button
					type="submit"
					disabled={isSubmitting}
					className="btn cursor-pointer"
				>
					{isSubmitting ? "Registering..." : "Register"}
				</button>
			</form>
		</AuthLayout>
	);
};

export default RegisterPage;
