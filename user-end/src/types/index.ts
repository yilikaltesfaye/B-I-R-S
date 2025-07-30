export * from "./payload/auth.payload";
export * from "./payload/users.payload";

import type { Address } from "./payload/users.payload";

export interface User {
	id: string;
	phone: string;
	email?: string;
	name: string;
	role: string;
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
