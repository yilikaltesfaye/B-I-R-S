import prisma from "../../clients/prismaClient";
import { redis } from "../../clients/redisClient";
import { payloadSchema } from "../../types/auth.interface";
import { comparePasswords, hashPassword } from "../../utils/hash";
import {
	generateAccessToken,
	generateGuestToken,
	generateRefreshToken,
	verifyRefreshToken,
} from "../../utils/token";
import { getUserById } from "../user/user.service";
import { sendOtp, verifyOtp } from "./otp.service";

interface LoginInput {
	phone: string;
	password: string;
	appContext: string;
}
interface Address {
	region: string;
	zone?: string;
	woreda?: string;
	city?: string;
	subCity?: string;
	kebele?: string;
	[key: string]: any;
}

interface RegisterInput {
	name: string;
	phone: string;
	password: string;
	address: Address;
	appContext: "user" | "authority" | "admin";
	email?: string;
}

// request otp for new accounts

export const registerOtpService = async (phone: string) => {
	const exisiting = await prisma.user.findUnique({ where: { phone } });
	if (exisiting) throw new Error("Phone number is already in use");

	const { verificationId, expiresIn, code } = await sendOtp(phone);

	return { verificationId, expiresIn, code };
};

// request otp for new accounts

export const forgetPasswordOtpService = async (phone: string) => {
	const user = await prisma.user.findUnique({ where: { phone } });
	if (!user) throw new Error("Your User does not exist in the database");

	const { verificationId, expiresIn, code } = await sendOtp(phone);

	return { verificationId, expiresIn, code };
};

// verify otp and sends back token for reset

export const verifyOtpService = async (
	phone: string,
	code: string,
	verificationId: string
) => {
	await verifyOtp(phone, code, verificationId);

	const { guestToken, expirySeconds } = generateGuestToken();

	// edge case
	const exists = await redis.get(`verified:${phone}`);
	if (exists) {
		await redis.del(`verified:${phone}`);
	}

	await redis.set(`verified:${phone}`, guestToken, "EX", expirySeconds);

	return { guestToken, expirySeconds };
};

// registration service and sends back access and refresh tokens

export const registerService = async ({
	name,
	phone,
	password,
	address,
	appContext,
	email,
}: RegisterInput) => {
	const exisiting = await prisma.user.findUnique({
		where: { phone },
	});

	if (exisiting) throw new Error("Phone Number is already in use");
	// if (exisiting) throw new Error("ስልክ ቁጥሩ ሌላ ተጠቃሚ ይዞታል");

	const hashed = await hashPassword(password);
	const user = await prisma.user.create({
		data: {
			name,
			email,
			phone,
			password: hashed,
			address,
		},
	});

	if (appContext === "admin" && user.role !== "ADMIN") {
		return {
			accessDenied: true,
			reason:
				"Access denied: Registration was complete but as a user you can't access the admin platform. Use the Citizen platform.",
		};
	}
	if (appContext === "authority" && user.role !== "AUTHORITY") {
		return {
			accessDenied: true,
			reason:
				"Access denied: Registration was complete but as a user you can't access the authority platform. Use the Citizen platform.",
		};
	}

	const payload: payloadSchema = {
		userId: user.id,
		userRole: user.role,
	};
	const refreshToken = generateRefreshToken(payload);
	const accessToken = generateAccessToken(payload);

	const refreshTokenExpiry = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

	await prisma.user.update({
		where: { id: user.id },
		data: { refreshToken, refreshTokenExp: refreshTokenExpiry },
	});

	return { accessToken, refreshToken, user };
};

// Login service and sends back access and refresh tokens
export const loginService = async ({
	phone,
	password,
	appContext,
}: LoginInput) => {
	const user = await prisma.user.findUnique({
		where: { phone },
	});
	if (!user) throw new Error("Invalid Phone or Password");
	// if (!user) throw new Error("ስልክ ቁጥሩ ሌላ ተጠቃሚ ይዞታል");

	const valid = await comparePasswords(password, user.password);
	if (!valid) throw new Error("Invalid Phone or password");

	if (appContext === "admin" && user.role !== "ADMIN") {
		return {
			accessDenied: true,
			reason: "Access denied: Not an admin.",
		};
	}
	if (appContext === "authority" && user.role !== "AUTHORITY") {
		return {
			accessDenied: true,
			reason: "Access denied: Not an authority",
		};
	}

	const payload: payloadSchema = {
		userId: user.id,
		userRole: user.role,
	};

	const refreshToken = generateRefreshToken(payload);
	const accessToken = generateAccessToken(payload);
	const refreshTokenExpiry = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

	await prisma.user.update({
		where: { id: user.id },
		data: { refreshToken, refreshTokenExp: refreshTokenExpiry },
	});
	return { accessToken, refreshToken, user };
};

// Reset Password Service

export const resetPasswordService = async (
	phone: string,
	newPassword: string
) => {
	const hashed = await hashPassword(newPassword);
	await prisma.user.update({
		where: {
			phone,
		},
		data: {
			password: hashed,
		},
	});
};

// Regenerate Access Token Service

export const regenerateAccessTokenService = async (refreshToken: string) => {
	try {
		const payload = verifyRefreshToken(refreshToken);

		const user = await getUserById(payload.userId);
		if (!user || user.refreshToken !== refreshToken) {
			throw new Error("Refresh token invalid or revoked");
		}

		const newAccessToken = generateAccessToken({
			userId: payload.userId,
			userRole: payload.userRole,
		});

		return { accessToken: newAccessToken };
	} catch (error) {
		throw new Error("invalid or expired token");
	}
};

// Regenerate Refresh Token Service

export const regenerateRefreshTokenService = async (
	userId: string,
	refreshToken: string,
	refreshTokenExpiry: Date
) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
				refreshToken: refreshToken,
				refreshTokenExp: refreshTokenExpiry,
			},
		});
		if (!user) throw new Error("Invalid Phone");

		const payload: payloadSchema = {
			userId: user.id,
			userRole: user.role,
		};
		const newRefreshToken = generateRefreshToken(payload);
		const newRefreshTokenExpiry = new Date(
			Date.now() + 15 * 24 * 60 * 60 * 1000
		);

		await prisma.user.update({
			where: { id: user.id },
			data: {
				refreshToken: newRefreshToken,
				refreshTokenExp: newRefreshTokenExpiry,
			},
		});

		return {
			newRefreshToken,
			newRefreshTokenExpiry,
		};
	} catch (error) {
		throw new Error("invalid or expired token");
	}
};
