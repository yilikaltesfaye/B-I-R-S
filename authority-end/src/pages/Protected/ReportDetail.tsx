import { useParams, useNavigate } from "react-router";
import { useReportById } from "../../api/reports/queries";
import { useCommentsByReportId } from "../../api/comments/queries";
import { useUpdateReportStatus } from "../../api/reports/mutations";
import { Status } from "../../types";
import { useState } from "react";
import { FiArrowLeft, FiMapPin, FiClock, FiUser, FiBuilding, FiPhone, FiMail } from "react-icons/fi";
import { CommentItem } from "../../components/CommentItem";

const StatusBadge = ({ status }: { status: Status }) => {
	const getStatusConfig = (status: Status) => {
		switch (status) {
			case Status.PENDING:
				return { color: "bg-yellow-100 text-yellow-800", label: "Pending" };
			case Status.IN_PROGRESS:
				return { color: "bg-blue-100 text-blue-800", label: "In Progress" };
			case Status.FIXED:
				return { color: "bg-green-100 text-green-800", label: "Fixed" };
			case Status.REJECTED:
				return { color: "bg-red-100 text-red-800", label: "Rejected" };
			default:
				return { color: "bg-gray-100 text-gray-800", label: "Unknown" };
		}
	};

	const config = getStatusConfig(status);

	return (
		<span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
			{config.label}
		</span>
	);
};

const ReportDetail = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { data: reportData, isLoading: reportLoading, error: reportError } = useReportById(id!);
	const { data: commentsData, isLoading: commentsLoading } = useCommentsByReportId(id!);
	const { mutate: updateStatus, isPending } = useUpdateReportStatus();
	const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

	if (reportLoading) {
		return (
			<div className="min-h-screen bg-gray-50 p-6">
				<div className="max-w-4xl mx-auto">
					<div className="animate-pulse">
						<div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
						<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
							<div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
							<div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
							<div className="h-4 bg-gray-200 rounded w-2/3"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (reportError || !reportData) {
		return (
			<div className="min-h-screen bg-gray-50 p-6">
				<div className="max-w-4xl mx-auto">
					<button 
						onClick={() => navigate(-1)}
						className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
					>
						<FiArrowLeft size={16} />
						Back to Dashboard
					</button>
					<div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
						<div className="text-red-600 font-medium mb-2">Report Not Found</div>
						<div className="text-red-500 text-sm">The requested report could not be loaded</div>
					</div>
				</div>
			</div>
		);
	}

	const report = reportData.data;
	const comments = commentsData?.data || [];
	const currentStatus = selectedStatus || report.status;

	const handleStatusUpdate = () => {
		if (selectedStatus && selectedStatus !== report.status) {
			updateStatus({ id: report.id, status: selectedStatus });
			setSelectedStatus(null);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-4xl mx-auto">
				{/* Back Button */}
				<button 
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
				>
					<FiArrowLeft size={16} />
					Back to Dashboard
				</button>

				{/* Report Header */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<div className="flex justify-between items-start mb-4">
						<div className="flex-1">
							<h1 className="text-2xl font-bold text-gray-900 mb-2">{report.category.name} Report</h1>
							<StatusBadge status={report.status} />
						</div>
					</div>

					<div className="mb-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
						<p className="text-gray-700 leading-relaxed">{report.description}</p>
					</div>

					{/* Report Details */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
						<div>
							<h3 className="font-semibold text-gray-900 mb-3">Report Information</h3>
							<div className="space-y-2 text-sm">
								<div className="flex items-center gap-2">
									<FiUser size={14} className="text-gray-500" />
									<span className="text-gray-500">Reported by:</span>
									<span className="font-medium">{report.user.name}</span>
								</div>
								<div className="flex items-center gap-2">
									<FiClock size={14} className="text-gray-500" />
									<span className="text-gray-500">Submitted:</span>
									<span className="font-medium">{new Date(report.submittedAt).toLocaleDateString()}</span>
								</div>
								<div className="flex items-center gap-2">
									<FiMapPin size={14} className="text-gray-500" />
									<span className="text-gray-500">Location:</span>
									<span className="font-medium">{report.address.city}, {report.address.region}</span>
								</div>
							</div>
						</div>

						<div>
							<h3 className="font-semibold text-gray-900 mb-3">Authority Office</h3>
							<div className="space-y-2 text-sm">
								<div className="flex items-center gap-2">
									<FiBuilding size={14} className="text-gray-500" />
									<span className="font-medium">{report.authorityOffice.officeName}</span>
								</div>
								<div className="flex items-center gap-2">
									<FiMapPin size={14} className="text-gray-500" />
									<span>{report.authorityOffice.address.city}, {report.authorityOffice.address.region}</span>
								</div>
							</div>
						</div>
					</div>

					{/* Status Update Section */}
					<div className="border-t pt-4">
						<h3 className="font-semibold text-gray-900 mb-3">Update Report Status</h3>
						<div className="flex items-center gap-4">
							<select
								value={currentStatus}
								onChange={(e) => setSelectedStatus(e.target.value as Status)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value={Status.PENDING}>Pending</option>
								<option value={Status.IN_PROGRESS}>In Progress</option>
								<option value={Status.FIXED}>Fixed</option>
								<option value={Status.REJECTED}>Rejected</option>
							</select>
							{selectedStatus && selectedStatus !== report.status && (
								<button
									onClick={handleStatusUpdate}
									disabled={isPending}
									className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isPending ? "Updating..." : "Update Status"}
								</button>
							)}
						</div>
					</div>
				</div>

				{/* Comments Section */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">
						Comments ({comments.length})
					</h2>
					
					{commentsLoading ? (
						<div className="space-y-4">
							{[...Array(3)].map((_, i) => (
								<div key={i} className="animate-pulse">
									<div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
									<div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
									<div className="h-3 bg-gray-200 rounded w-3/4"></div>
								</div>
							))}
						</div>
					) : comments.length > 0 ? (
						<div className="space-y-4">
							{comments.map((comment) => (
								<CommentItem key={comment.id} comment={comment} />
							))}
						</div>
					) : (
						<div className="text-center py-8 text-gray-500">
							<p>No comments yet on this report.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ReportDetail;
