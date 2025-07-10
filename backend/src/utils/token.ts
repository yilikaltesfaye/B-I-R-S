import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateAccessToken = (
	userId: string,
	userRole: string,
	refreshToken: string
) => {
	return jwt.sign({ userId, userRole }, refreshToken, {
		expiresIn: "15m",
	});
};
export const generateRefreshToken = (userId: string, userRole: string) => {
	return jwt.sign({ userId, userRole }, process.env.REFRESH_TOKEN_SECRET!, {
		expiresIn: "7d",
	});
};
export const verifyRefreshToken = (token: string) => {
	return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as {
		userId: string;
		userRole: string;
	};
};
export const verifyAccessToken = (token: string, refreshToken: string) => {
	return jwt.verify(token, refreshToken) as {
		userId: string;
		userRole: string;
	};
};

export const generateResetToken = () => {
	const token = crypto.randomBytes(32).toString("hex");
	const expiry = new Date(Date.now() + 1000 * 60 * 15);
	return { token, expiry };
};
