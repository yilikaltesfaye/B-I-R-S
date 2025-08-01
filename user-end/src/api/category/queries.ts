import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "./api";

export function useAllCategories() {
	return useQuery({
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
