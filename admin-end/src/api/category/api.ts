import type {
	Category,
	CreateCategoryPayload,
	UpdateCategoryPayload,
} from "../../types";
import { apiClient } from "../client";

export const categoryApi = {
	createCategory: (payload: CreateCategoryPayload) =>
		apiClient.post<{ title: string; message: string; data: Category }>(
			"/categories",
			payload
		),
	getAllCategory: () =>
		apiClient.get<{ title: string; message: string; data: Category[] }>(
			"/categories"
		),
	getCategoryById: (id: number) =>
		apiClient.get<{ title: string; message: string; data: Category }>(
			`/categories/${id}`
		),
	updatedCategory: (id: number, payload: UpdateCategoryPayload) =>
		apiClient.put<{ title: string; message: string; data: Category }>(
			`/categories/${id}`,
			payload
		),
	deleteCategory: (id: number) => apiClient.delete(`/categories/${id}`),
};
