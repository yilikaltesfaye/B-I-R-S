import { useState } from "react";
import type { Comment } from "../types";
import { FiUser, FiClock, FiMessageCircle } from "react-icons/fi";

type CommentWithReplies = Comment & { replies?: CommentWithReplies[] };

interface AuthorityCommentItemProps {
	comment: CommentWithReplies;
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

export const AuthorityCommentItem = ({
	comment,
}: AuthorityCommentItemProps) => {
	const [showReplies, setShowReplies] = useState(false);

	return (
		<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
			{/* Comment Header */}
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center space-x-2">
					<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
						<FiUser className="h-4 w-4 text-blue-600" />
					</div>
					<div>
						<span className="font-medium text-gray-900">
							{comment.user.name}
						</span>
						<div className="flex items-center text-xs text-gray-500 mt-1">
							<FiClock className="h-3 w-3 mr-1" />
							{formatDate(comment.createdAt)}
						</div>
					</div>
				</div>
			</div>

			{/* Comment Content */}
			<div className="mb-3">
				<p className="text-gray-700 leading-relaxed">{comment.content}</p>
			</div>

			{/* Replies Toggle */}
			{comment.replies && comment.replies.length > 0 && (
				<div className="border-t border-gray-200 pt-3">
					<button
						onClick={() => setShowReplies(!showReplies)}
						className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
					>
						<FiMessageCircle className="h-4 w-4" />
						<span>
							{showReplies
								? `Hide ${comment.replies.length} ${
										comment.replies.length === 1 ? "reply" : "replies"
								  }`
								: `View ${comment.replies.length} ${
										comment.replies.length === 1 ? "reply" : "replies"
								  }`}
						</span>
					</button>

					{/* Replies */}
					{showReplies && (
						<div className="mt-3 space-y-3 ml-4 border-l-2 border-gray-200 pl-4">
							{comment.replies.map((reply) => (
								<AuthorityCommentItem key={reply.id} comment={reply} />
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};
