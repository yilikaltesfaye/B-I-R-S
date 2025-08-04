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
} from "@/api";
import { authApi } from "@/api/auth/api";

type AuthContextType = {
	user: User | null;
	role?: Role;
	isLoading: boolean;
	login: (payload: LoginPayload) => Promise<void>;
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
	const [isInitializing, setIsInitializing] = useState(true);

	const shouldFetch = !!accessToken && !isInitializing;

	// Controlled queries
	const meQuery = useMe(shouldFetch);
	const userQuery = useUserFull(shouldFetch);

	// Mutations
	const loginM = useLogin();
	const registerM = useRegister();
	const logoutM = useLogout();
	const requestOtpM = useRequestOtp();
	const verifyOtpM = useVerifyOtp();

	useEffect(() => {
		const initializeAuth = async () => {
			try {
				const res = await authApi.refreshAccessToken();
				internalSetAccessToken(res.data.accessToken);
			} catch (error: any) {
				if (error.response?.status === 401) {
					setUser(null);
					internalSetAccessToken(null);
				} else {
					console.error("Unexpected error during token refresh", error);
				}
			} finally {
				setIsInitializing(false);
			}
		};
		initializeAuth();
	}, []);

	// Set user once queries succeed
	useEffect(() => {
		if (
			meQuery.isSuccess &&
			userQuery.isSuccess &&
			userQuery.data &&
			user?.id !== userQuery.data.id
		) {
			setUser(userQuery.data);
		} else if (meQuery.isError && user !== null) {
			setUser(null);
		}
	}, [meQuery.status, userQuery.data]);

	// Token refresh interval
	useEffect(() => {
		let interval: ReturnType<typeof setInterval> | undefined;
		if (user) {
			interval = setInterval(async () => {
				try {
					const res = await authApi.refreshAccessToken();
					internalSetAccessToken(res.data.accessToken);
				} catch {
					setUser(null);
					internalSetAccessToken(null);
				}
			}, 15 * 60 * 1000); // every 15 minutes
		}
		return () => clearInterval(interval);
	}, [user]);

	const login = async (payload: LoginPayload) => {
		const res = await loginM.mutateAsync(payload);
		internalSetAccessToken(res.accessToken);
		setUser(res.userData);
	};

	const register = async (payload: any) => {
		const res = await registerM.mutateAsync(payload);
		internalSetAccessToken(res.accessToken);
		setUser(res.userData);
	};

	const logout = async () => {
		await logoutM.mutateAsync();
		setUser(null);
		internalSetAccessToken(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				role: meQuery.data?.role,
				isLoading: meQuery.isLoading || isInitializing,
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
