import z from "zod";

export const loginSchema = z.object({
	phone: z
		.string()
		.min(10, "Phone number too short")
		.regex(/^\+2519\d{8}$/, "Phone must start with +2519 and be 12 digits"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
	phone: z
		.string()
		.min(10, "Phone number too short")
		.regex(/^\+2519\d{8}$/, "Phone must start with +2519 and be 12 digits"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	fullName: z.string().min(3, "Full name is required"),
	email: z.string().optional(),
	address: z.object({
		region: z.string(),
		zone: z.string(),
		woreda: z.string(),
		city: z.string(),
		subCity: z.string(),
		kebele: z.string(),
	}),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
