import { Request, Response } from "express";
import z from "zod";
import { standardPhone } from "../../utils/standardPhoneNumber";
import prisma from "../../clients/prismaClient";
import { AuthedRequest } from "../../middlewares/auth.middleware";

export const checkIfUserExistShema = z.object({
	phoneNumber: z.string().min(9),
});
// Check If User Exists Controller

export const checkIfUserExistController = async (
	req: Request,
	res: Response
) => {
	try {
		const validated = checkIfUserExistShema.parse(req.body);
		const phone = standardPhone(validated.phoneNumber);
		const Message = await checkIfUserExistService(phone);

		res.json({
			status: "success",
			message: Message,
		});
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return res
				.status(400)
				.json({ status: "fail", message: "ZOD", errors: error.errors });
		}
		res.status(400).json({
			status: "fail",
			message: "an error has occured",
			error: error.message,
		});
	}
};

// Check If User Exist Service

export const checkIfUserExistService = async (phone: string) => {
	const user = await prisma.user.findUnique({ where: { phone } });
	if (!user) throw new Error("no account exists with that phone number");
	else {
		const Message: string =
			"an account with the given phone number has been found";
		return Message;
	}
};

/// trying get all user to be deleted later
export const getAllUsers = async (req: any, res: any) => {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				role: true,
				email: true,
				address: true,
				updatedAt: true,
				createdAt: true,
			},
		});
		res.json({
			status: "success",
			message: "protected route only for users",
			data: { users },
		});
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
};
export const getUserData = async (req: AuthedRequest, res: Response) => {
	try {
		const userId = req.userId;
		if (!userId) {
			throw new Error("no user id was provided");
		}
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		if (!user) {
			throw new Error("no user was found with your Id");
		}
		res.json({
			status: "success",
			message: "protected route only for users",
			data: { user },
		});
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
};
