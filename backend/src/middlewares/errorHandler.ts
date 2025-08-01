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
	// console.error("Error:", err);

	if (err instanceof ZodError) {
		return res.status(400).json({
			title: "Fail",
			message: "Zod Validation error",
			errors: err.errors,
		});
	}
	const statusCode = err instanceof HttpError ? err.status : 500;

	res.status(statusCode).json({
		title: "Fail",
		message: err.message || "Internal Server Error",
		errorCode: statusCode,
		...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
	});
	console.log(err.message, statusCode);
}
