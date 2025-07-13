import prisma from "../../clients/prismaClient";
import { redis } from "../../clients/redisClient";
import {
	LoginInterface,
	PayloadInterface,
	regenerateRefreshTokenInterface,
	RegisterInterface,
	ResetPasswordInterface,
	VerifyOtpInterface,
} from "./auth.types";
import { comparePasswords, hashPassword } from "../../utils/hash";
import {
	generateAccessToken,
	generateGuestToken,
	generateRefreshToken,
	verifyRefreshToken,
} from "../../utils/token";
import { getUserById } from "../user/user.service";
import { sendOtp, verifyOtp } from "../../utils/otp";
import { HttpError } from "../../middlewares/HttpError";
import { checkRedis } from "../../utils/checkRedisStore";

// request otp for new accounts

export const registerOtpService = async (phone: string) => {
	const exisiting = await prisma.user.findUnique({ where: { phone } });
	if (exisiting) {
		throw new HttpError("Phone number is already in use", 409);
	}

	const { verificationId, expiresIn, code } = await sendOtp(phone);

	return { verificationId, expiresIn, code };
};

// request otp for new accounts

export const forgetPasswordOtpService = async (phone: string) => {
	const user = await prisma.user.findUnique({ where: { phone } });
	if (!user)
		throw new HttpError("Your User does not exist in the database", 404);

	const { verificationId, expiresIn, code } = await sendOtp(phone);

	return { verificationId, expiresIn, code };
};

// verify otp and sends back token for reset

export const verifyOtpService = async (data: VerifyOtpInterface) => {
	await verifyOtp(data.phone, data.code, data.verificationId);

	const { guestToken, expirySeconds } = generateGuestToken();

	const phone = data.phone;
	// edge case
	const exists = await redis.get(`verified:${phone}`);
	if (exists) {
		await redis.del(`verified:${phone}`);
	}

	await redis.set(`verified:${phone}`, guestToken, "EX", expirySeconds);

	return { guestToken, expirySeconds };
};

// registration service and sends back access and refresh tokens

export const registerService = async (data: RegisterInterface) => {
	const exisiting = await prisma.user.findUnique({
		where: { phone: data.phone },
	});
	await checkRedis(data.phone, data.guestToken);

	if (exisiting) {
		throw new HttpError("Phone number is already in use", 409);
	}
	// if (exisiting) throw new Error("ስልክ ቁጥሩ ሌላ ተጠቃሚ ይዞታል");

	const hashed = await hashPassword(data.password);
	const user = await prisma.user.create({
		data: {
			name: data.name,
			email: data.email,
			phone: data.phone,
			password: hashed,
			address: data.address,
		},
	});

	if (data.appContext === "admin" && user.role !== "ADMIN") {
		return {
			accessDenied: true,
			reason:
				"Access denied: Registration was complete but as a user you can't access the admin platform. Use the Citizen platform.",
		};
	}
	if (data.appContext === "authority" && user.role !== "AUTHORITY") {
		return {
			accessDenied: true,
			reason:
				"Access denied: Registration was complete but as a user you can't access the authority platform. Use the Citizen platform.",
		};
	}

	const payload: PayloadInterface = {
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
export const loginService = async (data: LoginInterface) => {
	const user = await prisma.user.findUnique({
		where: { phone: data.phone },
	});
	if (!user) throw new HttpError("Invalid Phone or Password", 401);
	// if (!user) throw new HttpError("ስልክ ቁጥሩ ሌላ ተጠቃሚ ይዞታል");

	const valid = await comparePasswords(data.password, user.password);
	if (!valid) throw new HttpError("Invalid Phone or Password", 401);

	if (data.appContext === "admin" && user.role !== "ADMIN") {
		return {
			accessDenied: true,
			reason: "Access denied: Not an admin.",
		};
	}
	if (data.appContext === "authority" && user.role !== "AUTHORITY") {
		return {
			accessDenied: true,
			reason: "Access denied: Not an authority",
		};
	}

	const payload: PayloadInterface = {
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

export const resetPasswordService = async (data: ResetPasswordInterface) => {
	await checkRedis(data.phone, data.guestToken);

	const hashed = await hashPassword(data.newPassword);
	await prisma.user.update({
		where: {
			phone: data.phone,
		},
		data: {
			password: hashed,
		},
	});
};

// Regenerate Access Token Service

export const regenerateAccessTokenService = async (refreshToken: string) => {
	if (!refreshToken) {
		throw new HttpError("Refresh token is required", 400);
	}
	let payload;
	try {
		payload = verifyRefreshToken(refreshToken);
	} catch (error) {
		throw new HttpError("invalid or expired token", 401);
	}
	const user = await getUserById(payload.userId);
	if (!user || user.refreshToken !== refreshToken) {
		throw new HttpError("Refresh token invalid or revoked", 401);
	}

	const newAccessToken = generateAccessToken({
		userId: payload.userId,
		userRole: payload.userRole,
	});

	return { accessToken: newAccessToken };
};
