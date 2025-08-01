import type { CreateCommentPayload } from "@/types";
import { apiClient } from "../client";
import { type Comment } from "@/types";

export const commentsApi = {
	createComment: (payload: CreateCommentPayload) =>
		apiClient.post<Comment>("/comments", payload),
	getAllCommentsByReportId: (reportId: string) =>
		apiClient.get<Comment[]>(`/comments/${reportId}`),
	deleteComment: (id: string) => apiClient.delete(`/comments/${id}`),
};
