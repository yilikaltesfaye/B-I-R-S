import { NextFunction, Response, Request } from "express";
import prisma from "../../clients/prismaClient";
import { AuthedRequest } from "../../middlewares/auth.middleware";
import { HttpError } from "../../middlewares/HttpError";
import { hashPassword } from "../../utils/hash";

export const getAllUsersController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				role: true,
				email: true,
				phone: true,
				isActive: true,
				address: true,
				updatedAt: true,
				createdAt: true,
			},
		});
		res.json({
			title: "success",
			message: "protected route only for users",
			data: { users },
		});
	} catch (error: any) {
		next(error);
	}
};
export const getUserByIdController = async (
	req: AuthedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId, userRole } = req;
		const targetUserId = req.params.id;

		if (!userId) {
			throw new HttpError("No user ID was provided in session", 401);
		}

		const isSameUser = userId === targetUserId;

		if (userRole !== "ADMIN" && !isSameUser) {
			throw new HttpError("Access denied", 403);
		}

		const user = await prisma.user.findUnique({
			where: { id: targetUserId },
		});

		if (!user) {
			throw new HttpError("User not found", 404);
		}

		res.json({
			title: "success",
			message: "User data retrieved",
			data: { user },
		});
	} catch (error) {
		next(error);
	}
};

export const updateUserController = async (
	req: AuthedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId, userRole } = req;
		const targetUserId = req.params.id;
		const updateData = req.body;

		if (!userId) {
			throw new HttpError("No user ID was provided in session", 401);
		}

		const isSameUser = userId === targetUserId;

		if (userRole !== "ADMIN" && !isSameUser) {
			throw new HttpError("Access denied", 403);
		}

		// Block id updates just in case
		if ("id" in updateData) {
			delete updateData.id;
		}

		// If role is included in update, only admin can update role
		if ("role" in updateData && userRole !== "ADMIN") {
			delete updateData.role;
		}

		// Handle password update securely if provided
		if ("password" in updateData) {
			updateData.password = await hashPassword(updateData.password);
		}

		// Optional: validate updateData fields here or rely on Zod/Joi schema elsewhere

		const updatedUser = await prisma.user.update({
			where: { id: targetUserId },
			data: updateData,
			select: {
				id: true,
				name: true,
				email: true,
				phone: true,
				role: true,
				address: true,
				isActive: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!updatedUser) {
			throw new HttpError("User not found", 404);
		}

		res.json({
			title: "success",
			message: "User updated successfully",
			data: updatedUser,
		});
	} catch (error) {
		next(error);
	}
};

export const deleteUserController = async (
	req: AuthedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const targetUserId = req.params.id;

		// Check if user exists
		const user = await prisma.user.findUnique({
			where: { id: targetUserId },
		});

		if (!user) {
			throw new HttpError("User not found", 404);
		}

		// Optional: prevent admin from deleting themselves
		if (req.userId === targetUserId) {
			throw new HttpError("You cannot delete your own account", 400);
		}

		await prisma.user.delete({
			where: { id: targetUserId },
		});

		res.json({
			title: "success",
			message: "User deleted successfully",
		});
	} catch (error) {
		next(error);
	}
};
