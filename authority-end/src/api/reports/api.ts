import type {
	CreateReportPayload,
	GetFilteredReportsPayload,
	Report,
} from "@/types";
import { apiClient } from "../client";

export const reportsApi = {
	createReport: (payload: CreateReportPayload) =>
		apiClient.post<{ title: string; message: string; data: Report }>(
			"/reports",
			payload
		),
	getReportsByCategoryId: (categoryId: number) =>
		apiClient.get<{ title: string; message: string; data: Report[] }>(
			`/reports/category/${categoryId}`
		),
	getReportsbyUserId: (userId: string) =>
		apiClient.get<{ title: string; message: string; data: Report[] }>(
			`/reports/user/${userId}`
		),
	getFilteredReports: (payload: GetFilteredReportsPayload) =>
		apiClient.get<{
			title: string;
			message: string;
			data: Report[];
			pagination: {
				skip: string;
				take: string;
				count: string;
			};
		}>("/reports/filter", { params: payload }),
	getReportById: (id: string) =>
		apiClient.get<{ title: string; message: string; data: Report }>(
			`/reports/${id}`
		),
};
