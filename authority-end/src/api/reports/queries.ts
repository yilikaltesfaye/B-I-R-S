import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "./api";

export const useReportsByCategoryId = (categoryId: number) => {
	return useQuery({
		queryKey: ["reports", "category", categoryId],
		queryFn: () =>
			reportsApi.getReportsByCategoryId(categoryId).then((res) => res.data),
		enabled: !!categoryId,
	});
};

export const useReportById = (id: string) => {
	return useQuery({
		queryKey: ["report", id],
		queryFn: () => reportsApi.getReportById(id).then((res) => res.data),
		enabled: !!id,
	});
};

export const useAuthorityReports = () => {
	return useQuery({
		queryKey: ["authority", "reports"],
		queryFn: () => reportsApi.getAuthorityReportsByUserId().then((res) => res.data),
	});
};
