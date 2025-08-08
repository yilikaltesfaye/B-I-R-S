import type {
	Category,
	CreateCategoryPayload,
	UpdateCategoryPayload,
} from "../../types";
import { apiClient } from "../client";

export const categoryApi = {
	createCategory: (payload: CreateCategoryPayload) =>
		apiClient.post<Category>("/categories", payload),
	getAllCategory: () => apiClient.get<Category[]>("/categories"),
	getCategoryById: (id: number) => apiClient.get<Category>(`/categories/${id}`),
	updatedCategory: (id: number, payload: UpdateCategoryPayload) =>
		apiClient.put<Category>(`/categories/${id}`, payload),
	deleteCategory: (id: number) => apiClient.delete(`/categories/${id}`),
};
