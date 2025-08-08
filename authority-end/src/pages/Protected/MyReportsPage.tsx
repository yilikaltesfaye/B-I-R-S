// import { useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useReportsByUserId } from "@/api";
import { ReportCard } from "@/components/ReportCard";
// import { useFilteredReports, useReportsByUserId } from "@/api";
// import type { GetFilteredReportsPayload } from "@/types";
// import { usePublicReports, useReportsByUserId } from "@/api"; // hypothetical hooks

const MyReportsPage = () => {
	const { user } = useAuth();
	// const [selectedTab, setSelectedTab] = useState<"public" | "user">("public");

	if (!user) return <Navigate to="/login" />;

	// const payload: GetFilteredReportsPayload = {
	// 	region: user.address.region,
	// 	zone: user?.address.zone,
	// 	woreda: user?.address.woreda,
	// 	city: user?.address.city,
	// 	subCity: user?.address.subCity,
	// 	kebele: user?.address.kebele,
	// 	status: "PENDING",
	// };

	// const { data: reports, isLoading: loadingPublic } =
	// 	useFilteredReports(payload);
	const { data, isLoading } = useReportsByUserId(user.id);
	console.log(data?.data.data);

	const reportsToShow = data?.data.data;

	return (
		<main className="p-6 space-y-6">
			{/* Top Bar */}
			<header>
				<h1 className="text-2xl cursive font-semibold">Your Reports</h1>
			</header>
			{isLoading ? (
				<p>Loading reports...</p>
			) : Array.isArray(reportsToShow) && reportsToShow.length > 0 ? (
				<ul className="flex flex-wrap gap-5 justify-between">
					{reportsToShow
						.sort(
							(a, b) =>
								new Date(b.submittedAt).getTime() -
								new Date(a.submittedAt).getTime()
						)
						.map((report) => (
							<li key={report.id}>
								<ReportCard report={report} />
							</li>
						))}
				</ul>
			) : (
				<p>No reports found.</p>
			)}
		</main>
	);
};

export default MyReportsPage;
