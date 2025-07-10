import prisma from "../../prisma/client";
import { comparePasswords, hashPassword } from "../../utils/hash";
import {
	generateAccessToken,
	generateRefreshToken,
	generateResetToken,
	verifyRefreshToken,
} from "../../utils/token";
import { sendOtp, verifyOtp } from "./otp.service";

export const signup = async (
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
export const login = async (phone: string, password: string) => {
	if (!phone || !password)
		throw new Error("All Input fields should be submitted");

	const user = await prisma.user.findUnique({
		where: { phone },
	});
	if (!user) throw new Error("Invalid Phone");
	// if (!user) throw new Error("ስልክ ቁጥሩ ሌላ ተጠቃሚ ይዞታል");
	const valid = await comparePasswords(password, user.password);
	if (!valid) throw new Error("Invalid Password");

	const refreshToken = generateRefreshToken(user.id, user.role);
	const accessToken = generateAccessToken(user.id, user.role, refreshToken);

	return { accessToken, refreshToken };
};
export const refreshAccessToken = (token: string) => {
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
export const refreshCookieToken = async (userId: string) => {
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

export const forgotPassword = async (phone: string) => {
	const user = await prisma.user.findUnique({ where: { phone } });
	if (!user) return;
	const { token, expiry } = generateResetToken();

	await prisma.user.update({
		where: { phone },
		data: {
			resetToken: token,
			resetTokenExp: expiry.toISOString(),
		},
	});

	return token;
};

export const resetPassword = async (token: string, newPassword: string) => {
	const user = await prisma.user.findFirst({
		where: {
			resetToken: token,
			resetTokenExp: {
				gte: new Date().toISOString(),
			},
		},
	});
	if (!user) throw new Error("invalid or expired reset token");

	const hashed = await hashPassword(newPassword);
	await prisma.user.update({
		where: {
			id: user.id,
		},
		data: {
			password: hashed,
			resetToken: null,
			resetTokenExp: null,
		},
	});
};

export const requestPasswordResetOtp = async (phone: string) => {
	const user = await prisma.user.findUnique({ where: { phone } });
	if (!user) throw new Error("User not found");

	const { verificationId, expiresIn, code } = await sendOtp(phone);

	return { verificationId, expiresIn, code };
};

export const resetPasswordWithOtp = async (
	phone: string,
	code: string,
	verificationId: string,
	newPassword: string
) => {
	const result = await verifyOtp(phone, code, verificationId);
	console.log(result);
	const hashed = await hashPassword(newPassword);
	await prisma.user.update({
		where: { phone },
		data: {
			password: hashed,
		},
	});
};
