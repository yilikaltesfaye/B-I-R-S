import type { Address } from "./users.payload";

export interface CreateAuthorityOfficePauload {
	officeName: string;
	email: string;
	phone: string;
	address: Address;
	iconUrl?: string;
	parentOfficeId: number;
}
