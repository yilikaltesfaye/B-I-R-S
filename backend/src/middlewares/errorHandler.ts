/// errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { HttpError } from "./HttpError";

export function errorHandler(
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) {
	console.error("Error:", err);

	if (err instanceof ZodError) {
		return res.status(400).json({
			status: "fail",
			message: "Zod Validation error",
			errors: err.errors,
		});
	}

	res.status(err instanceof HttpError ? err.status : 500).json({
		status: "fail",
		message: err.message || "Internal Server Error",
	});
}
