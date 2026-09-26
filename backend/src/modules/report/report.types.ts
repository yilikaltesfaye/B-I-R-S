export interface Address {
	region: string;
	zone?: string | undefined;
	woreda?: string | undefined;
	city?: string | undefined;
	subCity?: string | undefined;
	kebele?: string | undefined;
	[key: string]: any;
}

export interface ReportInterface {
	address: Address;
	description: string;
	categoryId: number;
}
