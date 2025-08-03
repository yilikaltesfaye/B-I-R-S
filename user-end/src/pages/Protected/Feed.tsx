// src/pages/DashboardPage.tsx

// import { useAuth } from "@/context/AuthContext";
import { Link, Navigate } from "react-router";
import { ReportCard } from "@/components/ReportCard";
import { useAuth } from "@/contexts/AuthContext";
import { useFilteredReports, useReportsByUserId } from "@/api";
import type { GetFilteredReportsPayload } from "@/types";

export default function DashboardPage() {
	const { user } = useAuth();
	if (!user) return <Navigate to="/login" />;
	const { data: forUser, isLoading } = useReportsByUserId(user?.id!);
	const payload: GetFilteredReportsPayload = {
		region: user.address.region,
		zone: user?.address.zone,
		woreda: user?.address.woreda,
		city: user?.address.city,
		subCity: user?.address.subCity,
		kebele: user?.address.kebele,
		status: "PENDING",
	};
	const { data, isLoading: loadingPublic } = useFilteredReports(payload);
	const userReports = forUser?.data.data;

	// const [selectedTab, setSelectedTab] = useState<"public" | "user">("public");

	const reports = data?.data.filter((report) => report.user.id !== user.id);

	return (
		<div className="p-6 space-y-6">
			<header className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Welcome, {user?.name}</h1>
					<p className="text-muted-foreground text-sm">
						Report broken infrastructure and view your activity.
					</p>
				</div>
				<div className="flex gap-4">
					<Link to="/report/new">
						<button>Submit New Report</button>
					</Link>
					<Link to="/reports">
						<button>View Your Reports</button>
					</Link>
				</div>
			</header>

			<section>
				<h2 className="text-lg font-medium mb-4">Your Recent Reports</h2>
				{isLoading ? (
					<p>Loading...</p>
				) : userReports && userReports.length > 0 ? (
					<div className="grid gap-4">
						{userReports.slice(0, 5).map((report) => (
							<ReportCard key={report.id} report={report} />
						))}
					</div>
				) : (
					<p className="text-muted-foreground">No reports submitted yet.</p>
				)}
			</section>
			<section>
				<h2 className="text-lg font-medium mb-4">Other Reports Submitted</h2>
				{loadingPublic ? (
					<p>Loading...</p>
				) : reports && reports.length > 0 ? (
					<div className="grid gap-4">
						{reports.slice(0, 5).map((report) => (
							<ReportCard key={report.id} report={report} />
						))}
					</div>
				) : (
					<p className="text-muted-foreground">
						No other reports submitted yet.
					</p>
				)}
			</section>
		</div>
	);
}
