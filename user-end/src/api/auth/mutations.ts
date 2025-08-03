import { useMutation } from "@tanstack/react-query";
import type {
	RequestOtpPayload,
	VerifyOtpPayload,
	RegisterPayload,
	LoginPayload,
	ResetPasswordPayload,
} from "../../types";
import { queryClient, setAccessToken } from "../client";
import { authApi } from "./api";
import { QUERY_KEYS } from "../constants";

export const useRequestOtp = () =>
	useMutation({
		mutationFn: (payload: RequestOtpPayload) =>
			authApi.requestOtp(payload).then((res) => res.data),
		onSuccess: (data) => {
			console.log(data.title, data.message);
		},
		onError: (error: any) => {
			console.error(error.response?.data?.title, error.response?.data?.message);
		},
	});

export const useVerifyOtp = () =>
	useMutation({
		mutationFn: (payload: VerifyOtpPayload) =>
			authApi.verifyOtp(payload).then((res) => res.data),
		onSuccess: (data) => {
			console.log(data.title, data.message);
		},
		onError: (error: any) => {
			console.error(error.response?.data?.title, error.response?.data?.message);
		},
	});

export const useRegister = () =>
	useMutation({
		mutationFn: (payload: RegisterPayload) =>
			authApi.register(payload).then((res) => res.data),
		onSuccess: (data) => {
			console.log(data.title, data.message);
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.FULL });
		},
		onError: (error: any) => {
			console.error(error.response?.data?.title, error.response?.data?.message);
		},
	});

export const useLogin = () =>
	useMutation({
		mutationFn: (payload: LoginPayload) =>
			authApi.login(payload).then((res) => res.data),
		onSuccess: (data) => {
			setAccessToken(data.accessToken);
			console.log(data.title, data.message);
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.FULL });
		},
		onError: (error: any) => {
			console.error(error.response?.data?.title, error.response?.data?.message);
		},
	});

export const useLogout = () =>
	useMutation({
		mutationFn: () => authApi.logout().then((res) => res.data),
		onSuccess: (data) => {
			setAccessToken(null);
			queryClient.removeQueries({ queryKey: QUERY_KEYS.USER.FULL });
			console.log(data.title, data.message);
		},
		onError: (error: any) => {
			console.error(error.response?.data?.title, error.response?.data?.message);
		},
	});

export const useResetPassword = () =>
	useMutation({
		mutationFn: (payload: ResetPasswordPayload) =>
			authApi.resetPassword(payload).then((res) => res.data),
		onSuccess: (data) => {
			console.log(data.title, data.message);
		},
		onError: (error: any) => {
			console.error(error.response?.data?.title, error.response?.data?.message);
		},
	});
