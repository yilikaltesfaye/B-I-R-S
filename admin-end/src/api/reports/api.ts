import type { Report, Status } from "../../types";
import { apiClient } from "../client";

export const reportsApi = {
	getReportsByCategoryId: (categoryId: number) =>
		apiClient.get<{ title: string; message: string; data: Report[] }>(
			`/reports/${categoryId}`
		),
	getReportById: (id: string) =>
		apiClient.get<{ title: string; message: string; data: Report }>(
			`/reports/${id}`
		),
	getAllReport: () =>
		apiClient.get<{ title: string; message: string; data: Report[] }>(
			"/reports"
		),
	updateReportStatus: (id: string, status: Status) =>
		apiClient.put<{ title: string; message: string; data: Report }>(
			`/reports/${id}/status`,
			{ status }
		),
};
