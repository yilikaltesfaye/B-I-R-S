import type { Address } from "./users.payload";

export interface CreateReportPayload {
	address: Address;
	description: string;
	categoryId: number;
}

export type GetFilteredReportsPayload = {
	region?: string;
	zone?: string;
	woreda?: string;
	city?: string;
	subCity?: string;
	kebele?: string;
	skip?: number;
	take?: number;
};
