import { Role } from "@prisma/client";
import z from "zod";

const allowedTypes = ["FORGETPASSWORD", "NEWACCOUNT"] as const;
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
export const AddressSchema = z
	.object({
		region: z.string().min(1, "Region is required"),
		zone: z.string().optional(),
		woreda: z.string().optional(),
		city: z.string().optional(),
		subCity: z.string().optional(),
		kebele: z.string().optional(),
	})
	.passthrough();

export const RegisterSchema = z.object({
	guestToken: z.string().length(6),
	phoneNumber: z.string().min(9),
	fullName: z.string().min(2),
	password: z.string().min(6),
	address: AddressSchema,
	appContext: z.string().pipe(z.enum(appType)),
	email: z.string().email().optional(),
});

export const LoginSchema = z.object({
	phoneNumber: z.string().min(9),
	password: z.string().min(6),
	appContext: z.string().pipe(z.enum(appType)),
});

export const PasswordResetSchema = z.object({
	guestToken: z.string().length(6),
	phoneNumber: z.string().min(9),
	newPassword: z.string().min(6),
});

export interface payloadSchema {
	userRole: Role;
	userId: string;
}
