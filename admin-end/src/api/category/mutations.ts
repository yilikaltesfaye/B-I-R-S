import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "./api";
import { QUERY_KEYS } from "../constants";
import toast from "react-hot-toast";
import type { CreateCategoryPayload, UpdateCategoryPayload } from "../../types";

export const useCreateCategory = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (data: CreateCategoryPayload) => categoryApi.createCategory(data),
		
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
			toast.success("Category created successfully");
		},
		
		onError: () => {
			toast.error("Failed to create category");
		},
	});
};

export const useUpdateCategory = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateCategoryPayload }) =>
			categoryApi.updatedCategory(id, data),
		
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
			queryClient.invalidateQueries({ 
				queryKey: QUERY_KEYS.CATEGORIES.BY_ID(variables.id) 
			});
			toast.success("Category updated successfully");
		},
		
		onError: () => {
			toast.error("Failed to update category");
		},
	});
};

export const useDeleteCategory = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (id: number) => categoryApi.deleteCategory(id),
		
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
			toast.success("Category deleted successfully");
		},
		
		onError: () => {
			toast.error("Failed to delete category");
		},
	});
};
