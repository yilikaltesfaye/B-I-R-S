import { NextFunction, Request, Response } from "express";
import { AuthedRequest } from "../../middlewares/auth.middleware";
import { HttpError } from "../../middlewares/HttpError";
import prisma from "../../clients/prismaClient";

export const createCommentController = async (
	req: AuthedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.userId;
		const { content, reportId, replyToId } = req.body;

		if (!userId) throw new HttpError("Unauthorized", 401);
		if (!content || !reportId)
			throw new HttpError("Content and reportId are required", 400);

		// Validate report exists
		const report = await prisma.report.findUnique({ where: { id: reportId } });
		if (!report) throw new HttpError("Report not found", 404);

		// If replyToId is provided, validate the parent comment
		if (replyToId) {
			const parentComment = await prisma.comment.findUnique({
				where: { id: replyToId },
			});
			if (!parentComment || parentComment.reportId !== reportId) {
				throw new HttpError("Invalid replyToId", 400);
			}
		}

		const newComment = await prisma.comment.create({
			data: {
				content,
				userId,
				reportId,
				replyToId: replyToId || null,
			},
			include: {
				user: {
					select: {
						name: true,
						id: true,
					},
				},
			},
		});

		res.status(201).json({
			title: "success",
			message: "Comment created",
			data: newComment,
		});
	} catch (error) {
		next(error);
	}
};

export const getCommentsByReportController = async (
	req: AuthedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const reportId = req.params.reportId;

		if (!reportId) throw new HttpError("Report ID is required", 400);

		// Verify report exists (optional but recommended)
		const report = await prisma.report.findUnique({ where: { id: reportId } });
		if (!report) throw new HttpError("Report not found", 404);

		// Fetch comments with user and nested replies
		const comments = await prisma.comment.findMany({
			where: { reportId },
			orderBy: { createdAt: "asc" },
			include: {
				user: { select: { id: true, name: true } },
				replies: {
					orderBy: { createdAt: "asc" },
					include: { user: { select: { id: true, name: true } } },
				},
			},
		});

		res.json({
			title: "success",
			data: comments,
		});
	} catch (error) {
		next(error);
	}
};

export const deleteCommentController = async (
	req: AuthedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.userId;
		const commentId = req.params.id;

		if (!userId) {
			throw new HttpError("Unauthorized: no user ID", 401);
		}

		// Find the comment and check ownership
		const comment = await prisma.comment.findUnique({
			where: { id: commentId },
			select: { userId: true },
		});

		if (!comment) {
			throw new HttpError("Comment not found", 404);
		}

		if (comment.userId !== userId || req.userRole !== "ADMIN") {
			// to check later
			throw new HttpError(
				"Access denied: You can only delete your own comments",
				403
			);
		}

		await prisma.comment.delete({ where: { id: commentId } });

		res.json({ title: "success", message: "Comment deleted" });
	} catch (error) {
		next(error);
	}
};
