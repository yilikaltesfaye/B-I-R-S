import type { CreateReportPayload, Report } from "../../types";
import { apiClient } from "../client";

export const reportsApi = {
	getReportsByCategoryId: (categoryId: number) =>
		apiClient.get<Report[]>(`/reports/${categoryId}`),
	getReportById: (id: string) => apiClient.get<Report>(`/reports/${id}`),
	getAllReport: () => apiClient.get<Report[]>("/reports"),
	updateReportStatus: (id: string) =>
		apiClient.put<Report>(`/reports/${id}/status`),
};
