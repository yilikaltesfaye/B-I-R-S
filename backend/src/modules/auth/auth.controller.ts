import { Request, Response } from "express";
import * as AuthService from "./auth.service";
import prisma from "../../prisma/client";

export const signup = async (req: Request, res: Response) => {
	try {
		const { name, email, phone, password, region } = req.body;
		const { accessToken, refreshToken } = await AuthService.signup(
			name,
			email,
			phone,
			password,
			region
		);

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 1000,
		});
		res.json({ accessToken });
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { phone, password } = req.body;
		const { accessToken, refreshToken } = await AuthService.login(
			phone,
			password
		);

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 1000,
		});
		res.json({ accessToken });
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
};

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

export const refreshToken = async (req: Request, res: Response) => {
	try {
		const token = req.body?.refreshToken || req.cookies.refreshToken;

		if (!token) {
			return res.status(401).json({ error: "Refresh token missing" });
		}

		const isMobileClient = req.headers["user-agent"]?.includes("ReactNative");

		const { accessToken, refreshToken } = AuthService.refreshToken(token);

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

export const forgotPassword = async (req: Request, res: Response) => {
	try {
		const { phone } = req.body;
		const token = await AuthService.forgotPassword(phone);

		res.json({
			message: "If a user exists, a reset link has been sent",
			token,
		});
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
};

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

// export const requestPasswordOtp = async (req: Request, res: Response) => {
// 	try {
// 		const { phone } = req.body;
// 		const { verificationId, expiresIn } =
// 			await AuthService.requestPasswordResetOtp(phone);
// 		res.json({ message: "OTP sent", verificationId, expiresIn });
// 	} catch (error: any) {
// 		res.status(400).json({ error: error.message });
// 	}
// };

// export const resetPasswordWithOtp = async (req: Request, res: Response) => {
// 	try {
// 		const { phone, code, verificationId, newPassword } = req.body;
// 		await AuthService.resetPasswordWithOtp(
// 			phone,
// 			code,
// 			verificationId,
// 			newPassword
// 		);

// 		res.json({ message: "Password reset successful" });
// 	} catch (error: any) {
// 		res.status(400).json({ error: error.message });
// 	}
// };

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
