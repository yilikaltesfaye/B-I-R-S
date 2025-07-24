import { NextFunction, Request, Response } from "express";
import * as AuthService from "./auth.service";
import { standardPhone } from "../../utils/standardPhoneNumber";
import {
	LoginSchema,
	PasswordResetSchema,
	RegisterSchema,
	RequestOtpSchema,
	VerifyOtpSchema,
} from "./auth.schema";

// request one time password controller for verfication registration || forgot password

export const requestOtpController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const validated = RequestOtpSchema.parse(req.body);
		const phone = standardPhone(validated.phone);
		const type = validated.type;

		if (type === "FORGETPASSWORD") {
			const { verificationId, expiresIn } =
				await AuthService.forgetPasswordOtpService(phone);
			res.json({
				title: "success",
				message: "OTP sent for forget password operation",
				verificationId,
				expiresIn,
				type,
			});
		} else if (type === "NEWACCOUNT") {
			const { verificationId, expiresIn } =
				await AuthService.registerOtpService(phone);
			res.json({
				title: "success",
				message: "OTP sent for new account registeration",
				verificationId,
				expiresIn,
				type,
			});
		} else {
			throw new Error(
				"The Type of request is niether for forgotten password or for new Account"
			);
		}
	} catch (error: any) {
		next(error);
	}
};

// verify otp controller and sends back guestToken for registration and password recovery

export const verifyOtpController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const validated = VerifyOtpSchema.parse(req.body);

		const phone = standardPhone(validated.phone);

		const { guestToken, expirySeconds } = await AuthService.verifyOtpService({
			phone,
			code: validated.code,
			verificationId: validated.verificationId,
		});
		const expiryMin = expirySeconds / 60;
		res.json({
			title: "success",
			message:
				"OTP verified and token provided for registeration or reset password operation",
			guestToken,
			expiryMin,
		});
	} catch (error: any) {
		next(error);
	}
};

// registration controller and sends back session and refresh tokens

export const registerController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const validated = RegisterSchema.parse(req.body);
		const phone = standardPhone(validated.phone);

		const result = await AuthService.registerService({
			name: validated.fullName,
			phone,
			password: validated.password,
			address: validated.address,
			appContext: validated.appContext,
			email: validated.email,
			// guestToken: validated.guestToken,
		});

		const { accessToken, refreshToken, userData } = result;

		const isMobileClient = req.headers["user-agent"]?.includes("ReactNative");
		if (isMobileClient) {
			res.json({
				title: "success",
				message:
					"Regisitration was successfull. Access Token  and Refresh token are sent in this json. The User can log in now",
				accessToken,
				refreshToken,
				userData,
			});
		} else {
			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 15 * 24 * 60 * 60 * 1000,
			});

			res.json({
				title: "success",
				message:
					"Regisitration was successfull. Access Token is sent in this json and Refresh token is sent to cookie. The User can log in now",
				accessToken,
				userData,
			});
		}
	} catch (error: any) {
		next(error);
	}
};

// login controller and sends back access and refresh token

export const loginController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const validated = LoginSchema.parse(req.body);
		const phone = standardPhone(validated.phone);

		const result = await AuthService.loginService({
			phone,
			password: validated.password,
			appContext: validated.appContext,
		});

		const { accessToken, refreshToken, userData } = result;

		const isMobileClient = req.headers["user-agent"]?.includes("ReactNative");

		if (isMobileClient) {
			res.json({
				title: "success",
				message:
					"Login operation was successfull. Access Token and Refresh token are sent in this json. The User can log in now.",
				accessToken,
				refreshToken,
				userData,
			});
		} else {
			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 15 * 24 * 60 * 60 * 1000,
			});

			res.json({
				title: "success",
				message:
					"Login operation was successfull. Access Token is sent in this json and Refresh token is sent to cookie. The User can log in now.",
				accessToken,
				userData,
			});
		}
	} catch (error: any) {
		next(error);
	}
};

// logout controller

export const logoutController = async (
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		});
		res.json({
			title: "success",
			message: "Logout operation was successfull",
		});
	} catch (error: any) {
		res.status(400).json({
			title: "fail",
			message: "an error has occured",
			error: error.message,
		});
	}
};

// Reset Password Controller after request one time password controller

export const resetPasswordController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const validated = PasswordResetSchema.parse(req.body);
		const phone = standardPhone(validated.phoneNumber);

		await AuthService.resetPasswordService({
			phone,
			newPassword: validated.newPassword,
			guestToken: validated.guestToken,
		});
		res.json({
			title: "success",
			message: "New Password has been reset successfully",
		});
	} catch (error: any) {
		next(error);
	}
};

// Regenerate Access Token Controller and sends back access token

export const regenerateAccessTokenController = async (
	req: Request,
	res: Response,
	next: NextFunction
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
				title: "success",
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
			title: "success",
			message:
				"Access Token Regeneration. Access Token is sent in json and the old Refresh token is sent to cookie. The User now have access",
			accessToken,
		});
	} catch (error: any) {
		next(error);
	}
};
