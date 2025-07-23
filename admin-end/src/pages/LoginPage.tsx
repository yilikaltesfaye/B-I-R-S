import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, type LoginFormData } from "@/schemas";
import { useToast } from "@/hooks/use-toast";

export function LoginPage({
	className,
	...props
}: React.ComponentProps<"div">) {
	const { login } = useAuth();
	const navigate = useNavigate();
	const { toast } = useToast();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginFormData) => {
		try {
			await login(data.phone, data.password);
			navigate("/");
			toast({
				title: "Success",
				description: "Logged in successfully",
			});
		} catch (error: any) {
			toast({
				title: error.title,
				description: error.message,
			});
		}
	};
	return (
		<div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<div className={cn("flex flex-col gap-6", className)} {...props}>
					<Card>
						<CardHeader className="text-center">
							<CardTitle className="text-xl">Welcome back</CardTitle>
							<CardDescription>Login back to your Work</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className="grid gap-6">
									<div className="grid gap-6">
										<div className="grid gap-3">
											<Label htmlFor="phone">Phone Number</Label>
											<Input
												id="phone"
												type="tel"
												placeholder="e.g. +251912345678"
												autoComplete="tel"
												{...register("phone")}
												required
												className={errors.phone ? "border-red-500" : ""}
											/>
											{errors.phone && (
												<p className="text-sm text-red-500 mt-1">
													{errors.phone.message}
												</p>
											)}
										</div>

										<div className="grid gap-3">
											<div className="flex items-center">
												<Label htmlFor="password">Password</Label>
												<a
													href="#"
													className="ml-auto text-sm underline-offset-4 hover:underline"
												>
													Forgot your password?
												</a>
											</div>
											<Input
												id="password"
												type="password"
												autoComplete="current-password"
												{...register("password")}
												required
												className={errors.password ? "border-red-500" : ""}
											/>
											{errors.password && (
												<p className="text-sm text-red-500 mt-1">
													{errors.password.message}
												</p>
											)}
										</div>
										<Button
											type="submit"
											disabled={isSubmitting}
											className="w-full"
										>
											{isSubmitting ? "Signing in..." : "Sign in"}
										</Button>
									</div>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
