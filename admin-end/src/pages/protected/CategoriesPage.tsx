import { useState } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaTags } from "react-icons/fa";
import { useUpdateCategory } from "../../api/category/mutations";

import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import {
	useAllCategories,
	useCreateCategory,
	useDeleteCategory,
} from "../../api";
import type { Category, CreateCategoryPayload } from "../../types";

// EditCategoryForm component
const EditCategoryForm = ({
	category,
	onClose,
	onSubmit,
}: {
	category: Category;
	onClose: () => void;
	onSubmit: (data: Partial<Category>) => void;
}) => {
	const [formData, setFormData] = useState({
		name: category.name || "",
		description: category.description || "",
		IconUrl: category.IconUrl || "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Edit Category
				</h3>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Category Name
						</label>
						<input
							type="text"
							required
							value={formData.name}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, name: e.target.value }))
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter category name"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Description
						</label>
						<textarea
							required
							value={formData.description}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									description: e.target.value,
								}))
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter category description"
							rows={3}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Icon URL (Optional)
						</label>
						<input
							type="url"
							value={formData.IconUrl}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, IconUrl: e.target.value }))
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
							placeholder="https://example.com/icon.png"
						/>
					</div>
					<div className="flex justify-end space-x-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
						>
							Save Changes
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

const CategoryCard = ({
	category,
	onEdit,
	onDelete,
}: {
	category: Category;
	onEdit: (category: Category) => void;
	onDelete: (category: Category) => void;
}) => (
	<div className="admin-card hover:shadow-lg transition-shadow">
		<div className="flex items-start justify-between mb-4">
			<div className="flex items-center">
				<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
					{category.IconUrl ? (
						<img
							src={category.IconUrl}
							alt={category.name}
							className="w-6 h-6"
						/>
					) : (
						<FaTags className="text-blue-600 text-lg" />
					)}
				</div>
				<div className="ml-3">
					<h3 className="text-lg font-semibold text-gray-900">
						{category.name}
					</h3>
				</div>
			</div>
			<div className="flex items-center space-x-2">
				<button
					onClick={() => onEdit(category)}
					className="action-button text-green-600 hover:bg-green-50"
				>
					<FaEdit className="text-sm" />
				</button>
				<button
					onClick={() => onDelete(category)}
					className="action-button text-red-600 hover:bg-red-50"
				>
					<FaTrash className="text-sm" />
				</button>
			</div>
		</div>

		<p className="text-gray-600 text-sm mb-4">{category.description}</p>

		<div className="space-y-3">
			<div>
				<h4 className="text-sm font-medium text-gray-700 mb-2">
					Assigned Authorities
				</h4>
				{category.authorityOffices && category.authorityOffices.length > 0 ? (
					<div className="flex flex-wrap gap-1">
						{category.authorityOffices.slice(0, 3).map((office) => (
							<span
								key={office.id}
								className="status-badge bg-blue-100 text-blue-800 text-xs"
							>
								{office.officeName}
							</span>
						))}
						{category.authorityOffices.length > 3 && (
							<span className="text-xs text-gray-500">
								+{category.authorityOffices.length - 3} more
							</span>
						)}
					</div>
				) : (
					<p className="text-xs text-gray-400">No authorities assigned</p>
				)}
			</div>
		</div>
	</div>
);

const AddCategoryForm = ({
	onClose,
	onSubmit,
}: {
	onClose: () => void;
	onSubmit: (data: CreateCategoryPayload) => void;
}) => {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		IconUrl: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Add New Category
				</h3>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Category Name
						</label>
						<input
							type="text"
							required
							value={formData.name}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, name: e.target.value }))
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter category name"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Description
						</label>
						<textarea
							required
							value={formData.description}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									description: e.target.value,
								}))
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter category description"
							rows={3}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Icon URL (Optional)
						</label>
						<input
							type="url"
							value={formData.IconUrl}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, IconUrl: e.target.value }))
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
							placeholder="https://example.com/icon.png"
						/>
					</div>

					<div className="flex justify-end space-x-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
						>
							Create Category
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

const CategoriesPage = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [showAddForm, setShowAddForm] = useState(false);
	const [editCategory, setEditCategory] = useState<Category | null>(null);
	const [showEditForm, setShowEditForm] = useState(false);

	const { data: categories, isLoading, error } = useAllCategories();
	const createCategoryMutation = useCreateCategory();
	const deleteCategoryMutation = useDeleteCategory();
	const updateCategoryMutation = useUpdateCategory();

	const filteredCategories =
		categories?.filter(
			(category) =>
				category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				category.description?.toLowerCase().includes(searchTerm.toLowerCase())
		) || [];
	console.log(categories);
	const handleEdit = (category: Category) => {
		setEditCategory(category);
		setShowEditForm(true);
	};

	const handleDelete = async (category: Category) => {
		if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
			deleteCategoryMutation.mutate(category.id);
		}
	};

	const handleAddCategory = (data: CreateCategoryPayload) => {
		createCategoryMutation.mutate(data);
	};

	const handleUpdateCategory = (data: any) => {
		if (editCategory) {
			updateCategoryMutation.mutate({ id: editCategory.id, data });
			setShowEditForm(false);
			setEditCategory(null);
		}
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
					Error Loading Categories
				</div>
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
					<h1 className="text-3xl font-bold text-gray-900">
						Categories Management
					</h1>
					<p className="text-gray-600 mt-2">
						Organize infrastructure issues into manageable categories
					</p>
				</div>
				<button
					onClick={() => setShowAddForm(true)}
					className="btn bg-blue-600 text-white hover:bg-blue-700"
				>
					<FaPlus className="text-sm" />
					Add Category
				</button>
			</div>

			{/* Search */}
			<div className="admin-card">
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<FaSearch className="h-4 w-4 text-gray-400" />
					</div>
					<input
						type="text"
						placeholder="Search categories..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					/>
				</div>
			</div>

			{/* Categories Grid */}
			{filteredCategories.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredCategories.map((category) => (
						<CategoryCard
							key={category.id}
							category={category}
							onEdit={handleEdit}
							onDelete={handleDelete}
						/>
					))}
				</div>
			) : (
				<EmptyState
					icon={<FaTags className="text-4xl" />}
					title="No Categories Found"
					description={
						searchTerm
							? "Try adjusting your search criteria"
							: "No categories have been created yet"
					}
					action={
						<button
							onClick={() => setShowAddForm(true)}
							className="btn bg-blue-600 text-white hover:bg-blue-700"
						>
							<FaPlus className="text-sm" />
							Add First Category
						</button>
					}
				/>
			)}
			{showEditForm && editCategory && (
				<EditCategoryForm
					category={editCategory}
					onClose={() => setShowEditForm(false)}
					onSubmit={handleUpdateCategory}
				/>
			)}

			{/* Add Category Modal */}
			{showAddForm && (
				<AddCategoryForm
					onClose={() => setShowAddForm(false)}
					onSubmit={handleAddCategory}
				/>
			)}
		</div>
	);
};

export default CategoriesPage;
