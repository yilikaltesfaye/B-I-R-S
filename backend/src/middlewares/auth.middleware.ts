import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token";
import { Role } from "@prisma/client";

export interface AuthedRequest extends Request {
	userId?: string;
	userRole?: Role;
}

export const requireAuth = (
	req: AuthedRequest,
	res: Response,
	next: NextFunction
): void => {
	const authHeader = req.headers["authorization"];
	const token = authHeader?.split(" ")[1];
	if (!token) {
		res.status(401).json({ status: "fail", message: "Access token required" });
		return;
	}

	try {
		const payload = verifyAccessToken(token);
		req.userId = payload.userId;
		const roleFromToken = payload.userRole as Role;
		req.userRole = roleFromToken;

		next();
	} catch (error) {
		res
			.status(401)
			.json({ status: "fail", message: "Invalid or expired Token" });
	}
};
export const requireAdmin = (
	req: AuthedRequest,
	res: Response,
	next: NextFunction
): void => {
	if (req.userRole !== Role.ADMIN) {
		res
			.status(403)
			.json({ status: "fail", message: "Access denied: Admins only" });
		return;
	}

	next();
};

export const requireAuthority = (
	req: AuthedRequest,
	res: Response,
	next: NextFunction
): void => {
	if (req.userRole !== Role.AUTHORITY) {
		res
			.status(403)
			.json({ status: "fail", message: "Access denied: Authority only" });
		return;
	}

	next();
};
