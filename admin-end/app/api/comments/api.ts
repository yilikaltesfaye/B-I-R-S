import { apiClient } from "../client";
import { type Comment } from "../../types";

export const commentsApi = {
	getAllCommentsByReportId: (reportId: string) =>
		apiClient.get<Comment[]>(`/comments/${reportId}`),
	deleteComment: (id: string) => apiClient.delete(`/comments/${id}`),
};
