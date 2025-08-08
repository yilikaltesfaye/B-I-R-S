import { Link } from "react-router";
import type { Report } from "@/types";
import { timeAgo } from "@/lib/timeAgo";

interface Props {
	report: Report;
}

export const ReportCard = ({ report }: Props) => {
	return (
		<Link to={`/reports/${report.id}`} className="block">
			<div className="border border-gray-300 rounded-md p-4 mb-4 hover:shadow-2xl shadow transition-shadow duration-200 cursor-pointer w-96">
				<div className="flex justify-between items-start">
					<div className="flex-1 pr-4">
						<p className="text-xl font-semibold truncate">
							{report.category && <span> {report.category.name}</span>}
						</p>
					</div>
					<span className="text-xs font-medium text-slate-50 bg-blue-600 rounded-full px-2 py-1 capitalize whitespace-nowrap">
						{String(report.status).toLowerCase()}
					</span>
				</div>

				<div className="flex flex-col justify-between mt-3 text-sm text-slate-900">
					<p className="text-base text-slate-800 mt-1 mb-5 text-wrap">
						{report.description || "No description provided"}
					</p>
					<p>{report.address?.region || "Unknown location"}</p>
					<p>
						Submitted{" "}
						<span className="font-extrabold">
							{timeAgo(report.submittedAt)}
						</span>
					</p>
					<p>
						Reported By{" "}
						<span className="font-extrabold">{report.user.name}</span>
					</p>
				</div>
			</div>
		</Link>
	);
};
