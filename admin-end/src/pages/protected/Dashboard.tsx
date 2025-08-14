import { useAuth } from "../../contexts/AuthContext";
import {
	FaUsers,
	FaBuilding,
	FaClipboardList,
	FaTags,
	FaEye,
	FaEdit,
} from "react-icons/fa";
import {
	useAllUsers,
	useAllAuthorityOffices,
	useAllReports,
	useAllCategories,
} from "../../api";

const StatCard = ({
	title,
	value,
	icon,
	color,
	isLoading,
}: {
	title: string;
	value: number | string;
	icon: React.ReactNode;
	color: string;
	isLoading?: boolean;
}) => (
	<div className="admin-card">
		<div className="flex items-center">
			<div className={`p-3 rounded-lg ${color}`}>{icon}</div>
			<div className="ml-4">
				<p className="text-sm font-medium text-gray-600">{title}</p>
				{isLoading ? (
					<div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
				) : (
					<p className="text-2xl font-bold text-gray-900">{value}</p>
				)}
			</div>
		</div>
	</div>
);

const RecentActivity = () => {
	const { data: reports, isLoading } = useAllReports();
	if (!reports) {
		return <p>No reports present</p>;
	}
	// const recentReports = reports?.slice(0, 5) || [];
	const recentReports = reports;

	if (isLoading) {
		return (
			<div className="admin-card">
				<h3 className="text-lg font-medium text-gray-900 mb-4">
					Recent Activity
				</h3>
				<div className="space-y-3">
					{[1, 2, 3, 4, 5].map((item) => (
						<div
							key={item}
							className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
						>
							<div className="flex items-center">
								<div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
								<div className="ml-3">
									<div className="h-4 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
									<div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="admin-card">
			<h3 className="text-lg font-medium text-gray-900 mb-4">
				Recent Activity
			</h3>
			<div className="space-y-3">
				{recentReports.length > 0 ? (
					recentReports.map((report) => (
						<div
							key={report.id}
							className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
						>
							<div className="flex items-center">
								<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
									<FaClipboardList className="text-blue-600 text-xs" />
								</div>
								<div className="ml-3">
									<p className="text-sm font-medium text-gray-900">
										New {report.category?.name || "report"} report
									</p>
									<p className="text-xs text-gray-500">
										{new Date(report.submittedAt).toLocaleTimeString()}
									</p>
								</div>
							</div>
							<button className="text-blue-600 hover:text-blue-800">
								<FaEye className="text-sm" />
							</button>
						</div>
					))
				) : (
					<p className="text-gray-500 text-center py-4">No recent activity</p>
				)}
			</div>
		</div>
	);
};

const QuickActions = () => (
	<div className="admin-card">
		<h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
		<div className="grid grid-cols-1 gap-3">
			<button className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
				<div className="flex items-center">
					<FaUsers className="text-blue-600 mr-3" />
					<span className="text-sm font-medium text-blue-900">
						Manage Users
					</span>
				</div>
				<FaEdit className="text-blue-600 text-xs" />
			</button>
			<button className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
				<div className="flex items-center">
					<FaBuilding className="text-green-600 mr-3" />
					<span className="text-sm font-medium text-green-900">
						Add Authority
					</span>
				</div>
				<FaEdit className="text-green-600 text-xs" />
			</button>
			<button className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
				<div className="flex items-center">
					<FaTags className="text-purple-600 mr-3" />
					<span className="text-sm font-medium text-purple-900">
						Manage Categories
					</span>
				</div>
				<FaEdit className="text-purple-600 text-xs" />
			</button>
		</div>
	</div>
);

const Dashboard = () => {
	const { user } = useAuth();
	const { data, isLoading: usersLoading } = useAllUsers();
	const { data: authorities, isLoading: authoritiesLoading } =
		useAllAuthorityOffices();
	const { data: reports, isLoading: reportsLoading } = useAllReports();
	const { data: categories, isLoading: categoriesLoading } = useAllCategories();

	const stats = {
		totalUsers: data?.length || 0,
		totalAuthorities: authorities?.length || 0,
		totalReports: reports?.length || 0,
		totalCategories: categories?.length || 0,
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
				<p className="text-gray-600 mt-2">
					Welcome back, {user?.name || "Admin"}! Here's what's happening with
					your system.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					title="Total Users"
					value={stats.totalUsers}
					icon={<FaUsers className="text-white text-lg" />}
					color="bg-blue-500"
					isLoading={usersLoading}
				/>
				<StatCard
					title="Authorities"
					value={stats.totalAuthorities}
					icon={<FaBuilding className="text-white text-lg" />}
					color="bg-green-500"
					isLoading={authoritiesLoading}
				/>
				<StatCard
					title="Reports"
					value={stats.totalReports}
					icon={<FaClipboardList className="text-white text-lg" />}
					color="bg-yellow-500"
					isLoading={reportsLoading}
				/>
				<StatCard
					title="Categories"
					value={stats.totalCategories}
					icon={<FaTags className="text-white text-lg" />}
					color="bg-purple-500"
					isLoading={categoriesLoading}
				/>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<RecentActivity />
				</div>
				<div>
					<QuickActions />
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
