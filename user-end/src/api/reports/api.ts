import type {
	CreateReportPayload,
	GetFilteredReportsPayload,
	Report,
} from "@/types";
import { apiClient } from "../client";

export const reportsApi = {
	createReport: (payload: CreateReportPayload) =>
		apiClient.post("/reports", payload),
	getReportsByCategoryId: (categoryId: number) =>
		apiClient.get<Report[]>(`/reports/${categoryId}`),
	getFilteredReports: (payload: GetFilteredReportsPayload) =>
		apiClient.get<Report[]>("/reports/filter", { params: payload }),
	getReportById: (id: string) => apiClient.get<Report>(`/reports/${id}`),
};
