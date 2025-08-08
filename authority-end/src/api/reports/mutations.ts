import type { Status } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../client";
import { reportsApi } from "./api";

export const useUpdateReportStatus = () => {
	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: Status }) =>
			reportsApi.updateReportStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["reports"] });
			queryClient.invalidateQueries({ queryKey: ["authority"] });
		},
	});
};
