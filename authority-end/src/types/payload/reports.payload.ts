import type { Address } from "./users.payload";

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
