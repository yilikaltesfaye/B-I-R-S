import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersAPI } from "@/lib/api";
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
	DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserForm } from "@/components/forms/UserForm";
import type { User } from "@/types";

export const UsersPage: React.FC = () => {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { data, isLoading, error } = useQuery({
		queryKey: ["users", page, search],
		queryFn: () => usersAPI.getUsers(page, 10),
	});

	const deleteMutation = useMutation({
		mutationFn: usersAPI.deleteUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			toast({
				title: "Success",
				description: "User deleted successfully",
			});
		},
		onError: () => {
			toast({
				title: "Error",
				description: "Failed to delete user",
			});
		},
	});

	const handleDelete = async (id: string) => {
		if (confirm("Are you sure you want to delete this user?")) {
			deleteMutation.mutate(id);
		}
	};

	const handleEdit = (user: User) => {
		setEditingUser(user);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setEditingUser(null);
	};

	const getRoleBadgeVariant = (role: User["role"]) => {
		switch (role) {
			case "ADMIN":
				return "destructive";
			case "AUTHORITY":
				return "default";
			case "USER":
				return "secondary";
			default:
				return "secondary";
		}
	};

	if (error) {
		return (
			<div className="text-center py-10">
				<p className="text-red-600">Error loading users</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Users Management</h1>
			</div>

			<Card>
				<CardHeader>
					<div className="flex justify-between items-center">
						<CardTitle>All Users</CardTitle>
						<div className="flex items-center space-x-2">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
								<Input
									placeholder="Search users..."
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
										<TableHead>Phone</TableHead>
										<TableHead>Role</TableHead>
										<TableHead>Created</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data?.data.data.map((user) => (
										<TableRow key={user.id}>
											<TableCell className="font-medium">{user.name}</TableCell>
											<TableCell>{user.phone}</TableCell>
											<TableCell>
												<Badge variant={getRoleBadgeVariant(user.role)}>
													{user.role}
												</Badge>
											</TableCell>
											<TableCell>
												{new Date(user.createdAt).toLocaleDateString()}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end space-x-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleEdit(user)}
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleDelete(user.id)}
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
									<p className="text-gray-500">No users found</p>
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
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{editingUser ? "Edit User" : "Create User"}
						</DialogTitle>
					</DialogHeader>
					<UserForm user={editingUser} onSuccess={handleCloseDialog} />
				</DialogContent>
			</Dialog>
		</div>
	);
};
