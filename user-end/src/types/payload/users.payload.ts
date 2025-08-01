import type { Role } from "@/types";

export interface Address {
	region: string;
	zone: string | null;
	woreda: string | null;
	city: string | null;
	subCity: string | null;
	kebele: string | null;
	[key: string]: any;
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
