import prisma from "../../prisma/client";
import { comparePasswords, hashPassword } from "../../utils/hash";
import {
	generateAccessToken,
	generateRefreshToken,
	generateResetToken,
	verifyRefreshToken,
} from "../../utils/token";
// import { sendOtp, verifyOtp } from "./otp.service";

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

	const accessToken = generateAccessToken(user.id);
	const refreshToken = generateRefreshToken(user.id);

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

	const accessToken = generateAccessToken(user.id);
	const refreshToken = generateRefreshToken(user.id);

	return { accessToken, refreshToken };
};
export const refreshToken = (token: string) => {
	if (!token) throw new Error("No token Provided");

	try {
		const payload = verifyRefreshToken(token);

		const newAccessToken = generateAccessToken(payload.userId);

		const newRefreshToken = generateRefreshToken(payload.userId);

		return { accessToken: newAccessToken, refreshToken: newRefreshToken };
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

// export const requestPasswordResetOtp = async (phone: string) => {
// 	const user = await prisma.user.findUnique({ where: { phone } });
// 	if (!user) throw new Error("User not found");

// 	const { verificationId, expiresIn } = await sendOtp(phone);

// 	return { verificationId, expiresIn };
// };

// export const resetPasswordWithOtp = async (
// 	phone: string,
// 	code: string,
// 	verificationId: string,
// 	newPassword: string
// ) => {
// 	await verifyOtp(phone, code, verificationId);

// 	const hashed = await hashPassword(newPassword);
// 	await prisma.user.update({
// 		where: { phone },
// 		data: {
// 			password: hashed,
// 		},
// 	});
// };
