import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Trash2, Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CategoryForm } from "@/components/forms/CategoryForm";
import type { Category } from "@/types";

export const CategoriesPage: React.FC = () => {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isCreateMode, setIsCreateMode] = useState(false);

	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { data, isLoading, error } = useQuery({
		queryKey: ["categories", page, search],
		queryFn: () => categoriesAPI.getCategories(page, 10),
	});

	const deleteMutation = useMutation({
		mutationFn: categoriesAPI.deleteCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			toast({
				title: "Success",
				description: "Category deleted successfully",
			});
		},
		onError: () => {
			toast({
				title: "Error",
				description: "Failed to delete category",
			});
		},
	});

	const canModify = user?.role === "ADMIN";

	const handleDelete = async (id: string) => {
		if (confirm("Are you sure you want to delete this category?")) {
			deleteMutation.mutate(id);
		}
	};

	const handleEdit = (category: Category) => {
		setEditingCategory(category);
		setIsCreateMode(false);
		setIsDialogOpen(true);
	};

	const handleCreate = () => {
		setEditingCategory(null);
		setIsCreateMode(true);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setEditingCategory(null);
		setIsCreateMode(false);
	};

	if (error) {
		return (
			<div className="text-center py-10">
				<p className="text-red-600">Error loading categories</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Categories Management</h1>
				{canModify && (
					<Button onClick={handleCreate}>
						<Plus className="h-4 w-4 mr-2" />
						Add Category
					</Button>
				)}
			</div>

			<Card>
				<CardHeader>
					<div className="flex justify-between items-center">
						<CardTitle>All Categories</CardTitle>
						<div className="flex items-center space-x-2">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
								<Input
									placeholder="Search categories..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className="pl-10 w-64"
								/>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex justify-center py-10">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
						</div>
					) : (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Description</TableHead>
										<TableHead>Created</TableHead>
										{canModify && (
											<TableHead className="text-right">Actions</TableHead>
										)}
									</TableRow>
								</TableHeader>
								<TableBody>
									{data?.data.data.map((category) => (
										<TableRow key={category.id}>
											<TableCell className="font-medium">
												{category.name}
											</TableCell>
											<TableCell className="max-w-md truncate">
												{category.description}
											</TableCell>
											<TableCell>
												{new Date(category.createdAt).toLocaleDateString()}
											</TableCell>
											{canModify && (
												<TableCell className="text-right">
													<div className="flex justify-end space-x-2">
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleEdit(category)}
														>
															<Edit className="h-4 w-4" />
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleDelete(category.id)}
															disabled={deleteMutation.isPending}
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											)}
										</TableRow>
									))}
								</TableBody>
							</Table>

							{data?.data.data.length === 0 && (
								<div className="text-center py-10">
									<p className="text-gray-500">No categories found</p>
								</div>
							)}

							{data && data.data.totalPages > 1 && (
								<div className="flex justify-center space-x-2 mt-6">
									<Button
										variant="outline"
										onClick={() => setPage(page - 1)}
										disabled={page === 1}
									>
										Previous
									</Button>
									<span className="py-2 px-4">
										Page {page} of {data.data.totalPages}
									</span>
									<Button
										variant="outline"
										onClick={() => setPage(page + 1)}
										disabled={page === data.data.totalPages}
									>
										Next
									</Button>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>

			{canModify && (
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{isCreateMode ? "Create Category" : "Edit Category"}
							</DialogTitle>
						</DialogHeader>
						<CategoryForm
							category={editingCategory}
							isCreateMode={isCreateMode}
							onSuccess={handleCloseDialog}
						/>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
};
