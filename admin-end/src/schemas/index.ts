import { z } from "zod";

export const userSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	phone: z.string().min(10, "Invalid phone Number"),
	role: z.enum(["USER", "ADMIN", "AUTHORITY"]),
});

export const authoritySchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	address: z.string().min(5, "Address must be at least 5 characters"),
	phone: z.string().min(10, "Phone must be at least 10 characters"),
	email: z.string().email("Invalid email address"),
});

export const categorySchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	description: z.string().min(10, "Description must be at least 10 characters"),
});

export const reportStatusSchema = z.object({
	status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"]),
});

export const loginSchema = z.object({
	phone: z.string().min(1, { message: "Phone number is required" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters" }),
});
export type UserFormData = z.infer<typeof userSchema>;
export type AuthorityFormData = z.infer<typeof authoritySchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type ReportStatusFormData = z.infer<typeof reportStatusSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
