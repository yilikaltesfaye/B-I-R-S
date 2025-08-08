import type { Report, Status } from "../../types";
import { apiClient } from "../client";

export const reportsApi = {
  getReportsByCategoryId: (categoryId: number) =>
    apiClient.get<{ title: string; message: string; data: Report[] }>(
      `/reports/category/${categoryId}`
    ),
  getAuthorityReportsByUserId: () =>
    apiClient.get<{
      title: string;
      message: string;
      data: Report[];
    }>("/authority"),
  getReportById: (id: string) =>
    apiClient.get<{ title: string; message: string; data: Report }>(
      `/reports/${id}`
    ),
  updateReportStatus: (id: string, status: Status) =>
    apiClient.put(`${id}/status`, status),
};
