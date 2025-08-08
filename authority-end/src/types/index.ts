// Base enums
export enum Role {
	USER = "USER",
	ADMIN = "ADMIN",
	AUTHORITY = "AUTHORITY",
}

export enum Status {
	PENDING = "PENDING",
	IN_PROGRESS = "IN_PROGRESS",
	FIXED = "FIXED",
	REJECTED = "REJECTED",
}

// Address interface
export interface Address {
	region: string;
	zone?: string;
	woreda?: string;
	city?: string;
	subCity?: string;
	kebele?: string;
	[key: string]: any;
}

// Main interfaces
export interface User {
	id: string;
	phone: string;
	email?: string;
	name: string;
	role: Role;
	address: Address;
	isActive: boolean;
	updatedAt: string;
	createdAt: string;
	authorityStaff?: {
		position: string;
		authorityOffice: {
			id: string;
			officeName: string;
		};
	};
}

export interface Report {
	id: string;
	description: string;
	status: Status;
	submittedAt: Date;
	address: Address;
	updatedAt: Date;
	category: {
		name: string;
	};
	authorityOffice: {
		officeName: string;
		address: Address;
		iconUrl: string;
	};
	user: {
		name: string;
		id: string;
	};
}

export interface Comment {
	id: string;
	updatedAt: Date;
	userId: string;
	content: string;
	createdAt: Date;
	reportId: string;
	replyToId?: string;
	user: {
		id: string;
		name: string;
	};
	replies?: ({
		user: {
			id: string;
			name: string;
		};
	} & {
		id: string;
		updatedAt: Date;
		userId: string;
		content: string;
		createdAt: Date;
		reportId: string;
		replyToId?: string;
	})[];
}

export interface Category {
	id: number;
	name: string;
	description: string;
	IconUrl?: string;
	authorityOffices?: {
		id: number;
		officeName: string;
	}[];
}

export interface AuthorityOffice {
	id: number;
	phone: string;
	officeName: string;
	email: string;
	address: Address;
	iconUrl?: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	parentOfficeId?: number;
	categories?: {
		id: number;
		name: string;
		description: string;
		IconUrl?: string;
	}[];
}

// Payload types
export interface CreateReportPayload {
	address: Address;
	description: string;
	categoryId: number;
}

export const STATUS_TABS = ["PENDING", "APPROVED", "REJECTED"] as const;
export type StatusTab = (typeof STATUS_TABS)[number];

export interface GetFilteredReportsPayload {
	region: string;
	status: StatusTab;
	zone?: string;
	woreda?: string;
	city?: string;
	subCity?: string;
	kebele?: string;
	skip?: number;
	take?: number;
}

export type UserUpdatePayload = Partial<{
	name: string;
	email: string;
	phone: string;
	address: Address;
	password: string;
	role: Role;
	isActive: boolean;
}>;

// Auth payload types
export interface LoginPayload {
	phone: string;
	password: string;
	appContext: "authority";
}

export interface RegisterPayload {
	name: string;
	phone: string;
	email?: string;
	password: string;
	address: Address;
}

export interface RequestOtpPayload {
	phone: string;
}

export interface VerifyOtpPayload {
	phone: string;
	otp: string;
}

// Comment payload types
export interface CreateCommentPayload {
	reportId: string;
	content: string;
	replyToId?: string;
}

export interface ResetPasswordPayload {
	guestToken: string;
	phoneNumber: string;
	newPassword: string;
}
