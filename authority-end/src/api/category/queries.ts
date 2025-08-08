import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "./api";
import type { Category } from "@/types";

export function useAllCategories() {
	return useQuery<Category[]>({
		queryKey: ["categories"],
		queryFn: categoryApi.getAllCategory,
	});
}

export function useCategoryById(id: number) {
	return useQuery({
		queryKey: ["category", id],
		queryFn: () => categoryApi.getCategoryById(id),
		enabled: !!id,
	});
}
