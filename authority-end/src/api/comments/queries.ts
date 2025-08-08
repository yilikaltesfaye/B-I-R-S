// React Query hooks for each API method

import { useQuery } from "@tanstack/react-query";
import { commentsApi } from "./api";

export const useCommentsByReportId = (reportId: string) => {
	return useQuery({
		queryKey: ["comments", reportId],
		queryFn: () =>
			commentsApi.getAllCommentsByReportId(reportId).then((res) => res.data),
	});
};
