import { useState } from "react";
import {
	FaSearch,
	FaPlus,
	FaEdit,
	FaTrash,
	FaEye,
	FaUsers,
} from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { useAllUsers, useDeleteUser } from "../../api";
import type { User } from "../../types";
import { Role } from "../../types";

const UserRow = ({
	user,
	onEdit,
	onDelete,
	onView,
}: {
	user: User;
	onEdit: (user: User) => void;
	onDelete: (user: User) => void;
	onView: (user: User) => void;
}) => (
	<tr className="hover:bg-gray-50">
		<td className="admin-table td">
			<div className="flex items-center">
				<div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
					<span className="text-xs font-medium text-gray-600">
						{user.name?.charAt(0)?.toUpperCase() || "U"}
					</span>
				</div>
				<div className="ml-3">
					<p className="text-sm font-medium text-gray-900">
						{user.name || "Unknown"}
					</p>
					<p className="text-xs text-gray-500">{user.email || "No email"}</p>
				</div>
			</div>
		</td>
		<td className="admin-table td">
			<span className="text-sm text-gray-900">{user.phone || "No phone"}</span>
		</td>
		<td className="admin-table td">
			<span
				className={`status-badge ${
					user.role === Role.ADMIN
						? "bg-purple-100 text-purple-800"
						: user.role === Role.AUTHORITY
						? "bg-blue-100 text-blue-800"
						: "bg-gray-100 text-gray-800"
				}`}
			>
				{user.role}
			</span>
		</td>
		<td className="admin-table td">
			<span className="text-sm text-gray-900">
				{user.address
					? `${user.address.city || ""}, ${user.address.region || ""}`
					: "No address"}
			</span>
		</td>
		<td className="admin-table td">
			<span
				className={`status-badge ${
					user.isActive
						? "bg-green-100 text-green-800"
						: "bg-red-100 text-red-800"
				}`}
			>
				{user.isActive ? "Active" : "Inactive"}
			</span>
		</td>
		<td className="admin-table td">
			<span className="text-sm text-gray-500">
				{user.createdAt
					? new Date(user.createdAt).toLocaleDateString()
					: "Unknown"}
			</span>
		</td>
		<td className="admin-table td">
			<div className="flex items-center space-x-2">
				<button
					onClick={() => onView(user)}
					className="action-button text-blue-600 hover:bg-blue-50"
				>
					<FaEye className="text-xs" />
				</button>
				<button
					onClick={() => onEdit(user)}
					className="action-button text-green-600 hover:bg-green-50"
				>
					<FaEdit className="text-xs" />
				</button>
				<button
					onClick={() => onDelete(user)}
					className="action-button text-red-600 hover:bg-red-50"
				>
					<FaTrash className="text-xs" />
				</button>
			</div>
		</td>
	</tr>
);

const UsersPage = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [roleFilter, setRoleFilter] = useState("ALL");
	const [statusFilter, setStatusFilter] = useState("ALL");

	const { data: users, isLoading, error } = useAllUsers();
	const deleteUserMutation = useDeleteUser();

	const filteredUsers =
		users?.filter((user) => {
			const matchesSearch =
				user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email?.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesRole =
				roleFilter === "ALL" || Role[user.role] === roleFilter;
			const matchesStatus =
				statusFilter === "ALL" ||
				(statusFilter === "ACTIVE" && user.isActive) ||
				(statusFilter === "INACTIVE" && !user.isActive);

			return matchesSearch && matchesRole && matchesStatus;
		}) || [];

	const handleEdit = (user: User) => {
		// TODO: Open edit modal
		console.log("Edit user:", user);
	};

	const handleDelete = async (user: User) => {
		if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
			deleteUserMutation.mutate(user.id);
		}
	};

	const handleView = (user: User) => {
		// TODO: Open view modal
		console.log("View user:", user);
	};

	const handleAddUser = () => {
		// TODO: Open add user modal
		console.log("Add new user");
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="admin-card text-center py-12">
				<div className="text-red-600 font-medium mb-2">Error Loading Users</div>
				<div className="text-red-500 text-sm">
					Please try refreshing the page
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
					<p className="text-gray-600 mt-2">
						Manage system users and their permissions
					</p>
				</div>
				<button
					onClick={handleAddUser}
					className="btn bg-blue-600 text-white hover:bg-blue-700"
				>
					<FaPlus className="text-sm" />
					Add User
				</button>
			</div>

			{/* Filters */}
			<div className="admin-card">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="flex-1">
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<FaSearch className="h-4 w-4 text-gray-400" />
							</div>
							<input
								type="text"
								placeholder="Search users..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							/>
						</div>
					</div>
					<div className="flex gap-2">
						<select
							value={roleFilter}
							onChange={(e) => setRoleFilter(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="ALL">All Roles</option>
							<option value="USER">User</option>
							<option value="AUTHORITY">Authority</option>
							<option value="ADMIN">Admin</option>
						</select>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="ALL">All Status</option>
							<option value="ACTIVE">Active</option>
							<option value="INACTIVE">Inactive</option>
						</select>
					</div>
				</div>
			</div>

			{/* Users Table */}
			<div className="admin-card overflow-hidden">
				{filteredUsers.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="admin-table">
							<thead className="bg-gray-50">
								<tr>
									<th className="admin-table th">User</th>
									<th className="admin-table th">Phone</th>
									<th className="admin-table th">Role</th>
									<th className="admin-table th">Location</th>
									<th className="admin-table th">Status</th>
									<th className="admin-table th">Joined</th>
									<th className="admin-table th">Actions</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredUsers.map((user) => (
									<UserRow
										key={user.id}
										user={user}
										onEdit={handleEdit}
										onDelete={handleDelete}
										onView={handleView}
									/>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<EmptyState
						icon={<FaUsers className="text-4xl" />}
						title="No Users Found"
						description={
							searchTerm || roleFilter !== "ALL" || statusFilter !== "ALL"
								? "Try adjusting your search or filter criteria"
								: "No users have been registered yet"
						}
						action={
							<button
								onClick={handleAddUser}
								className="btn bg-blue-600 text-white hover:bg-blue-700"
							>
								<FaPlus className="text-sm" />
								Add First User
							</button>
						}
					/>
				)}
			</div>
		</div>
	);
};

export default UsersPage;
