import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "./api";
import type { Report } from "../../types";
import { QUERY_KEYS } from "../constants";

export const useAllReports = () =>
	useQuery<Report[]>({
		queryKey: QUERY_KEYS.REPORTS.ALL,
		queryFn: () => reportsApi.getAllReport().then((res) => res.data.data),
		staleTime: 5 * 60 * 1000,
	});

export const useReportById = (id: string) =>
	useQuery<Report>({
		queryKey: QUERY_KEYS.REPORTS.BY_ID(id),
		queryFn: () => reportsApi.getReportById(id).then((res) => res.data.data),
		staleTime: 5 * 60 * 1000,
		enabled: !!id,
	});

export const useReportsByCategory = (categoryId: number) =>
	useQuery<Report[]>({
		queryKey: QUERY_KEYS.REPORTS.BY_CATEGORY(categoryId),
		queryFn: () =>
			reportsApi
				.getReportsByCategoryId(categoryId)
				.then((res) => res.data.data),
		staleTime: 5 * 60 * 1000,
		enabled: !!categoryId,
	});
