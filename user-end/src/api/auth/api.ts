import type {
	RequestOtpPayload,
	VerifyOtpPayload,
	RegisterPayload,
	User,
	LoginPayload,
	ResetPasswordPayload,
} from "@/types";
import { apiClient } from "../client";
enum allowedTypes {
	"FORGETPASSWORD",
	"NEWACCOUNT",
}

export const authApi = {
	requestOtp: (payload: RequestOtpPayload) =>
		apiClient.post<{
			title: string;
			message: string;
			verificationId: string;
			expiresIn: string;
			type: allowedTypes;
		}>("/auth/requestotp", payload),
	verifyOtp: (payload: VerifyOtpPayload) =>
		apiClient.post<{
			title: string;
			message: string;
			guestToken: string;
			expiryMin: number;
		}>("/auth/verifyotp", payload),
	register: (payload: RegisterPayload) =>
		apiClient.post<{
			title: string;
			message: string;
			accessToken: string;
			userData: User;
		}>("/auth/register", payload),
	login: (payload: LoginPayload) =>
		apiClient.post<{
			title: string;
			message: string;
			accessToken: string;
			userData: User;
		}>("/auth/login", payload),
	logout: () =>
		apiClient.post<{ title: string; message: string }>("/auth/logout"),
	refreshAccessToken: () =>
		apiClient.post<{ accessToken: string; title: string; message: string }>(
			"/auth/refresh-access-token"
		),
	resetPassword: (payload: ResetPasswordPayload) =>
		apiClient.post("/resetpassword", payload),
};
