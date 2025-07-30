import axios, { type AxiosInstance } from "axios";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import type {
	User,
	RequestOtpPayload,
	VerifyOtpPayload,
	RegisterPayload,
	LoginPayload,
} from "../types";

export const queryClient = new QueryClient();

export const apiClient: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true,
	headers: { "Content-Type": "application/json" },
});

export const setAccessToken = (token: string | null) => {
	if (token)
		apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
	else delete apiClient.defaults.headers.common.Authorization;
};

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
};

export const userApi = {
	me: () => apiClient.get<{ id: string; role: string }>("/users/me"),
	getUserById: (id: string) => apiClient.get<{ data: User }>(`/users/${id}`),
};

// Properly unwrap data in mutation functions for React Query compatibility

export const useRequestOtp = () =>
	useMutation({
		mutationFn: (payload: RequestOtpPayload) =>
			authApi.requestOtp(payload).then((res) => res.data),
	});

export const useVerifyOtp = () =>
	useMutation({
		mutationFn: (payload: VerifyOtpPayload) =>
			authApi.verifyOtp(payload).then((res) => res.data),
	});

export const useRegister = () =>
	useMutation({
		mutationFn: (payload: RegisterPayload) =>
			authApi.register(payload).then((res) => res.data),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["userFull"] });
		},
	});

export const useLogin = () =>
	useMutation({
		mutationFn: (payload: LoginPayload) =>
			authApi.login(payload).then((res) => res.data),
		onSuccess: (data) => {
			setAccessToken(data.accessToken);
			queryClient.invalidateQueries({ queryKey: ["userFull"] });
		},
	});

export const useLogout = () =>
	useMutation({
		mutationFn: () => authApi.logout().then((res) => res.data),
		onSuccess: () => {
			setAccessToken(null);
			queryClient.removeQueries({ queryKey: ["userFull"] });
		},
	});

export const useMe = (enabled: boolean = true) =>
	useQuery<{ id: string; role: string }>({
		queryKey: ["userIdRole"],
		queryFn: () => userApi.me().then((res) => res.data),
		retry: false,
		staleTime: 5 * 60 * 1000,
		enabled,
	});

export const useUserFull = (enabled: boolean = true) =>
	useQuery<User>({
		queryKey: ["userFull"],
		queryFn: async () => {
			const me = await userApi.me();
			const userRes = await userApi.getUserById(me.data.id);
			return userRes.data.data;
		},
		staleTime: 5 * 60 * 1000,
		enabled,
	});
