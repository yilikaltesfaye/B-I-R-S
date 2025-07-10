import { z } from "zod";

export const SignupSchema = z.object({
	fullName: z.string().min(2),
	phoneNumber: z.string().min(1),
	password: z.string().min(8),
	region: z.string().min(1),
	email: z.string().email().optional(),
});

export const LoginSchema = z.object({
	phoneNumber: z.string().min(1),
	password: z.string().min(6),
});

export const PasswordSchema = z.object({
	phoneNumber: z.string().min(1),
});
