import { useMutation } from "@tanstack/react-query";
import { authApi } from "./api";
import { queryClient, setAccessToken } from "../client";
import type { LoginPayload, RegisterPayload, RequestOtpPayload, VerifyOtpPayload } from "@/types";

export const useLogin = () => {
	return useMutation({
		mutationFn: (payload: LoginPayload) => authApi.login(payload),
		onSuccess: (data) => {
			setAccessToken(data.accessToken);
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});
};

export const useRegister = () => {
	return useMutation({
		mutationFn: (payload: RegisterPayload) => authApi.register(payload),
		onSuccess: (data) => {
			setAccessToken(data.accessToken);
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});
};

export const useLogout = () => {
	return useMutation({
		mutationFn: () => authApi.logout(),
		onSuccess: () => {
			setAccessToken(null);
			queryClient.clear();
		},
	});
};

export const useRequestOtp = () => {
	return useMutation({
		mutationFn: (payload: RequestOtpPayload) => authApi.requestOtp(payload),
	});
};

export const useVerifyOtp = () => {
	return useMutation({
		mutationFn: (payload: VerifyOtpPayload) => authApi.verifyOtp(payload),
	});
};

export const useMe = (enabled: boolean) => {
	return useMutation({
		mutationFn: () => authApi.me(),
	});
};
