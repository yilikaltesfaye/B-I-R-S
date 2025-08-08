import { useReportById } from "@/api/reports/queries";
import { useCommentsByReportId } from "@/api/comments/queries";
// Authority users have read-only access to comments
import { useState } from "react";
import { useParams } from "react-router";
import type { Comment } from "@/types";
import { CommentItem } from "@/components/CommentItem";
import { useAuth } from "@/contexts/AuthContext";

type CommentWithReplies = Comment & { replies?: CommentWithReplies[] };

const ReportPage = () => {
	const { reportId } = useParams();
	const { user } = useAuth();
	const {
		data: response,
		isLoading: reportLoading,
		isError: reportError,
	} = useReportById(reportId || "");
	const { data: responseComment, isLoading: commentsLoading } =
		useCommentsByReportId(reportId || "");
	const commentsRaw: CommentWithReplies[] = responseComment?.data ?? [];
	const { mutate: createComment, isPending: isCreating } = useCreateComment();
	const { mutate: deleteComment } = useDeleteComment();

	const [commentContent, setCommentContent] = useState("");
	const [replyingToId, setReplyingToId] = useState<string | null>(null);
	const report = response?.data;

	const mapById: Record<string, CommentWithReplies> = {};
	commentsRaw.forEach((c) => {
		mapById[c.id] = { ...c, replies: [] };
	});
	const rootComments: CommentWithReplies[] = [];
	commentsRaw.forEach((c) => {
		if (c.replyToId && mapById[c.replyToId]) {
			mapById[c.replyToId].replies!.push(mapById[c.id]);
		} else {
			rootComments.push(mapById[c.id]);
		}
	});
	rootComments.sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);
	rootComments.forEach((c) =>
		c.replies!.sort(
			(a, b) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
		)
	);

	if (reportLoading) return <p>Loading report...</p>;
	if (reportError || !report) return <p>Report not found.</p>;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!commentContent.trim() || !reportId) return;
		createComment({ content: commentContent, reportId });
		setCommentContent("");
	};
	const handleReply = (content: string, replyToId: string) => {
		if (!reportId) return;
		createComment({ content, reportId, replyToId });
	};

	return (
		<div className="mx-auto p-6 space-y-6 text-base text-slate-900">
			<h1 className="text-2xl font-semibold mb-4">Report Page</h1>
			<div className="grid md:grid-cols-2 gap-6">
				<section className="border rounded-lg p-4 shadow bg-slate-50">
					<h2 className="text-lg font-bold mb-2">{report.category.name}</h2>
					<p className="mb-1">Status: {report.status}</p>
					<p className="mb-1">
						Submitted:{" "}
						{new Date(report.submittedAt).toLocaleString(undefined, {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
					<p className="mb-2">
						Updated:{" "}
						{new Date(report.updatedAt).toLocaleString(undefined, {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
					<p className="mb-4 leading-relaxed">{report.description}</p>
					<p className="mb-1">
						<strong>Reported by:</strong>{" "}
						{report.user.id === user?.id
							? `you, ${user.name}`
							: report.user.name.split(" ")[0]}
					</p>
					<p className="mb-4">
						<strong>Handled by:</strong> {report.authorityOffice.officeName}
					</p>
					<div className="text-sm space-y-1">
						{report.address.region && (
							<p>
								<strong>Region:</strong> {report.address.region}
							</p>
						)}
						{report.address.zone && (
							<p>
								<strong>Zone:</strong> {report.address.zone}
							</p>
						)}
						{report.address.woreda && (
							<p>
								<strong>Woreda:</strong> {report.address.woreda}
							</p>
						)}
						{report.address.city && (
							<p>
								<strong>City:</strong> {report.address.city}
							</p>
						)}
						{report.address.subCity && (
							<p>
								<strong>Sub-City:</strong> {report.address.subCity}
							</p>
						)}
						{report.address.kebele && (
							<p>
								<strong>Kebele:</strong> {report.address.kebele}
							</p>
						)}
					</div>
				</section>

				<section className="border rounded-lg p-4 shadow bg-slate-50 flex flex-col">
					<h2 className="text-lg font-semibold mb-4">Comments</h2>
					{commentsLoading ? (
						<p>Loading comments...</p>
					) : (
						<div className="flex-1 max-h-80 overflow-y-auto space-y-3 pr-2">
							{rootComments.length === 0 ? (
								<p>No comments yet.</p>
							) : (
								rootComments.map((comment) => (
									<CommentItem
										key={comment.id}
										comment={comment}
										onDelete={deleteComment}
										onReply={handleReply}
										replyingToId={replyingToId}
										setReplyingToId={setReplyingToId}
									/>
								))
							)}
						</div>
					)}
					<form onSubmit={handleSubmit} className="mt-4">
						<textarea
							value={commentContent}
							onChange={(e) => setCommentContent(e.target.value)}
							className="w-full border rounded p-2 text-sm"
							rows={3}
							placeholder="Write a comment..."
							required
						/>
						<button
							type="submit"
							disabled={isCreating || !commentContent.trim()}
							className="btn mt-2 text-base"
						>
							{isCreating ? "Posting..." : "Post Comment"}
						</button>
					</form>
				</section>
			</div>
		</div>
	);
};

export default ReportPage;
