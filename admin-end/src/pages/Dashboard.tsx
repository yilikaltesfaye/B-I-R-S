import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

import data from "../app/dashboard/data.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<SectionCards />
					<div className="px-4 lg:px-6"></div>
					<DataTable data={data} />
				</div>
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>Recent Reports</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-sm text-gray-500">
								Recent report activity would be displayed here...
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>System Overview</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-sm text-gray-500">
								System status and overview would be displayed here...
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
