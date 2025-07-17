export interface ReportInterface {
	address: Address;
	description: string;
	categoryId: number;
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
