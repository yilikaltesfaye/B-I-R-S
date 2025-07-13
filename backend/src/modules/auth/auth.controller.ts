import { Request, Response } from "express";
import * as AuthService from "./auth.service";
import { standardPhone } from "../../utils/standardPhoneNumber";
import z from "zod";
import {
	LoginSchema,
	PasswordResetSchema,
	RegisterSchema,
	RequestOtpSchema,
	VerifyOtpSchema,
} from "./auth.schema";
import { redis } from "../../clients/redisClient";
import { checkRedis } from "../../utils/checkRedisStore";

// request one time password controller for verfication registration || forgot password

export const requestOtpController = async (req: Request, res: Response) => {
	try {
		const validated = RequestOtpSchema.parse(req.body);
		const phone = standardPhone(validated.phoneNumber);
		const type = validated.type;

		if (type === "FORGETPASSWORD") {
			const { verificationId, expiresIn, code } =
				await AuthService.forgetPasswordOtpService(phone);
			res.json({
				status: "success",
				message: "OTP sent for forget password operation",
				verificationId,
				expiresIn,
				code,
				type,
			});
		} else if (type === "NEWACCOUNT") {
			const { verificationId, expiresIn, code } =
				await AuthService.registerOtpService(phone);
			res.json({
				status: "success",
				message: "OTP sent for new account registeration",
				verificationId,
				expiresIn,
				code,
				type,
			});
		} else {
			throw new Error(
				"The Type of request is niether for forgotten password or for new Account"
			);
		}
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return res
				.status(400)
				.json({ status: "fail", message: "ZOD", errors: error.errors });
		}
		res.status(400).json({
			status: "fail",
			message: "an error has occured",
			error: error.message,
		});
	}
};

// verify otp controller and sends back guestToken for registration and password recovery

export const verifyOtpController = async (req: Request, res: Response) => {
	try {
		const validated = VerifyOtpSchema.parse(req.body);

		const phone = standardPhone(validated.phoneNumber);

		const { guestToken, expirySeconds } = await AuthService.verifyOtpService({
			phone,
			code: validated.code,
			verificationId: validated.verificationId,
		});
		const expiryMin = expirySeconds / 60;
		res.json({
			status: "success",
			message:
				"OTP verified and token provided for registeration or reset password operation",
			guestToken,
			expiryMin,
		});
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return res
				.status(400)
				.json({ status: "fail", message: "ZOD", errors: error.errors });
		}
		res.status(400).json({
			status: "fail",
			message: "an error has occured",
			error: error.message,
		});
	}
};

// registration controller and sends back session and refresh tokens

export const registerController = async (req: Request, res: Response) => {
	try {
		const validated = RegisterSchema.parse(req.body);
		const phone = standardPhone(validated.phoneNumber);

		await checkRedis(phone, validated.guestToken);

		const result = await AuthService.registerService({
			name: validated.fullName,
			phone,
			password: validated.password,
			address: validated.address,
			appContext: validated.appContext,
			email: validated.email,
		});

		if ("accessDenied" in result && result.accessDenied) {
			return res.status(403).json({
				status: "fail",
				message: result.reason,
			});
		}

		const { accessToken, refreshToken } = result;

		const isMobileClient = req.headers["user-agent"]?.includes("ReactNative");
		if (isMobileClient) {
			res.json({
				status: "success",
				message:
					"Regisitration was successfull. Access Token  and Refresh token are sent in this json. The User can log in now",
				accessToken,
				refreshToken,
			});
		} else {
			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 15 * 24 * 60 * 60 * 1000,
			});

			res.json({
				status: "success",
				message:
					"Regisitration was successfull. Access Token is sent in this json and Refresh token is sent to cookie. The User can log in now",
				accessToken,
			});
		}
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return res
				.status(400)
				.json({ status: "fail", message: "ZOD", errors: error.errors });
		}
		res.status(400).json({
			status: "fail",
			message: "an error has occured",
			error: error.message,
		});
	}
};

// login controller and sends back access and refresh token

