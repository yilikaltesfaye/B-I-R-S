export * from "./payload/auth.payload";
export * from "./payload/users.payload";
export * from "./payload/reports.payload";
export * from "./payload/comments.payload";

import type { Address } from "./payload/users.payload";

export enum Role {
	"USER",
	"ADMIN",
	"AUTHORITY",
}
export enum Status {
	"PENDING",
	"IN_PROGRESS",
	"FIXED",
	"REJECTED",
}

export interface User {
	id: string;
	phone: string;
	email: string | null;
	name: string;
	role: Role;
	address: Address;
	isActive: boolean;
	updatedAt: string;
	createdAt: string;
	authorityStaff: {
		position: string;
		authorityOffice: {
			id: string;
			officeName: string;
		};
	} | null;
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
	replyToId: string | null;
	user: {
		id: string;
		name: string;
	};
	replies:
		| ({
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
				replyToId: string | null;
		  })[]
		| null;
}

export interface Category {
	id: number;
	name: string;
	description: string;
	IconUrl: string | null;
	authorityOffices:
		| {
				id: number;
				officeName: string;
		  }[]
		| null;
}

export interface AuthorityOffice {
	id: number;
	phone: string;
	officeName: string;
	email: string;
	address: Address;
	iconUrl: string | null;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	parentOfficeId: number | null;
	categories:
		| {
				id: number;
				name: string;
				description: string;
				IconUrl: string | null;
		  }[]
		| null;
}
