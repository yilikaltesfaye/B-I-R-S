import { Role } from "@prisma/client";

export interface PayloadInterface {
	userRole: Role;
	userId: string;
}
export interface LoginInterface {
	phone: string;
	password: string;
	appContext: string;
}
export interface Address {
	region: string;
	zone?: string;
	woreda?: string;
	city?: string;
	subCity?: string;
	kebele?: string;
	[key: string]: any;
}

export interface RegisterInterface {
	name: string;
	phone: string;
	password: string;
	address: Address;
	appContext: "user" | "authority" | "admin";
	guestToken: string;
	email?: string;
}

export interface regenerateRefreshTokenInterface {
	userId: string;
	refreshToken: string;
	refreshTokenExpiry: Date;
}

export interface ResetPasswordInterface {
	phone: string;
	newPassword: string;
	guestToken: string;
}

export interface VerifyOtpInterface {
	phone: string;
	code: string;
	verificationId: string;
}
