export interface Address {
	region: string;
	zone?: string;
	woreda?: string;
	city?: string;
	subCity?: string;
	kebele?: string;
	[key: string]: any;
}

import type { Role } from "../index";

export type UserUpdatePayload = Partial<{
	name: string;
	email: string;
	phone: string;
	address: Address;
	password: string;
	role: Role;
	isActive: boolean;
}>;
