import { useState } from "react";
import type { Comment } from "@/types";

type CommentWithReplies = Comment & { replies?: CommentWithReplies[] };

interface CommentItemProps {
	comment: CommentWithReplies;
	onDelete: (id: string) => void;
	onReply: (content: string, replyToId: string) => void;
	replyingToId: string | null;
	setReplyingToId: (id: string | null) => void;
}

function formatDate(dateInput: string | Date): string {
	const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	if (diffDays === 0) {
		if (diffHours === 0) return "Just now";
		return diffHours === 1 ? "1 hour ago" : `${diffHours}h ago`;
	}
	if (diffDays === 1) return "1 day ago";
	if (diffDays < 7) return `${diffDays} days ago`;
	return date.toLocaleDateString();
}

export const CommentItem = ({
	comment,
	onDelete,
	onReply,
	replyingToId,
	setReplyingToId,
}: CommentItemProps) => {
	const [replyContent, setReplyContent] = useState("");
	const [showReplies, setShowReplies] = useState(false);

	const handleReplySubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!replyContent.trim()) return;
		onReply(replyContent.trim(), comment.id);
		setReplyContent("");
		setReplyingToId(null);
		setShowReplies(true);
	};

	return (
		<div className="py-2 px-3 border-l-4 rounded bg-slate-90 border-slate-950 text-sm">
			<div className="flex justify-between items-center mb-1">
				<span className="font-semibold text-slate-900">
					{comment.user.name}
				</span>
				<button
					onClick={() => onDelete(comment.id)}
					className="text-red-500 btn "
				>
					Delete
				</button>
			</div>
			<p className="text-xs text-slate-900 mb-1">
				{formatDate(comment.createdAt)}
			</p>
			<p className="text-lg font-extrabold">{comment.content}</p>

			<div className="mt-1 flex items-center space-x-4 text-md">
				<button
					onClick={() =>
						setReplyingToId(replyingToId === comment.id ? null : comment.id)
					}
					className="text-slate-900 font-bold underline cursor-pointer"
				>
					Reply
				</button>
				{comment.replies && comment.replies.length > 0 && (
					<button
						onClick={() => setShowReplies(!showReplies)}
						className="text-slate-900 hover:underline cursor-pointer"
					>
						{showReplies
							? `Hide replies (${comment.replies.length})`
							: `View replies (${comment.replies.length})`}
					</button>
				)}
			</div>

			{replyingToId === comment.id && (
				<form onSubmit={handleReplySubmit} className="mt-2">
					<textarea
						value={replyContent}
						onChange={(e) => setReplyContent(e.target.value)}
						className="w-full border rounded p-1 text-sm"
						rows={2}
						placeholder="Write a reply..."
						required
					/>
					<button type="submit" className="btn">
						Post
					</button>
				</form>
			)}

			{showReplies && comment.replies && (
				<div className="ml-4 mt-2 space-y-2">
					{comment.replies.map((reply) => (
						<CommentItem
							key={reply.id}
							comment={reply}
							onDelete={onDelete}
							onReply={onReply}
							replyingToId={replyingToId}
							setReplyingToId={setReplyingToId}
						/>
					))}
				</div>
			)}
		</div>
	);
};
