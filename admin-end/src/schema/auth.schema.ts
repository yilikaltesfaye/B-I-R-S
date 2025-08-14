import { z } from "zod";

export const LoginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const RegisterSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(10, "Phone number must be at least 10 characters"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	address: z.object({
		region: z.string().min(1, "Region is required"),
		zone: z.string().optional(),
		woreda: z.string().optional(),
		city: z.string().min(1, "City is required"),
		subCity: z.string().optional(),
		kebele: z.string().optional(),
	}),
	role: z.enum(["ADMIN"]).default("ADMIN"),
});

export type LoginPayload = z.infer<typeof LoginSchema>;
export type RegisterPayload = z.infer<typeof RegisterSchema>;
