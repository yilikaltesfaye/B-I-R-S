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
		<main>
			{/* Top Bar */}
			<header>
				<h1>Your Reports</h1>
				{/* Optional: add search/filter controls here */}
			</header>

			{/* Tab Bar */}
			{/* <nav>
				<button
					onClick={() => setSelectedTab("public")}
					aria-current={selectedTab === "public" ? "page" : undefined}
				>
					Public Reports
				</button>
				<button
					onClick={() => setSelectedTab("user")}
					aria-current={selectedTab === "user" ? "page" : undefined}
				>
					Your Reports
				</button>
			</nav> */}

			{/* Reports List */}
			{isLoading ? (
				<p>Loading reports...</p>
			) : Array.isArray(reportsToShow) && reportsToShow.length > 0 ? (
				<ul>
					{reportsToShow.map((report) => (
						<li>
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
