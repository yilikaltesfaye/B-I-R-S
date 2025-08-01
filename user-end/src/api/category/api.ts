import type { Category } from "@/types";
import { apiClient } from "../client";

export const categoryApi = {
	getAllCategory: () => apiClient.get<Category[]>("/categories"),
	getCategoryById: (id: number) => apiClient.get<Category>(`/categories/${id}`),
};
