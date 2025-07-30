import React, { createContext, useContext, useEffect, useState } from "react";
import {
	useLogin,
	useRegister,
	useLogout,
	useRequestOtp,
	useVerifyOtp,
	useMe,
	useUserFull,
	setAccessToken,
	authApi,
} from "../lib/apiClient";
import type { User } from "../types";

type AuthContextType = {
	user: User | null;
	role?: string;
	isLoading: boolean;
	login: (payload: {
		phone: string;
		password: string;
		appContext: "user" | "admin" | "authority";
	}) => Promise<void>;
	register: (payload: any) => Promise<void>;
	logout: () => Promise<void>;
	requestOtp: ReturnType<typeof useRequestOtp>;
	verifyOtp: ReturnType<typeof useVerifyOtp>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
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

	// === Track login state ===
	useEffect(() => {
		if (meQuery.isSuccess && userQuery.data) {
			setUser(userQuery.data);
		}
		if (meQuery.isError) {
			setUser(null);
		}
	}, [meQuery.status, userQuery.data]);

	// === Token refresh logic ===
	useEffect(() => {
		let interval: ReturnType<typeof setInterval> | undefined;
		if (user) {
			interval = setInterval(async () => {
				try {
					const res = await authApi.refreshAccessToken();
					internalSetAccessToken(res.data.accessToken);
					setAccessToken(res.data.accessToken);
				} catch {
					setUser(null);
					internalSetAccessToken(null);
					setAccessToken(null);
				}
			}, 15 * 60 * 1000);
		}
		return () => clearInterval(interval);
	}, [user]);

	// === Auth API wrappers ===
	const login = async (payload: {
		phone: string;
		password: string;
		appContext: "user" | "admin" | "authority";
	}) => {
		const res = await loginM.mutateAsync(payload);
		internalSetAccessToken(res.accessToken);
		setAccessToken(res.accessToken);
		setUser(res.userData);
	};

	const register = async (payload: any) => {
		const res = await registerM.mutateAsync(payload);
		internalSetAccessToken(res.accessToken);
		setAccessToken(res.accessToken);
		setUser(res.userData);
	};

	const logout = async () => {
		await logoutM.mutateAsync();
		setUser(null);
		internalSetAccessToken(null);
		setAccessToken(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				role: meQuery.data?.role,
				isLoading: meQuery.isLoading,
				login,
				register,
				logout,
				requestOtp: requestOtpM,
				verifyOtp: verifyOtpM,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
