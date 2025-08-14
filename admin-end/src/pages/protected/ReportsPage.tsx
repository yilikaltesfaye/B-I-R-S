import { useState } from "react";
import {
	FaSearch,
	FaEye,
	FaEdit,
	FaMapPin,
	FaClock,
	FaUser,
} from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { useAllReports, useUpdateReportStatus } from "../../api";
import { useCommentsByReportId } from "../../api/comments/queries";
import type { Report } from "../../types";
import { Status } from "../../types";

const StatusBadge = ({ status }: { status: Status }) => {
	const getStatusConfig = (status: Status) => {
		switch (status) {
			case Status.PENDING:
				return {
					color: "bg-yellow-100 text-yellow-800",
					label: "Pending",
				};
			case Status.IN_PROGRESS:
				return {
					color: "bg-blue-100 text-blue-800",
					label: "In Progress",
				};
			case Status.FIXED:
				return {
					color: "bg-green-100 text-green-800",
					label: "Fixed",
				};
			case Status.REJECTED:
				return {
					color: "bg-red-100 text-red-800",
					label: "Rejected",
				};
			default:
				return {
					color: "bg-gray-100 text-gray-800",
					label: "Unknown",
				};
		}
	};

	const config = getStatusConfig(status);

	return <span className={`status-badge ${config.color}`}>{config.label}</span>;
};

const ReportCard = ({
	report,
	onView,
	onEdit,
}: {
	report: Report;
	onView: (report: Report) => void;
	onEdit: (report: Report) => void;
}) => (
	<div className="admin-card hover:shadow-lg transition-shadow">
		<div className="flex justify-between items-start mb-4">
			<div className="flex-1">
				<div className="flex items-center gap-2 mb-2">
					<h3 className="font-semibold text-gray-900">
						{report.category?.name || "Uncategorized"}
					</h3>
					<StatusBadge status={report.status} />
				</div>
				<p className="text-gray-600 text-sm mb-3 line-clamp-2">
					{report.description}
				</p>
			</div>
		</div>

		<div className="space-y-2 text-sm text-gray-500 mb-4">
			<div className="flex items-center gap-2">
				<FaUser className="text-xs" />
				<span>Reported by: {report.user?.name || "Unknown"}</span>
			</div>
			<div className="flex items-center gap-2">
				<FaMapPin className="text-xs" />
				<span>
					{report.address
						? `${report.address.city || ""}, ${report.address.region || ""}`
						: "No location"}
				</span>
			</div>
			<div className="flex items-center gap-2">
				<FaClock className="text-xs" />
				<span>
					{report.submittedAt
						? new Date(report.submittedAt).toLocaleDateString()
						: "Unknown date"}
				</span>
			</div>
			{report.authorityOffice && (
				<div className="flex items-center gap-2">
					<span className="text-xs">Assigned to:</span>
					<span className="text-blue-600 text-xs">
						{report.authorityOffice.officeName}
					</span>
				</div>
			)}
		</div>

		<div className="flex justify-between items-center pt-4 border-t border-gray-100">
			<div className="text-xs text-gray-400">
				Last updated:{" "}
				{report.updatedAt
					? new Date(report.updatedAt).toLocaleDateString()
					: "Unknown"}
			</div>
			<div className="flex gap-2">
				<button
					onClick={() => onView(report)}
					className="action-button text-blue-600 hover:bg-blue-50"
				>
					<FaEye className="text-xs" />
					View
				</button>
				<button
					onClick={() => onEdit(report)}
					className="action-button text-green-600 hover:bg-green-50"
				>
					<FaEdit className="text-xs" />
					Manage
				</button>
			</div>
		</div>
	</div>
);

