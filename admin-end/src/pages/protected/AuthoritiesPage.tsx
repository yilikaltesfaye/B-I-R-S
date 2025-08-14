import { useState } from "react";
import {
	FaSearch,
	FaPlus,
	FaEdit,
	FaTrash,
	FaEye,
	FaBuilding,
} from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import {
	useAllAuthorityOffices,
	useDeleteAuthorityOffice,
	useCreateAuthorityOffice,
	useUpdateAuthorityOffice,
	useAssignCategoriesToOffice,
	useAuthorityStaff,
} from "../../api";
import { useAllCategories } from "../../api/category/queries";
import type { AuthorityOffice, Category } from "../../types";

const AuthorityRow = ({
	authority,
	onEdit,
	onDelete,
	onView,
	onAssign,
}: {
	authority: AuthorityOffice;
	onEdit: (authority: AuthorityOffice) => void;
	onDelete: (authority: AuthorityOffice) => void;
	onView: (authority: AuthorityOffice) => void;
	onAssign: (authority: AuthorityOffice) => void;
}) => {
	console.log(authority);

	return (
		<tr className="hover:bg-gray-50">
			<td className="admin-table td">
				<div className="flex items-center">
					<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
						{authority.iconUrl ? (
							<img
								src={authority.iconUrl}
								alt={authority.officeName}
								className="w-6 h-6"
							/>
						) : (
							<FaBuilding className="text-blue-600 text-sm" />
						)}
					</div>
					<div className="ml-3">
						<p className="text-sm font-medium text-gray-900">
							{authority.officeName}
						</p>
						<p className="text-xs text-gray-500">{authority.email}</p>
					</div>
				</div>
			</td>
			<td className="admin-table td">
				<span className="text-sm text-gray-900">{authority.phone}</span>
			</td>
			<td className="admin-table td">
				<span className="text-sm text-gray-900">
					{typeof authority.address === "string"
						? authority.address
						: "No address"}
				</span>
			</td>
			<td className="admin-table td">
				{authority.parentOffice ? (
					<span className="text-sm text-gray-600">
						{authority.parentOffice.officeName}
					</span>
				) : (
					<span className="text-sm text-gray-400">None</span>
				)}
			</td>
			<td className="admin-table td">
				<div className="flex flex-wrap gap-1">
					{authority.categories?.slice(0, 2).map((category) => (
						<span
							key={category.id}
							className="status-badge bg-purple-100 text-purple-800"
						>
							{category.name}
						</span>
					))}
					{(authority.categories?.length || 0) > 2 && (
						<span className="text-xs text-gray-500">
							+{(authority.categories?.length || 0) - 2} more
						</span>
					)}
					{(!authority.categories || authority.categories.length === 0) && (
						<span className="text-xs text-gray-400">No categories</span>
					)}
				</div>
				<button
					onClick={() => onAssign(authority)}
					className="action-button text-purple-600 hover:bg-purple-50 ml-2"
				>
					Assign
				</button>
			</td>
			<td className="admin-table td">
				<span
					className={`status-badge ${
						authority.isActive
							? "bg-green-100 text-green-800"
							: "bg-red-100 text-red-800"
					}`}
				>
					{authority.isActive ? "Active" : "Inactive"}
				</span>
			</td>
			<td className="admin-table td">
				<div className="flex items-center space-x-2">
					<button
						onClick={() => onView(authority)}
						className="action-button text-blue-600 hover:bg-blue-50"
					>
						<FaEye className="text-xs" />
					</button>
					<button
						onClick={() => onEdit(authority)}
						className="action-button text-green-600 hover:bg-green-50"
					>
						<FaEdit className="text-xs" />
					</button>
					<button
						onClick={() => onDelete(authority)}
						className="action-button text-red-600 hover:bg-red-50"
					>
						<FaTrash className="text-xs" />
					</button>
				</div>
			</td>
		</tr>
	);
};

