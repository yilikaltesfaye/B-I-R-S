import { useAuth } from "../../contexts/AuthContext";
import { useAuthorityReports } from "../../api/reports/queries";
import { Status } from "../../types";
import {
	FiTrendingUp,
	FiTrendingDown,
	FiClock,
	FiCheckCircle,
	FiBarChart,
	FiPieChart,
} from "react-icons/fi";

const Analytics = () => {
	const { authority, authorityOffice } = useAuth();
	const { data: reportsData, isLoading } = useAuthorityReports();

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 p-6">
				<div className="max-w-7xl mx-auto">
					<div className="animate-pulse">
						<div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
							{[...Array(4)].map((_, i) => (
								<div
									key={i}
									className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
								>
									<div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
									<div className="h-8 bg-gray-200 rounded w-1/2"></div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	const reports = reportsData?.data || [];

	const analytics = {
		total: reports.length,
		pending: reports.filter((r) => r.status === Status.PENDING).length,
		inProgress: reports.filter((r) => r.status === Status.IN_PROGRESS).length,
		fixed: reports.filter((r) => r.status === Status.FIXED).length,
		rejected: reports.filter((r) => r.status === Status.REJECTED).length,
	};

	// Calculate completion rate
	const completionRate =
		analytics.total > 0
			? Math.round(
					((analytics.fixed + analytics.rejected) / analytics.total) * 100
			  )
			: 0;

	const StatusCard = ({ title, value, icon: Icon, color, trend }: any) => (
		<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-gray-600">{title}</p>
					<div className="flex items-center space-x-2">
						<p className="text-2xl font-bold text-gray-900">{value}</p>
						{trend && (
							<div
								className={`flex items-center text-sm ${
									trend > 0 ? "text-green-600" : "text-red-600"
								}`}
							>
								{trend > 0 ? (
									<FiTrendingUp className="h-4 w-4" />
								) : (
									<FiTrendingDown className="h-4 w-4" />
								)}
								<span>{Math.abs(trend)}%</span>
							</div>
						)}
					</div>
				</div>
				<div className={`p-3 rounded-lg ${color}`}>
					<Icon className="h-6 w-6 text-white" />
				</div>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto p-6">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Analytics Dashboard
					</h1>
					<div className="text-gray-600">
						<p>
							Performance metrics for{" "}
							{authorityOffice?.authorityOffice.officeName}
						</p>
						<p className="text-sm">Managed by: {authority?.name}</p>
					</div>
				</div>

				{/* Key Metrics */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<StatusCard
						title="Total Reports"
						value={analytics.total}
						icon={FiBarChart}
						color="bg-blue-600"
					/>
					<StatusCard
						title="Pending"
						value={analytics.pending}
						icon={FiClock}
						color="bg-yellow-600"
					/>
					<StatusCard
						title="In Progress"
						value={analytics.inProgress}
						icon={FiTrendingUp}
						color="bg-indigo-600"
					/>
					<StatusCard
						title="Completed"
						value={analytics.fixed}
						icon={FiCheckCircle}
						color="bg-green-600"
					/>
				</div>

				{/* Performance Metrics */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					{/* Completion Rate */}
					<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Completion Rate
							</h3>
							<FiPieChart className="h-5 w-5 text-gray-400" />
						</div>
						<div className="flex items-center space-x-4">
							<div className="flex-1">
								<div className="w-full bg-gray-200 rounded-full h-3">
									<div
										className="bg-green-600 h-3 rounded-full transition-all duration-300"
										style={{ width: `${completionRate}%` }}
									></div>
								</div>
							</div>
							<div className="text-2xl font-bold text-gray-900">
								{completionRate}%
							</div>
						</div>
						<p className="text-sm text-gray-600 mt-2">
							{analytics.fixed + analytics.rejected} of {analytics.total}{" "}
							reports resolved
						</p>
					</div>
				</div>

				{/* Status Distribution */}
				<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
					<h3 className="text-lg font-semibold text-gray-900 mb-6">
						Status Distribution
					</h3>
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="text-center">
							<div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
								<span className="text-lg font-bold text-yellow-600">
									{analytics.pending}
								</span>
							</div>
							<p className="text-sm text-gray-600">Pending</p>
							<p className="text-xs text-gray-500">
								{analytics.total > 0
									? Math.round((analytics.pending / analytics.total) * 100)
									: 0}
								%
							</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
								<span className="text-lg font-bold text-blue-600">
									{analytics.inProgress}
								</span>
							</div>
							<p className="text-sm text-gray-600">In Progress</p>
							<p className="text-xs text-gray-500">
								{analytics.total > 0
									? Math.round((analytics.inProgress / analytics.total) * 100)
									: 0}
								%
							</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
								<span className="text-lg font-bold text-green-600">
									{analytics.fixed}
								</span>
							</div>
							<p className="text-sm text-gray-600">Fixed</p>
							<p className="text-xs text-gray-500">
								{analytics.total > 0
									? Math.round((analytics.fixed / analytics.total) * 100)
									: 0}
								%
							</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
								<span className="text-lg font-bold text-red-600">
									{analytics.rejected}
								</span>
							</div>
							<p className="text-sm text-gray-600">Rejected</p>
							<p className="text-xs text-gray-500">
								{analytics.total > 0
									? Math.round((analytics.rejected / analytics.total) * 100)
									: 0}
								%
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Analytics;
