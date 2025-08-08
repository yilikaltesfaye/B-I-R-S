import { apiClient } from "../client";
import type { LoginPayload, RegisterPayload, RequestOtpPayload, VerifyOtpPayload, User } from "@/types";

export const authApi = {
	login: (payload: LoginPayload) =>
		apiClient.post<{
			title: string;
			message: string;
			accessToken: string;
			userData: User;
		}>("/auth/login", payload).then(res => res.data),

	register: (payload: RegisterPayload) =>
		apiClient.post<{
			title: string;
			message: string;
			accessToken: string;
			userData: User;
		}>("/auth/register", payload).then(res => res.data),

	logout: () =>
		apiClient.post<{ title: string; message: string }>("/auth/logout").then(res => res.data),

	me: () =>
		apiClient.get<{ title: string; message: string; data: User }>("/auth/me").then(res => res.data),

	refreshAccessToken: () =>
		apiClient.get<{ title: string; message: string; accessToken: string }>("/auth/refresh").then(res => res.data),

	requestOtp: (payload: RequestOtpPayload) =>
		apiClient.post<{ title: string; message: string }>("/auth/request-otp", payload).then(res => res.data),

	verifyOtp: (payload: VerifyOtpPayload) =>
		apiClient.post<{ title: string; message: string }>("/auth/verify-otp", payload).then(res => res.data),
};