export const loginController = async (req: Request, res: Response) => {
	try {
		const validated = LoginSchema.parse(req.body);
		const phone = standardPhone(validated.phoneNumber);

		const result = await AuthService.loginService({
			phone,
			password: validated.password,
			appContext: validated.appContext,
		});
		if ("accessDenied" in result && result.accessDenied) {
			return res.status(403).json({
				status: "fail",
				message: result.reason,
			});
		}
		const { accessToken, refreshToken, user } = result;

		const isMobileClient = req.headers["user-agent"]?.includes("ReactNative");

		if (isMobileClient) {
			res.json({
				status: "success",
				message:
					"Login operation was successfull. Access Token and Refresh token are sent in this json. The User can log in now.",
				accessToken,
				refreshToken,
			});
		} else {
			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 15 * 24 * 60 * 60 * 1000,
			});

			res.json({
				status: "success",
				message:
					"Login operation was successfull. Access Token is sent in this json and Refresh token is sent to cookie. The User can log in now.",
				accessToken,
			});
		}
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return res
				.status(400)
				.json({ status: "fail", message: "ZOD", errors: error.errors });
		}
		res.status(400).json({
			status: "fail",
			message: "an error has occured",
			error: error.message,
		});
	}
};

// logout controller

export const logoutController = async (_req: Request, res: Response) => {
	try {
		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		});
		res.json({
			status: "success",
			message: "Logout operation was successfull",
		});
	} catch (error: any) {
		res.status(400).json({
			status: "fail",
			message: "an error has occured",
			error: error.message,
		});
	}
};

// Reset Password Controller after request one time password controller

export const resetPasswordController = async (req: Request, res: Response) => {
	try {
		const validated = PasswordResetSchema.parse(req.body);
		const phone = standardPhone(validated.phoneNumber);

		await checkRedis(phone, validated.guestToken);

		await AuthService.resetPasswordService({
			phone,
			newPassword: validated.newPassword,
		});
		res.json({
			status: "success",
			message: "New Password has been reset successfully",
		});
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return res
				.status(400)
				.json({ status: "fail", message: "ZOD", errors: error.errors });
		}
		res.status(400).json({
			status: "fail",
			message: "an error has occured",
			error: error.message,
		});
	}
};

// Regenerate Access Token Controller and sends back access token

export const regenerateAccessTokenController = async (
	req: Request,
	res: Response
) => {
	try {
		const refreshToken = req.body?.refreshToken || req.cookies.refreshToken;

		if (!refreshToken) {
			throw new Error("Refresh token missing");
		}

		const { accessToken } =
			await AuthService.regenerateAccessTokenService(refreshToken);

		const isMobileClient = req.headers["user-agent"]?.includes("ReactNative");

		if (isMobileClient) {
			res.json({
				status: "success",
				message:
					"Access Token Regeneration was successfull. Access Token is sent in json and the old Refresh token is sent to cookie. The User now have access",
				accessToken,
				refreshToken,
			});
		}

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 15 * 24 * 60 * 60 * 1000,
		});

		res.json({
			status: "success",
			message:
				"Access Token Regeneration. Access Token is sent in json and the old Refresh token is sent to cookie. The User now have access",
			accessToken,
		});
	} catch (error: any) {
		res.status(400).json({
			status: "fail",
			message: "an error has occured",
			error: error.message || "Invalid Token",
		});
	}
};

// Regenerate Refresh Roken controller and sends back access and refresh token
// remeber to save refresh token on db

export const regenerateRefreshTokenController = async (
	req: Request,
	res: Response
) => {
	try {
		const { userId, refreshTokenExpiry } = req.body;
		const refreshToken = req.body?.refreshToken || req.cookies.refreshToken;

		if (!userId || !refreshToken || !refreshTokenExpiry) {
			throw new Error("User Id is missing");
		}

		const { newRefreshToken } = await AuthService.regenerateRefreshTokenService(
			{ userId, refreshToken, refreshTokenExpiry }
		);
		const { accessToken } =
			await AuthService.regenerateAccessTokenService(newRefreshToken);

		const isMobileClient = req.headers["user-agent"]?.includes("ReactNative");

		if (isMobileClient) {
			res.json({
				status: "success",
				message:
					"Refresh Token Regeneration was successfull. The new Access Token and the new Refresh token are sent in this json. The User now have access",
				accessToken,
				refreshToken,
			});
		}

		res.cookie("refreshToken", newRefreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 15 * 24 * 60 * 60 * 1000,
		});

		res.json({
			status: "success",
			message:
				"Refresh Token Regeneration was successfull. The new Access Token is sent in this json and the new Refresh token is sent to cookie. The User now have access",
			accessToken,
		});
	} catch (error: any) {
		res.status(400).json({
			status: "fail",
			message: "an error has occured",
			error: error.message || "Invalid Token",
		});
	}
};
