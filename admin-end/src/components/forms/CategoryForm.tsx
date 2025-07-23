import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesAPI } from "@/lib/api";
import { categorySchema, type CategoryFormData } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Category } from "@/types";

interface CategoryFormProps {
	category?: Category | null;
	isCreateMode?: boolean;
	onSuccess: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
	category,
	isCreateMode = false,
	onSuccess,
}) => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<CategoryFormData>({
		resolver: zodResolver(categorySchema),
		defaultValues: category
			? {
					name: category.name,
					description: category.description,
			  }
			: undefined,
	});

	const createMutation = useMutation({
		mutationFn: categoriesAPI.createCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			toast({
				title: "Success",
				description: "Category created successfully",
			});
			onSuccess();
		},
		onError: () => {
			toast({
				title: "Error",
				description: "Failed to create category",
			});
		},
	});

	const updateMutation = useMutation({
		mutationFn: (data: CategoryFormData) =>
			categoriesAPI.updateCategory(category!.id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			toast({
				title: "Success",
				description: "Category updated successfully",
			});
			onSuccess();
		},
		onError: () => {
			toast({
				title: "Error",
				description: "Failed to update category",
			});
		},
	});

	const onSubmit = async (data: CategoryFormData) => {
		if (isCreateMode) {
			createMutation.mutate(data);
		} else if (category) {
			updateMutation.mutate(data);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div>
				<Label htmlFor="name">Name</Label>
				<Input
					id="name"
					{...register("name")}
					className={errors.name ? "border-red-500" : ""}
				/>
				{errors.name && (
					<p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
				)}
			</div>

			<div>
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					{...register("description")}
					className={errors.description ? "border-red-500" : ""}
					rows={4}
				/>
				{errors.description && (
					<p className="text-sm text-red-500 mt-1">
						{errors.description.message}
					</p>
				)}
			</div>

			<div className="flex justify-end space-x-2">
				<Button type="button" variant="outline" onClick={onSuccess}>
					Cancel
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Saving..." : "Save"}
				</Button>
			</div>
		</form>
	);
};
