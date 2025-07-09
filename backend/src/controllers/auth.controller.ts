import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";

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
		res.cookie("refreshToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		});
		res.json({ message: "Logged out successfull" });
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
};
