import { authAPI, usersAPI } from "@/lib/api";
import type { AuthContextType, User } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (undefined === context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const initAuth = async () => {
			try {
				const token = localStorage.getItem("accessToken");
				if (!token) return;

				const meResponse = await authAPI.me();
				const { id: userId } = meResponse.data;

				const userResponse = await usersAPI.getUser(userId);
				setUser(userResponse.data.data); // adjust if your API response shape differs
			} catch (error) {
				localStorage.removeItem("accessToken");
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};

		initAuth();
	}, []);

	useEffect(() => {
		if (!user) return;

		const interval = setInterval(async () => {
			try {
				const response = await authAPI.refreshAccessToken();
				const accessToken = response.data.accessToken;
				localStorage.setItem("accessToken", accessToken);
			} catch (error) {
				console.error("Failed to refresh access token", error);
				setUser(null);
				localStorage.removeItem("accessToken");
			}
		}, 15 * 60 * 1000);

		return () => clearInterval(interval);
	}, [user]);

	const login = async (phone: string, password: string) => {
		try {
			const response = await authAPI.login(phone, password);
			const { accessToken, userData } = response.data;

			localStorage.setItem("accessToken", accessToken);
			setUser(userData);
		} catch (error: any) {
			const message =
				error?.response?.data?.message || "Something went wrong during login.";
			const errors = error?.response?.data?.errors || null;
			const statusCode: number =
				error?.response?.data?.errorCode || error?.response?.status || 500;

			const statusText =
				{
					400: "Bad Request",
					401: "Unauthorized",
					403: "Forbidden",
					404: "Not Found",
					500: "Internal Server Error",
				}[statusCode] || "Error";

			const title = `${
				error?.response?.data?.title || "Fail"
			} – ${statusCode} ${statusText}`;

			throw { message, errors, title };
		}
	};

	const logout = async () => {
		try {
			await authAPI.logout(); // sends cookie, triggers server to clear it
		} catch (error) {
			console.error("Logout failed:", error);
		} finally {
			localStorage.removeItem("accessToken");
			setUser(null);
		}
	};

	const value: AuthContextType = {
		user,
		login,
		logout,
		isLoading,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
