import type { Address } from "./users.payload";

export interface CreateReportPayload {
	address: Address;
	description: string;
	categoryId: number;
}
