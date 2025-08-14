import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsApi } from "./api";
import { QUERY_KEYS } from "../constants";
import toast from "react-hot-toast";
import type { Status } from "../../types";

export const useUpdateReportStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: Status }) =>
			reportsApi.updateReportStatus(id, status),

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REPORTS.ALL });
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.REPORTS.BY_ID(variables.id),
			});
			toast.success("Report status updated successfully");
		},

		onError: () => {
			toast.error("Failed to update report status");
		},
	});
};
