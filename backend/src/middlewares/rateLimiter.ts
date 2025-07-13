import rateLimit from "express-rate-limit";

export const requestRateLimiter = (type: string) =>
	rateLimit({
		windowMs: 5 * 60 * 1000,
		max: 3,
		message: `Too many ${type} requests. Please wait a few minutes.`,
	});
