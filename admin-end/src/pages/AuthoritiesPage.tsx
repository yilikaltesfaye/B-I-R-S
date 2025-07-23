import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authoritiesAPI } from "@/lib/api";
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
import { Edit, Trash2, Search, Plus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AuthorityForm } from "@/components/forms/AuthorityForm";
import type { Authority } from "@/types";

export const AuthoritiesPage: React.FC = () => {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [editingAuthority, setEditingAuthority] = useState<Authority | null>(
		null
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isCreateMode, setIsCreateMode] = useState(false);

	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { data, isLoading, error } = useQuery({
		queryKey: ["authorities", page, search],
		queryFn: () => authoritiesAPI.getAuthorities(page, 10),
	});

	const deleteMutation = useMutation({
		mutationFn: authoritiesAPI.deleteAuthority,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authorities"] });
			toast({
				title: "Success",
				description: "Authority deleted successfully",
			});
		},
		onError: () => {
			toast({
				title: "Error",
				description: "Failed to delete authority",
			});
		},
	});

	const handleDelete = async (id: string) => {
		if (confirm("Are you sure you want to delete this authority?")) {
			deleteMutation.mutate(id);
		}
	};

	const handleEdit = (authority: Authority) => {
		setEditingAuthority(authority);
		setIsCreateMode(false);
		setIsDialogOpen(true);
	};

	const handleCreate = () => {
		setEditingAuthority(null);
		setIsCreateMode(true);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setEditingAuthority(null);
		setIsCreateMode(false);
	};

	if (error) {
		return (
			<div className="text-center py-10">
				<p className="text-red-600">Error loading authorities</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Authorities Management</h1>
				<Button onClick={handleCreate}>
					<Plus className="h-4 w-4 mr-2" />
					Add Authority
				</Button>
			</div>

			<Card>
				<CardHeader>
					<div className="flex justify-between items-center">
						<CardTitle>All Authorities</CardTitle>
						<div className="flex items-center space-x-2">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
								<Input
									placeholder="Search authorities..."
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
										<TableHead>Email</TableHead>
										<TableHead>Phone</TableHead>
										<TableHead>Address</TableHead>
										<TableHead>Created</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data?.data.data.map((authority) => (
										<TableRow key={authority.id}>
											<TableCell className="font-medium">
												{authority.name}
											</TableCell>
											<TableCell>{authority.email}</TableCell>
											<TableCell>{authority.phone}</TableCell>
											<TableCell className="max-w-48 truncate">
												{authority.address}
											</TableCell>
											<TableCell>
												{new Date(authority.createdAt).toLocaleDateString()}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end space-x-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleEdit(authority)}
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleDelete(authority.id)}
														disabled={deleteMutation.isPending}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							{data?.data.data.length === 0 && (
								<div className="text-center py-10">
									<p className="text-gray-500">No authorities found</p>
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

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>
							{isCreateMode ? "Create Authority" : "Edit Authority"}
						</DialogTitle>
					</DialogHeader>
					<AuthorityForm
						authority={editingAuthority}
						isCreateMode={isCreateMode}
						onSuccess={handleCloseDialog}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};
