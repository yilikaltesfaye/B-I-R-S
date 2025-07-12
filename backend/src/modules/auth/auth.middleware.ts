import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../utils/token";

export interface AuthedRequest extends Request {
	userId?: string;
	userRole?: string;
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
		req.userRole = payload.userRole;
		next();
	} catch (error) {
		res
			.status(400)
			.json({ status: "fail", message: "Invalid or expired Token" });
	}
};
export const requireAdmin = (
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
		req.userRole = payload.userRole;

		if (req.userRole !== "ADMIN") {
			res
				.status(403)
				.json({ status: "fail", message: "Access denied: Admins only" });
			return;
		}

		next();
	} catch (error) {
		res
			.status(400)
			.json({ status: "fail", message: "Invalid or expired Token" });
	}
};

export const requireAuthority = (
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
		req.userRole = payload.userRole;

		if (req.userRole !== "AUTHORITY") {
			res
				.status(403)
				.json({ status: "fail", message: "Access denied: Authority only" });
			return;
		}

		next();
	} catch (error) {
		res
			.status(400)
			.json({ status: "fail", message: "Invalid or expired Token" });
	}
};
