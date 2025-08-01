import type { CreateReportPayload, Report } from "@/types";
import { apiClient } from "../client";

export const reportsApi = {
	createReport: (payload: CreateReportPayload) =>
		apiClient.post("/reports", payload),
	getReportsByCategoryId: (categoryId: number) =>
		apiClient.get<Report[]>(`/reports/${categoryId}`),
	// getFilteredReports: (payload : GetFilteredReports) => apiClient.get<Report[]>("/reports/filter"),
	getReportById: (id: string) => apiClient.get<Report>(`/reports/${id}`),
};
