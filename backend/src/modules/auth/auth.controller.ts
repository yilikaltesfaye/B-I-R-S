import { Request, Response } from "express";
import * as AuthService from "./auth.service";
import prisma from "../../prisma/client";
import {
	PasswordSchema,
	LoginSchema,
	SignupSchema,
} from "../../types/auth.interface";
import { standardPhone } from "../../utils/standardPhoneNumber";
import z from "zod";

// signup controller

export const signup = async (req: Request, res: Response) => {
	try {
		// const { name, email, phone, password, region } = req.body;
		const validated = SignupSchema.parse(req.body);
		const phone = standardPhone(validated.phoneNumber);
		const { accessToken, refreshToken } = await AuthService.signup(
			validated.fullName,
			phone,
			validated.password,
			validated.region,
			validated.email
		);

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 1000,
		});
		res.json({ accessToken });
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ errors: error.errors });
		}
		res.status(400).json({ error: error.message });
	}
};

// login controller

export const login = async (req: Request, res: Response) => {
	try {
		// const { phone, password } = req.body;
		const validated = LoginSchema.parse(req.body);
		const phone = standardPhone(validated.phoneNumber);
		const { accessToken, refreshToken } = await AuthService.login(
			phone,
			validated.password
		);

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 1000,
		});
		res.json({ accessToken });
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ errors: error.errors });
		}
		res.status(400).json({ error: error.message });
	}
};

// logout controller

export const logout = async (_req: Request, res: Response) => {
	try {
		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		});
		res.json({ message: "Logged out successfull" });
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
};

// refrest access token controller

export const refreshAccessToken = async (req: Request, res: Response) => {
	try {
		const refreshToken = req.body?.refreshToken || req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ error: "Refresh token missing" });
		}

		const isMobileClient = req.headers["user-agent"]?.includes("ReactNative");

		const { accessToken } = AuthService.refreshAccessToken(refreshToken);

		if (isMobileClient) {
			res.json({ accessToken, refreshToken });
		} else {
			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 7 * 24 * 60 * 1000,
			});

			res.json({ accessToken });
		}
	} catch (error: any) {
		console.error("Refresh token error:", error);
		return res.status(400).json({ error: error.message || "Invalid token" });
	}
};

// refresh cookie refresh token controller

export const refreshCookieToken = async (req: Request, res: Response) => {
	try {
		const { userId, userRole } = req.body.userId;

		if (!userId || !userRole) {
			return res.status(401).json({ error: "User Id or userRole is missing" });
		}

		const isMobileClient = req.headers["user-agent"]?.includes("ReactNative");

		const { refreshToken } = await AuthService.refreshCookieToken(userId);
		const { accessToken } = AuthService.refreshAccessToken(refreshToken);

		if (isMobileClient) {
			res.json({ accessToken, refreshToken });
		} else {
			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 7 * 24 * 60 * 1000,
			});

			res.json({ accessToken });
		}
	} catch (error: any) {
		console.error("Refresh token error:", error);
		return res.status(400).json({ error: error.message || "Invalid token" });
	}
};

// token based forget password  controller

export const forgotPassword = async (req: Request, res: Response) => {
	try {
		// const { phone } = req.body;
		const validated = PasswordSchema.parse(req.body);
		const phone = standardPhone(validated.phoneNumber);
		const token = await AuthService.forgotPassword(phone);

		res.json({
			message: "If a user exists, a reset link has been sent",
			token,
		});
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ errors: error.errors });
		}
		res.status(400).json({ error: error.message });
	}
};

// token based reset password controller

export const resetPassword = async (req: Request, res: Response) => {
	try {
		const { token, newPassword } = req.body;
		await AuthService.resetPassword(token, newPassword);

		res.json({
			message: "passowrd reset successfull",
		});
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
};

export const requestPasswordOtp = async (req: Request, res: Response) => {
	try {
		const validated = PasswordSchema.parse(req.body);

		const phone = standardPhone(validated.phoneNumber);

		const { verificationId, expiresIn, code } =
			await AuthService.requestPasswordResetOtp(phone);

		res.json({ message: "OTP sent", verificationId, expiresIn, code });
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ errors: error.errors });
		}
		res.status(400).json({ error: error.message });
	}
};

export const resetPasswordWithOtp = async (req: Request, res: Response) => {
	try {
		const { phone, code, verificationId, newPassword } = req.body;
		await AuthService.resetPasswordWithOtp(
			phone,
			code,
			verificationId,
			newPassword
		);

		res.json({ message: "Password reset successful" });
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
};

export const getAllUsers = async (req: any, res: any) => {
	try {
		const users = await prisma.user.findMany();
		res.json({
			status: "success",
			message: "protected route only for users",
			data: { users },
		});
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
};
