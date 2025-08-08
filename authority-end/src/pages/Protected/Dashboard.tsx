import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthorityReports } from "../../api/reports/queries";
import { useUpdateReportStatus } from "../../api/reports/mutations";
import { Status, Report } from "@/types";
import { FiMapPin, FiClock, FiUser, FiCheckCircle, FiXCircle, FiRotateCcw } from "react-icons/fi";

const StatusBadge = ({ status }: { status: Status }) => {
	const getStatusConfig = (status: Status) => {
		switch (status) {
			case Status.PENDING:
				return { color: "bg-yellow-100 text-yellow-800", icon: FiClock, label: "Pending" };
			case Status.IN_PROGRESS:
				return { color: "bg-blue-100 text-blue-800", icon: FiRotateCcw, label: "In Progress" };
			case Status.FIXED:
				return { color: "bg-green-100 text-green-800", icon: FiCheckCircle, label: "Fixed" };
			case Status.REJECTED:
				return { color: "bg-red-100 text-red-800", icon: FiXCircle, label: "Rejected" };
			default:
				return { color: "bg-gray-100 text-gray-800", icon: FiClock, label: "Unknown" };
		}
	};

	const config = getStatusConfig(status);
	const Icon = config.icon;

	return (
		<span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
			<Icon size={12} />
			{config.label}
		</span>
	);
};

const ReportCard = ({ report }: { report: Report }) => {
	const { mutate: updateStatus, isPending } = useUpdateReportStatus();
	const [selectedStatus, setSelectedStatus] = useState<Status>(report.status);

	const handleStatusUpdate = () => {
		if (selectedStatus !== report.status) {
			updateStatus({ id: report.id, status: selectedStatus });
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
			<div className="flex justify-between items-start mb-4">
				<div className="flex-1">
					<h3 className="font-semibold text-gray-900 mb-2">{report.category.name}</h3>
					<p className="text-gray-600 text-sm mb-3">{report.description}</p>
				</div>
				<StatusBadge status={report.status} />
			</div>

			<div className="space-y-2 text-sm text-gray-500 mb-4">
				<div className="flex items-center gap-2">
					<FiUser size={14} />
					<span>Reported by: {report.user.name}</span>
				</div>
				<div className="flex items-center gap-2">
					<FiMapPin size={14} />
					<span>{report.address.city}, {report.address.region}</span>
				</div>
				<div className="flex items-center gap-2">
					<FiClock size={14} />
					<span>Submitted: {new Date(report.submittedAt).toLocaleDateString()}</span>
				</div>
			</div>

			<div className="border-t pt-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<label htmlFor={`status-${report.id}`} className="text-sm font-medium text-gray-700">
							Update Status:
						</label>
						<select
							id={`status-${report.id}`}
							value={selectedStatus}
							onChange={(e) => setSelectedStatus(e.target.value as Status)}
							className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value={Status.PENDING}>Pending</option>
							<option value={Status.IN_PROGRESS}>In Progress</option>
							<option value={Status.FIXED}>Fixed</option>
							<option value={Status.REJECTED}>Rejected</option>
						</select>
					</div>
					{selectedStatus !== report.status && (
						<button
							onClick={handleStatusUpdate}
							disabled={isPending}
							className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isPending ? "Updating..." : "Update"}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

const Dashboard = () => {
	const { authority, authorityOffice } = useAuth();
	const { data: reportsData, isLoading, error } = useAuthorityReports();
	const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 p-6">
				<div className="max-w-7xl mx-auto">
					<div className="animate-pulse">
						<div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[...Array(6)].map((_, i) => (
								<div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
									<div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
									<div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
									<div className="h-3 bg-gray-200 rounded w-2/3"></div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 p-6">
				<div className="max-w-7xl mx-auto">
					<div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
						<div className="text-red-600 font-medium mb-2">Error Loading Reports</div>
						<div className="text-red-500 text-sm">Please try refreshing the page</div>
					</div>
				</div>
			</div>
		);
	}

	const reports = reportsData?.data || [];
	const filteredReports = statusFilter === "ALL" ? reports : reports.filter((report) => report.status === statusFilter);

	const statusCounts = {
		total: reports.length,
		pending: reports.filter(r => r.status === Status.PENDING).length,
		inProgress: reports.filter(r => r.status === Status.IN_PROGRESS).length,
		fixed: reports.filter(r => r.status === Status.FIXED).length,
		rejected: reports.filter(r => r.status === Status.REJECTED).length,
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto p-6">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Authority Dashboard</h1>
					<div className="text-gray-600">
						<p>Welcome, {authority?.name}</p>
						{authorityOffice && (
							<p className="text-sm">
								{authorityOffice.position} at {authorityOffice.authorityOffice.officeName}
							</p>
						)}
					</div>
				</div>

				{/* Statistics Cards */}
				<div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
					<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
						<div className="text-2xl font-bold text-gray-900">{statusCounts.total}</div>
						<div className="text-sm text-gray-500">Total Reports</div>
					</div>
					<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
						<div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
						<div className="text-sm text-gray-500">Pending</div>
					</div>
					<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
						<div className="text-2xl font-bold text-blue-600">{statusCounts.inProgress}</div>
						<div className="text-sm text-gray-500">In Progress</div>
					</div>
					<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
						<div className="text-2xl font-bold text-green-600">{statusCounts.fixed}</div>
						<div className="text-sm text-gray-500">Fixed</div>
					</div>
					<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
						<div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
						<div className="text-sm text-gray-500">Rejected</div>
					</div>
				</div>

				{/* Filters */}
				<div className="mb-6">
					<div className="flex items-center gap-4">
						<label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
							Filter by Status:
						</label>
						<select
							id="status-filter"
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value as Status | "ALL")}
							className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="ALL">All Reports</option>
							<option value={Status.PENDING}>Pending</option>
							<option value={Status.IN_PROGRESS}>In Progress</option>
							<option value={Status.FIXED}>Fixed</option>
							<option value={Status.REJECTED}>Rejected</option>
						</select>
					</div>
				</div>

				{/* Reports Grid */}
				{filteredReports.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredReports.map((report) => (
							<ReportCard key={report.id} report={report} />
						))}
					</div>
				) : (
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
						<div className="text-gray-500 text-lg font-medium mb-2">No Reports Found</div>
						<div className="text-gray-400 text-sm">
							{statusFilter === "ALL" 
								? "No reports have been assigned to your office yet."
								: `No ${statusFilter.toLowerCase().replace('_', ' ')} reports found.`
							}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
