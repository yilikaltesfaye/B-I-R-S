import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

export const generateAccessToken = (payload: object) => {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
		expiresIn: "15m",
	});
};
export const generateRefreshToken = (payload: object) => {
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
		expiresIn: "30d",
	});
};
export const verifyRefreshToken = (token: string) => {
	return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as {
		userId: string;
		userRole: string;
		appContext: string;
	};
};
export const verifyAccessToken = (token: string) => {
	return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
		userId: string;
		userRole: string;
		appContext: string;
	};
};

export const generateGuestToken = () => {
	const guestToken = nanoid(6); // 6 char OTP
	const expirySeconds = 15 * 60;
	return { guestToken, expirySeconds };
};
