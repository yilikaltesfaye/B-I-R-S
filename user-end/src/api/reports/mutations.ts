import type { CreateReportPayload } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../client";
import { reportsApi } from "./api";

// Create report mutation
export const useCreateReport = () => {
	return useMutation({
		mutationFn: (payload: CreateReportPayload) =>
			reportsApi.createReport(payload).then((res) => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["reports"] });
		},
	});
};
