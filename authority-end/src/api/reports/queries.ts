import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "./api";
import type { GetFilteredReportsPayload } from "@/types";

export const useReportsByCategoryId = (categoryId: number) => {
	return useQuery({
		queryKey: ["reports", "category", categoryId],
		queryFn: () =>
			reportsApi.getReportsByCategoryId(categoryId).then((res) => res.data),
		enabled: !!categoryId,
	});
};

export const useFilteredReports = (payload: GetFilteredReportsPayload) => {
	return useQuery({
		queryKey: ["reports", "filtered", payload],
		queryFn: () =>
			reportsApi.getFilteredReports(payload).then((res) => res.data),
		enabled: !!payload,
	});
};

export const useReportById = (id: string) => {
	return useQuery({
		queryKey: ["report", id],
		queryFn: () => reportsApi.getReportById(id).then((res) => res.data),
		enabled: !!id,
	});
};

export const useReportsByUserId = (userId: string) => {
	return useQuery({
		queryKey: ["reports", userId],
		queryFn: () => reportsApi.getReportsbyUserId(userId),
		enabled: !!userId, // only fetch if userId is truthy
	});
};
