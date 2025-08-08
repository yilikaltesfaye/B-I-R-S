import type {
	RequestOtpPayload,
	VerifyOtpPayload,
	RegisterPayload,
	User,
	LoginPayload,
	ResetPasswordPayload,
} from "../../types";
import { apiClient } from "../client";

export const authApi = {
	requestOtp: (payload: RequestOtpPayload) =>
		apiClient.post("/auth/requestotp", payload),
	verifyOtp: (payload: VerifyOtpPayload) =>
		apiClient.post<{ guestToken: string; expiryMin: number }>(
			"/auth/verifyotp",
			payload
		),
	register: (payload: RegisterPayload) =>
		apiClient.post<{ accessToken: string; userData: User }>(
			"/auth/register",
			payload
		),
	login: (payload: LoginPayload) =>
		apiClient.post<{ accessToken: string; userData: User }>(
			"/auth/login",
			payload
		),
	logout: () => apiClient.post("/auth/logout"),
	refreshAccessToken: () =>
		apiClient.post<{ accessToken: string }>("/auth/refresh-access-token"),
	resetPassword: (payload: ResetPasswordPayload) =>
		apiClient.post("/resetpassword", payload), // not done yet
};
