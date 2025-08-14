import { useMutation } from "@tanstack/react-query";
import { commentsApi } from "./api";
import { queryClient } from "../client";

export const useCreateComment = () => {
	return useMutation({
		mutationFn: commentsApi.createComment,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["comments"] });
		},
	});
};

export const useDeleteComment = () => {
	return useMutation({
		mutationFn: commentsApi.deleteComment,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["comments"] });
		},
	});
};
