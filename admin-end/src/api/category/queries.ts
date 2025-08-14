import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "./api";
import type { Category } from "../../types";
import { QUERY_KEYS } from "../constants";

export const useAllCategories = () =>
	useQuery<Category[]>({
		queryKey: QUERY_KEYS.CATEGORIES.ALL,
		queryFn: () => categoryApi.getAllCategory().then((res) => res.data.data),
		staleTime: 5 * 60 * 1000,
	});

export const useCategoryById = (id: number) =>
	useQuery<Category>({
		queryKey: QUERY_KEYS.CATEGORIES.BY_ID(id),
		queryFn: () => categoryApi.getCategoryById(id).then((res) => res.data.data),
		staleTime: 5 * 60 * 1000,
		enabled: !!id,
	});
