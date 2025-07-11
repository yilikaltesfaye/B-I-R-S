import prisma from "../../clients/prismaClient";
import { redis } from "../../clients/redisClient";
import { comparePasswords, hashPassword } from "../../utils/hash";
import {
	generateAccessToken,
	generateGuestToken,
	generateRefreshToken,
	verifyRefreshToken,
} from "../../utils/token";
import { sendOtp, verifyOtp } from "./otp.service";

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

export const registerService = async (
	name: string,
	phone: string,
	password: string,
	region: string,
	email?: string
) => {
	if (!name || !phone || !password || !region)
		throw new Error("All Input fields should be submitted");

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

	const refreshToken = generateRefreshToken(user.id, user.role);
	const accessToken = generateAccessToken(user.id, user.role, refreshToken);

	return { accessToken, refreshToken };
};

// Login service and sends back access and refresh tokens
export const loginService = async (phone: string, password: string) => {
	if (!phone || !password) {
		throw new Error("All Input fields should be submitted");
	}
	const user = await prisma.user.findUnique({
		where: { phone },
	});
	if (!user) throw new Error("Invalid Phone or Password");
	// if (!user) throw new Error("ስልክ ቁጥሩ ሌላ ተጠቃሚ ይዞታል");

	const valid = await comparePasswords(password, user.password);
	if (!valid) throw new Error("Invalid Password or Password");

	const refreshToken = generateRefreshToken(user.id, user.role);
	const accessToken = generateAccessToken(user.id, user.role, refreshToken);

	return { accessToken, refreshToken };
};

// Reset Password Service

export const resetPasswordService = async (
	phone: string,
	newPassword: string
) => {
	if (!phone || !newPassword) {
		throw new Error("phone number or new Passowrd is not submitted");
	}

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
	if (!token) throw new Error("No token Provided");

	try {
		const payload = verifyRefreshToken(token);
		console.log(payload.userRole);
		const newAccessToken = generateAccessToken(
			payload.userId,
			payload.userRole,
			token
		);

		return { accessToken: newAccessToken };
	} catch (error) {
		throw new Error("invalid or expired token");
	}
};

// Regenerate Refresh Token Service

export const regenerateRefreshTokenService = async (userId: string) => {
	if (!userId) throw new Error("No user Id and user role Provided");

	try {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		if (!user) throw new Error("Invalid Phone");

		const newRefreshToken = generateRefreshToken(user.id, user.role);

		return { refreshToken: newRefreshToken };
	} catch (error) {
		throw new Error("invalid or expired token");
	}
};
