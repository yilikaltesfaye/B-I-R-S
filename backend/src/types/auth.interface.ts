import { Role } from "@prisma/client";
import z from "zod";

const allowedTypes = ["FORGETPASSWORD", "NEWACCOUNT"] as const;
const role = ["USER", "AUTHORITY", "ADMIN"] as const;
const appType = ["user", "authority", "admin"] as const;

export const RequestOtpSchema = z.object({
	phoneNumber: z.string().min(9),
	type: z
		.string()
		.transform((val) => val.toUpperCase())
		.pipe(z.enum(allowedTypes)),
});

export const VerifyOtpSchema = z.object({
	phoneNumber: z.string().min(9),
	code: z.string().length(6),
	verificationId: z.string().min(2),
});

export const RegisterSchema = z.object({
	guestToken: z.string().length(6),
	phoneNumber: z.string().min(9),
	fullName: z.string().min(2),
	password: z.string().min(6),
	region: z.string().min(2),
	appContext: z.string().pipe(z.enum(appType)),
	email: z.string().email().optional(),
});

export const LoginSchema = z.object({
	phoneNumber: z.string().min(9),
	password: z.string().min(6),
	appContext: z.string().pipe(z.enum(appType)),
});

export const checkIfUserExistShema = z.object({
	phoneNumber: z.string().min(9),
});

export const PasswordResetSchema = z.object({
	guestToken: z.string().length(6),
	phoneNumber: z.string().min(9),
	newPassword: z.string().min(6),
});

export interface payloadSchema {
	userRole: Role;
	userId: string;
	appContext: string;
}
