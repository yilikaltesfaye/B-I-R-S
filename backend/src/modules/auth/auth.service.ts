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
import { sendOtp, verifyOtp } from "./otp.service";

interface LoginInput {
	phone: string;
	password: string;
	appContext: "user" | "authority" | "admin";
}

interface RegisterInput {
	name: string;
	phone: string;
	password: string;
	region: string;
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
	region,
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
			region,
		},
	});

	const payload: payloadSchema = {
		userId: user.id,
		userRole: user.role,
		appContext,
	};
	const refreshToken = generateRefreshToken(payload);
	const accessToken = generateAccessToken(payload);

	return { accessToken, refreshToken };
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
	if (!valid) throw new Error("Invalid Password or Password");

	const payload: payloadSchema = {
		userId: user.id,
		userRole: user.role,
		appContext,
	};

	const refreshToken = generateRefreshToken(payload);
	const accessToken = generateAccessToken(payload);

	return { accessToken, refreshToken };
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

export const regenerateAccessTokenService = (token: string) => {
	try {
		const payload = verifyRefreshToken(token);

		const newAccessToken = generateAccessToken(payload);

		return { accessToken: newAccessToken };
	} catch (error) {
		throw new Error("invalid or expired token");
	}
};

// Regenerate Refresh Token Service

export const regenerateRefreshTokenService = async (
	userId: string,
	appContext: "user" | "authority" | "admin"
) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		if (!user) throw new Error("Invalid Phone");

		const payload: payloadSchema = {
			userId: user.id,
			userRole: user.role,
			appContext,
		};
		const newRefreshToken = generateRefreshToken(payload);

		return { refreshToken: newRefreshToken, payload };
	} catch (error) {
		throw new Error("invalid or expired token");
	}
};
