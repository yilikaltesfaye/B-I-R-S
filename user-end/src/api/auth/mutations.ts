import { useMutation } from "@tanstack/react-query";
import type {
	RequestOtpPayload,
	VerifyOtpPayload,
	RegisterPayload,
	LoginPayload,
} from "../../types";
import { queryClient, setAccessToken } from "../client";
import { authApi } from "./api";

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
