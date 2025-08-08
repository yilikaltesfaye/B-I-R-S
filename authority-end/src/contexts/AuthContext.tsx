import React, { createContext, useContext, useEffect, useState } from "react";

import type { LoginPayload, Role, User } from "../types";
import {
	useRequestOtp,
	useVerifyOtp,
	useMe,
	useUserFull,
	useLogin,
	useRegister,
	useLogout,
	setAccessToken,
} from "../api";
import { authApi } from "../api/auth/api";

type AuthContextType = {
	authority: User | null;
	role?: Role;
	isLoading: boolean;
	login: (payload: LoginPayload) => Promise<void>;
	register: (payload: any) => Promise<void>;
	logout: () => Promise<void>;
	requestOtp: ReturnType<typeof useRequestOtp>;
	verifyOtp: ReturnType<typeof useVerifyOtp>;
	authorityOffice?: User["authorityStaff"];
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [authority, setAuthority] = useState<User | null>(null);
	const [accessToken, internalSetAccessToken] = useState<string | null>(null);

	// === Controlled queries ===
	const meQuery = useMe(!!accessToken);
	const userQuery = useUserFull(!!accessToken);

	// === Auth actions ===
	const loginM = useLogin();
	const registerM = useRegister();
	const logoutM = useLogout();
	const requestOtpM = useRequestOtp();
	const verifyOtpM = useVerifyOtp();
	const [isInitializing, setIsInitializing] = useState(true);

	useEffect(() => {
		const initializeAuth = async () => {
			try {
				const res = await authApi.refreshAccessToken();
				internalSetAccessToken(res.accessToken);
				setAccessToken(res.accessToken);
				await meQuery.refetch();
				await userQuery.refetch();
			} catch (error: any) {
				if (error.response?.status === 401) {
					// User is not logged in, no refresh token — silently handle
					setAuthority(null);
					internalSetAccessToken(null);
					setAccessToken(null);
				} else {
					console.error("Unexpected error during token refresh", error);
				}
			} finally {
				setIsInitializing(false);
			}
		};
		initializeAuth();
	}, []);

	// === Track login state ===
	useEffect(() => {
		if (meQuery.isSuccess && userQuery.data) {
			setAuthority(userQuery.data);
		}
		if (meQuery.isError) {
			setAuthority(null);
		}
	}, [meQuery.status, userQuery.data]);

	// === Token refresh logic ===
	useEffect(() => {
		let interval: ReturnType<typeof setInterval> | undefined;
		if (authority) {
			interval = setInterval(async () => {
				try {
					const res = await authApi.refreshAccessToken();
					internalSetAccessToken(res.accessToken);
					setAccessToken(res.accessToken);
				} catch {
					setAuthority(null);
					internalSetAccessToken(null);
					setAccessToken(null);
				}
			}, 15 * 60 * 1000);
		}
		return () => clearInterval(interval);
	}, [authority]);

	// === Auth API wrappers ===
	const login = async (payload: LoginPayload) => {
		const res = await loginM.mutateAsync(payload);
		internalSetAccessToken(res.accessToken);
		setAccessToken(res.accessToken);
		setAuthority(res.userData);
	};

	const register = async (payload: any) => {
		const res = await registerM.mutateAsync(payload);
		internalSetAccessToken(res.accessToken);
		setAccessToken(res.accessToken);
		setAuthority(res.userData);
	};

	const logout = async () => {
		await logoutM.mutateAsync();
		setAuthority(null);
		internalSetAccessToken(null);
		setAccessToken(null);
	};

	return (
		<AuthContext.Provider
			value={{
				authority,
				role: meQuery.data?.role,
				isLoading: meQuery.isLoading || isInitializing,
				login,
				register,
				logout,
				requestOtp: requestOtpM,
				verifyOtp: verifyOtpM,
				authorityOffice: authority?.authorityStaff,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
