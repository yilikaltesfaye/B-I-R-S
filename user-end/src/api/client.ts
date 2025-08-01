import { QueryClient } from "@tanstack/react-query";
import axios, { type AxiosInstance } from "axios";

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

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			refetchOnWindowFocus: false,
		},
	},
});
