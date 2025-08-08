// src/pages/DashboardPage.tsx

// import { useAuth } from "@/context/AuthContext";
import { Link, Navigate } from "react-router";
import { ReportCard } from "@/components/ReportCard";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthorityReports } from "@/api/reports/queries";

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

	const reports = data?.data.filter((report) => report.user.id !== user.id);

	return (
		<div className="p-6 space-y-6">
			<header className="flex flex-col lg:flex-row gap-5 items-center justify-between">
				<div className="self-start">
					<h1 className="text-2xl cursive font-semibold">
						Welcome, {user?.name}
					</h1>
					<p className="text-muted-foreground text-sm">
						Report broken infrastructure and view your activity.
					</p>
				</div>
				<div className="flex gap-4 self-start">
					<Link to="/report/new">
						<button className="btn">Submit New Report</button>
					</Link>
					<Link to="/reports">
						<button className="btn">View Your Reports</button>
					</Link>
				</div>
			</header>

			<section>
				<p className="text-lg cursive font-medium mb-4">Your Recent Reports</p>
				{isLoading ? (
					<p>Loading...</p>
				) : userReports && userReports.length > 0 ? (
					<div className="flex gap-4 justify-between flex-wrap">
						{userReports.slice(0, 3).map((report) => (
							<ReportCard key={report.id} report={report} />
						))}
					</div>
				) : (
					<p className="text-muted-foreground">No reports submitted yet.</p>
				)}
			</section>
			<section>
				<p className="text-lg cursive font-medium mb-4">
					Other Reports Submitted
				</p>
				{loadingPublic ? (
					<p>Loading...</p>
				) : reports && reports.length > 0 ? (
					<div className="flex gap-4 justify-between flex-wrap">
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
