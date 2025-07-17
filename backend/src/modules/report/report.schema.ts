import z from "zod";
import { Status } from "@prisma/client";

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

export const ReportSchema = z.object({
	description: z.string().min(10),
	categoryId: z.number(),
	address: AddressSchema,
});

export const UpdateReportStatusSchema = z.object({
	status: z.nativeEnum(Status),
});