interface AuthorityFormModalProps {
	initial?: Partial<AuthorityOffice>;
	onClose: () => void;
	onSubmit: (data: Partial<AuthorityOffice>) => void;
}
const AuthorityFormModal: React.FC<AuthorityFormModalProps> = ({
	initial,
	onClose,
	onSubmit,
}) => {
	const [form, setForm] = useState<Partial<AuthorityOffice>>(initial || {});
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<h2 className="text-xl font-bold mb-4">
					{initial && initial.officeName ? "Edit" : "Add"} Authority Office
				</h2>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						onSubmit(form);
					}}
					className="space-y-4"
				>
					<input
						className="input w-full"
						placeholder="Office Name"
						value={form.officeName || ""}
						onChange={(e) =>
							setForm((f) => ({ ...f, officeName: e.target.value }))
						}
						required
					/>
					<input
						className="input w-full"
						placeholder="Email"
						value={form.email || ""}
						onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
						required
					/>
					<input
						className="input w-full"
						placeholder="Phone"
						value={form.phone || ""}
						onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
						required
					/>
					<input
						className="input w-full"
						placeholder="Address (string)"
						value={
							typeof form.address === "string"
								? form.address
								: form.address
								? form.address.city
								: ""
						}
						onChange={(e) =>
							setForm((f) => ({
								...f,
								address: {
									city: e.target.value,
									region:
										typeof f.address === "object" && f.address.region
											? f.address.region
											: "",
									zone:
										typeof f.address === "object" && f.address.zone
											? f.address.zone
											: "",
									woreda:
										typeof f.address === "object" && f.address.woreda
											? f.address.woreda
											: "",
									subCity:
										typeof f.address === "object" && f.address.subCity
											? f.address.subCity
											: "",
									kebele:
										typeof f.address === "object" && f.address.kebele
											? f.address.kebele
											: "",
								},
							}))
						}
					/>
					<div className="flex justify-end space-x-2">
						<button type="button" onClick={onClose} className="btn">
							Cancel
						</button>
						<button type="submit" className="btn bg-blue-600 text-white">
							{initial && initial.officeName ? "Save" : "Add"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

interface AuthorityViewModalProps {
	authority: AuthorityOffice;
	onClose: () => void;
}
const AuthorityViewModal: React.FC<AuthorityViewModalProps> = ({
	authority,
	onClose,
}) => {
	const { data: staff } = useAuthorityStaff(authority.id);
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-lg">
				<h2 className="text-xl font-bold mb-4">{authority.officeName}</h2>
				<div className="mb-2">
					<strong>Email:</strong> {authority.email}
				</div>
				<div className="mb-2">
					<strong>Phone:</strong> {authority.phone}
				</div>
				<div className="mb-2">
					<strong>Address:</strong>{" "}
					{typeof authority.address === "string"
						? authority.address
						: "No address"}
				</div>
				<div className="mb-2">
					<strong>Status:</strong> {authority.isActive ? "Active" : "Inactive"}
				</div>
				<div className="mb-2">
					<strong>Categories:</strong>{" "}
					{authority.categories?.map((c) => c.name).join(", ") || "None"}
				</div>
				<div className="mb-2">
					<strong>Staff:</strong>
				</div>
				<ul className="list-disc ml-6 mb-2">
					{staff?.data?.length ? (
						staff.data.map((s: any) => (
							<li key={s.id}>
								{s.name} ({s.position})
							</li>
						))
					) : (
						<li>No staff</li>
					)}
				</ul>
				<div className="flex justify-end pt-4">
					<button
						onClick={onClose}
						className="btn bg-gray-200 hover:bg-gray-300"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

interface AssignCategoriesModalProps {
	authority: AuthorityOffice;
	onClose: () => void;
	onAssign: (categoryIds: number[]) => void;
}
const AssignCategoriesModal: React.FC<AssignCategoriesModalProps> = ({
	authority,
	onClose,
	onAssign,
}) => {
	const { data: categories } = useAllCategories();
	const [selected, setSelected] = useState<number[]>(
		authority.categories?.map((c) => c.id) || []
	);
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<h2 className="text-xl font-bold mb-4">Assign Categories</h2>
				<div className="mb-4">
					{categories?.map((cat: Category) => (
						<label key={cat.id} className="block mb-1">
							<input
								type="checkbox"
								checked={selected.includes(cat.id)}
								onChange={() =>
									setSelected((sel) =>
										sel.includes(cat.id)
											? sel.filter((id) => id !== cat.id)
											: [...sel, cat.id]
									)
								}
							/>
							<span className="ml-2">{cat.name}</span>
						</label>
					))}
				</div>
				<div className="flex justify-end space-x-2">
					<button onClick={onClose} className="btn">
						Cancel
					</button>
					<button
						onClick={() => onAssign(selected)}
						className="btn bg-blue-600 text-white"
					>
						Assign
					</button>
				</div>
			</div>
		</div>
	);
};

const AuthoritiesPage = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("ALL");
	const [showAdd, setShowAdd] = useState(false);
	const [showEdit, setShowEdit] = useState<AuthorityOffice | null>(null);
	const [showView, setShowView] = useState<AuthorityOffice | null>(null);
	const [showAssign, setShowAssign] = useState<AuthorityOffice | null>(null);

	const { data: authorities, isLoading, error } = useAllAuthorityOffices();
	const deleteAuthorityMutation = useDeleteAuthorityOffice();
	const createAuthorityMutation = useCreateAuthorityOffice();
	const updateAuthorityMutation = useUpdateAuthorityOffice();
	const assignCategoriesMutation = useAssignCategoriesToOffice();

	const filteredAuthorities =
		authorities?.filter((authority) => {
			const matchesSearch =
				authority.officeName
					?.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				authority.email?.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesStatus =
				statusFilter === "ALL" ||
				(statusFilter === "ACTIVE" && authority.isActive) ||
				(statusFilter === "INACTIVE" && !authority.isActive);

			return matchesSearch && matchesStatus;
		}) || [];

	const handleEdit = (authority: AuthorityOffice) => {
		setShowEdit(authority);
	};

	const handleDelete = async (authority: AuthorityOffice) => {
		if (
			window.confirm(`Are you sure you want to delete ${authority.officeName}?`)
		) {
			deleteAuthorityMutation.mutate(authority.id);
		}
	};

	const handleView = (authority: AuthorityOffice) => {
		setShowView(authority);
	};

	const handleAddAuthority = () => {
		setShowAdd(true);
	};

	const handleAssignCategories = (authority: AuthorityOffice) => {
		setShowAssign(authority);
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
				<div className="text-red-600 font-medium mb-2">
					Error Loading Authorities
				</div>
				<div className="text-red-500 text-sm">
					Please try refreshing the page
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						Authority Offices
					</h1>
					<p className="text-gray-600 mt-2">
						Manage government authority offices and their responsibilities
					</p>
				</div>
				<button
					onClick={handleAddAuthority}
					className="btn bg-blue-600 text-white hover:bg-blue-700"
				>
					<FaPlus className="text-sm" />
					Add Authority
				</button>
			</div>

			<div className="admin-card">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="flex-1">
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<FaSearch className="h-4 w-4 text-gray-400" />
							</div>
							<input
								type="text"
								placeholder="Search authorities..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							/>
						</div>
					</div>
					<div>
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

			<div className="admin-card overflow-hidden">
				{filteredAuthorities.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="admin-table">
							<thead className="bg-gray-50">
								<tr>
									<th className="admin-table th">Office Name</th>
									<th className="admin-table th">Phone</th>
									<th className="admin-table th">Address</th>
									<th className="admin-table th">Parent Office</th>
									<th className="admin-table th">Categories</th>
									<th className="admin-table th">Status</th>
									<th className="admin-table th">Actions</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredAuthorities.map((authority) => (
									<AuthorityRow
										key={authority.id}
										authority={authority}
										onEdit={handleEdit}
										onDelete={handleDelete}
										onView={handleView}
										onAssign={handleAssignCategories}
									/>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<EmptyState
						icon={<FaBuilding className="text-4xl" />}
						title="No Authority Offices Found"
						description={
							searchTerm || statusFilter !== "ALL"
								? "Try adjusting your search or filter criteria"
								: "No authority offices have been created yet"
						}
						action={
							<button
								onClick={handleAddAuthority}
								className="btn bg-blue-600 text-white hover:bg-blue-700"
							>
								<FaPlus className="text-sm" />
								Add First Authority
							</button>
						}
					/>
				)}
			</div>

			{showAdd && (
				<AuthorityFormModal
					onClose={() => setShowAdd(false)}
					onSubmit={(data) => {
						createAuthorityMutation.mutate(data);
						setShowAdd(false);
					}}
				/>
			)}
			{showEdit && (
				<AuthorityFormModal
					initial={showEdit}
					onClose={() => setShowEdit(null)}
					onSubmit={(data) => {
						updateAuthorityMutation.mutate({ id: showEdit.id, data });
						setShowEdit(null);
					}}
				/>
			)}
			{showView && (
				<AuthorityViewModal
					authority={showView}
					onClose={() => setShowView(null)}
				/>
			)}
			{showAssign && (
				<AssignCategoriesModal
					authority={showAssign}
					onClose={() => setShowAssign(null)}
					onAssign={(categoryIds) => {
						assignCategoriesMutation.mutate({ id: showAssign.id, categoryIds });
						setShowAssign(null);
					}}
				/>
			)}
		</div>
	);
};

export default AuthoritiesPage;
