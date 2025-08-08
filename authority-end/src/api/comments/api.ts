import type { CreateCommentPayload } from "../../types";
import { apiClient } from "../client";
import { type Comment } from "../../types";

export const commentsApi = {
	getAllCommentsByReportId: (reportId: string) =>
		apiClient.get<{ title: string; data: Comment[] }>(`/comments/${reportId}`),
};
