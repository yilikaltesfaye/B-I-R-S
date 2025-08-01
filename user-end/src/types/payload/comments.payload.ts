export interface CreateCommentPayload {
	content: string;
	reportId: string;
	replyToId?: string;
}
