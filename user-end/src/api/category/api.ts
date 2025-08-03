import type { Category } from "@/types";
import { apiClient } from "../client";

export const categoryApi = {
	getAllCategory: () =>
		apiClient
			.get<{ title: string; message: string; data: Category[] }>("/categories")
			.then((res) => res.data.data),

	getCategoryById: (id: number) => apiClient.get<Category>(`/categories/${id}`),
};