const ReportViewModal = ({
	report,
	onClose,
}: {
	report: Report;
	onClose: () => void;
}) => {
	const { data, isLoading, error } = useCommentsByReportId(report.id);
	const comments = data?.data || [];
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-lg">
				<h2 className="text-xl font-bold mb-4">Report Details</h2>
				<div className="mb-2">
					<strong>Category:</strong> {report.category?.name || "Uncategorized"}
				</div>
				<div className="mb-2">
					<strong>Description:</strong> {report.description}
				</div>
				<div className="mb-2">
					<strong>Status:</strong> {report.status}
				</div>
				<div className="mb-2">
					<strong>Reported by:</strong> {report.user?.name || "Unknown"}
				</div>
				<div className="mb-2">
					<strong>Location:</strong>{" "}
					{report.address
						? `${report.address.city || ""}, ${report.address.region || ""}`
						: "No location"}
				</div>
				<div className="mb-2">
					<strong>Submitted at:</strong>{" "}
					{report.submittedAt
						? new Date(report.submittedAt).toLocaleString()
						: "Unknown"}
				</div>
				<div className="mb-2">
					<strong>Last updated:</strong>{" "}
					{report.updatedAt
						? new Date(report.updatedAt).toLocaleString()
						: "Unknown"}
				</div>
				<div className="mt-6">
					<h3 className="text-lg font-semibold mb-2">Comments</h3>
					{isLoading ? (
						<div>Loading comments...</div>
					) : error ? (
						<div className="text-red-500">Failed to load comments.</div>
					) : comments.length === 0 ? (
						<div className="text-gray-500">No comments yet.</div>
					) : (
						<ul className="space-y-2 max-h-40 overflow-y-auto">
							{comments.map((comment) => (
								<li key={comment.id} className="border-b pb-2">
									<div className="text-sm text-gray-800 font-medium">
										{comment.user?.name || "Unknown"}
									</div>
									<div className="text-xs text-gray-500 mb-1">
										{new Date(comment.createdAt).toLocaleString()}
									</div>
									<div className="text-gray-700 text-sm">{comment.content}</div>
								</li>
							))}
						</ul>
					)}
				</div>
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

const ReportEditModal = ({
	report,
	onClose,
	onUpdate,
}: {
	report: Report;
	onClose: () => void;
	onUpdate: (status: Status) => void;
}) => {
	const [status, setStatus] = useState<Status>(report.status);
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<h2 className="text-xl font-bold mb-4">Manage Report</h2>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Status</label>
					<select
						value={status}
						onChange={(e) => setStatus(e.target.value as Status)}
						className="w-full border border-gray-300 rounded-md px-3 py-2"
					>
						<option value={Status.PENDING}>Pending</option>
						<option value={Status.IN_PROGRESS}>In Progress</option>
						<option value={Status.FIXED}>Fixed</option>
						<option value={Status.REJECTED}>Rejected</option>
					</select>
				</div>
				<div className="flex justify-end space-x-2">
					<button
						onClick={onClose}
						className="btn bg-gray-200 hover:bg-gray-300"
					>
						Cancel
					</button>
					<button
						onClick={() => onUpdate(status)}
						className="btn bg-blue-600 text-white hover:bg-blue-700"
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
};

const ReportsPage = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");
	const [categoryFilter, setCategoryFilter] = useState("ALL");
	const [viewReport, setViewReport] = useState<Report | null>(null);
	const [editReport, setEditReport] = useState<Report | null>(null);
	const updateReportStatusMutation = useUpdateReportStatus();

	const { data: reports, isLoading, error } = useAllReports();
	if (!reports) return <p>No reports Found</p>;
	const filteredReports =
		reports?.filter((report) => {
			const matchesSearch =
				report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				report.category?.name
					?.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				report.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesStatus =
				statusFilter === "ALL" || report.status === statusFilter;
			const matchesCategory =
				categoryFilter === "ALL" || report.category?.name === categoryFilter;

			return matchesSearch && matchesStatus && matchesCategory;
		}) || [];

	console.log(reports.filter((r) => r.status == Status.FIXED));
	const statusCounts = {
		total: reports?.length || 0,
		pending: reports?.filter((r) => r.status === Status.PENDING).length || 0,
		inProgress:
			reports?.filter((r) => r.status === Status.IN_PROGRESS).length || 0,
		fixed: reports?.filter((r) => r.status === Status.FIXED).length || 0,
		rejected: reports?.filter((r) => r.status === Status.REJECTED).length || 0,
	};

	// Get unique categories for filter
	const categories = reports
		? [...new Set(reports.map((r) => r.category?.name).filter(Boolean))]
		: [];

	const handleView = (report: Report) => {
		setViewReport(report);
	};

	const handleEdit = (report: Report) => {
		setEditReport(report);
	};

	const handleUpdateReport = (status: Status) => {
		if (editReport) {
			updateReportStatusMutation.mutate({ id: editReport.id, status });
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
					Error Loading Reports
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
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Reports Management</h1>
				<p className="text-gray-600 mt-2">
					Monitor and manage all infrastructure reports in the system
				</p>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
				<div className="admin-card text-center">
					<div className="text-2xl font-bold text-gray-900">
						{statusCounts.total}
					</div>
					<div className="text-sm text-gray-500">Total Reports</div>
				</div>
				<div className="admin-card text-center">
					<div className="text-2xl font-bold text-yellow-600">
						{statusCounts.pending}
					</div>
					<div className="text-sm text-gray-500">Pending</div>
				</div>
				<div className="admin-card text-center">
					<div className="text-2xl font-bold text-blue-600">
						{statusCounts.inProgress}
					</div>
					<div className="text-sm text-gray-500">In Progress</div>
				</div>
				<div className="admin-card text-center">
					<div className="text-2xl font-bold text-green-600">
						{statusCounts.fixed}
					</div>
					<div className="text-sm text-gray-500">Fixed</div>
				</div>
				<div className="admin-card text-center">
					<div className="text-2xl font-bold text-red-600">
						{statusCounts.rejected}
					</div>
					<div className="text-sm text-gray-500">Rejected</div>
				</div>
			</div>

			{/* Filters */}
			<div className="admin-card">
				<div className="flex flex-col lg:flex-row gap-4">
					<div className="flex-1">
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<FaSearch className="h-4 w-4 text-gray-400" />
							</div>
							<input
								type="text"
								placeholder="Search reports..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							/>
						</div>
					</div>
					<div className="flex gap-2">
						<select
							value={statusFilter}
							onChange={(e) =>
								setStatusFilter(e.target.value as Status | "ALL")
							}
							className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="ALL">All Status</option>
							<option value={Status.PENDING}>Pending</option>
							<option value={Status.IN_PROGRESS}>In Progress</option>
							<option value={Status.FIXED}>Fixed</option>
							<option value={Status.REJECTED}>Rejected</option>
						</select>
						<select
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="ALL">All Categories</option>
							{categories.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{/* Reports Grid */}
			{filteredReports.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredReports.map((report) => (
						<ReportCard
							key={report.id}
							report={report}
							onView={handleView}
							onEdit={handleEdit}
						/>
					))}
				</div>
			) : (
				<EmptyState
					icon={<FaSearch className="text-4xl" />}
					title="No Reports Found"
					description={
						searchTerm || statusFilter !== "ALL" || categoryFilter !== "ALL"
							? "Try adjusting your search or filter criteria"
							: "No reports have been submitted yet"
					}
				/>
			)}
			{/* View Modal */}
			{viewReport && (
				<ReportViewModal
					report={viewReport}
					onClose={() => setViewReport(null)}
				/>
			)}
			{/* Edit Modal */}
			{editReport && (
				<ReportEditModal
					report={editReport}
					onClose={() => setEditReport(null)}
					onUpdate={handleUpdateReport}
				/>
			)}
		</div>
	);
};

export default ReportsPage;
