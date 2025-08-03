import { Link } from "react-router";
import type { Report } from "@/types";
import { timeAgo } from "@/lib/timeAgo";

interface Props {
	report: Report;
}

export const ReportCard = ({ report }: Props) => {
	return (
		<Link to={`/reports/${report.id}`} className="block">
			<div className="border border-gray-300 rounded-md p-4 mb-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
				<div className="flex justify-between items-start">
					<div className="flex-1 pr-4">
						<h3 className="text-lg font-semibold truncate">
							{report.description || "No description provided"}
						</h3>
						<p className="text-sm text-gray-500 mt-1">
							Submitted {timeAgo(report.submittedAt)}
						</p>
					</div>
					<span className="text-xs font-medium text-white bg-blue-600 rounded-full px-2 py-1 capitalize whitespace-nowrap">
						{String(report.status).toLowerCase()}
					</span>
				</div>

				<div className="flex justify-between mt-3 text-sm text-gray-600">
					<span>{report.address?.region || "Unknown location"}</span>
					{report.category && <span> {report.category.name}</span>}
					<p>Reported By {report.user.name}</p>
				</div>
			</div>
		</Link>
	);
};
