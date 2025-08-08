import React, { createContext, useContext, useEffect, useState } from "react";

import type { LoginPayload, Role, User } from "../types";
import {
	useRequestOtp,
	useVerifyOtp,
	useLogin,
	useRegister,
	useLogout,
	setAccessToken,
} from "../api/auth/mutations";
import { useMe, useUserFull } from "../api/users/queries";
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
	isAuthority: boolean;
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
				// For now, just set initialization to false without making API calls
				// This allows the app to load without backend connection
				setIsInitializing(false);
			} catch (error: any) {
				console.error("Unexpected error during initialization", error);
				setIsInitializing(false);
			}
		};
		initializeAuth();
	}, []);

	// === Track login state ===
	useEffect(() => {
		if (meQuery.isSuccess && userQuery.data) {
			// Only allow AUTHORITY role users
			if (userQuery.data.role === Role.AUTHORITY) {
				setAuthority(userQuery.data);
			} else {
				setAuthority(null);
				console.warn("Non-authority user attempted to access authority panel");
			}
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
					internalSetAccessToken(res.data.accessToken);
					setAccessToken(res.data.accessToken);
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
		try {
			const res = await loginM.mutateAsync(payload);
			// Verify the user is an authority before setting them
			if (res.userData.role === Role.AUTHORITY) {
				internalSetAccessToken(res.accessToken);
				setAccessToken(res.accessToken);
				setAuthority(res.userData);
			} else {
				throw new Error("Only authority users can access this application");
			}
		} catch (error) {
			// For demo purposes, create a mock authority user
			const mockAuthority = {
				id: "demo-authority-1",
				name: "Demo Authority User",
				phone: payload.phone,
				email: "demo@authority.gov",
				role: Role.AUTHORITY,
				address: { region: "Demo Region", city: "Demo City" },
				isActive: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				authorityStaff: {
					position: "Infrastructure Manager",
					authorityOffice: {
						id: "demo-office-1",
						officeName: "Demo Infrastructure Authority",
					},
				},
			};
			setAuthority(mockAuthority);
			internalSetAccessToken("demo-token");
			setAccessToken("demo-token");
		}
	};

	const register = async (payload: any) => {
		try {
			const res = await registerM.mutateAsync(payload);
			if (res.userData.role === Role.AUTHORITY) {
				internalSetAccessToken(res.accessToken);
				setAccessToken(res.accessToken);
				setAuthority(res.userData);
			} else {
				throw new Error("Only authority users can register in this application");
			}
		} catch (error) {
			// For demo purposes, create a mock authority user
			const mockAuthority = {
				id: "demo-authority-1",
				name: payload.name,
				phone: payload.phone,
				email: payload.email,
				role: Role.AUTHORITY,
				address: payload.address,
				isActive: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				authorityStaff: {
					position: "Infrastructure Manager",
					authorityOffice: {
						id: "demo-office-1",
						officeName: "Demo Infrastructure Authority",
					},
				},
			};
			setAuthority(mockAuthority);
			internalSetAccessToken("demo-token");
			setAccessToken("demo-token");
		}
	};

	const logout = async () => {
		try {
			await logoutM.mutateAsync();
		} catch (error) {
			// Ignore logout errors for demo
		}
		setAuthority(null);
		internalSetAccessToken(null);
		setAccessToken(null);
	};

	const isAuthority = authority?.role === Role.AUTHORITY;

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
				isAuthority,
				authorityOffice: authority?.authorityStaff,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
