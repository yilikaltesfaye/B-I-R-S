export const QUERY_KEYS = {
	USER: {
		CURRENT: ["user", "current"] as const,
		FULL: ["user", "full"] as const,
		ALL: ["user", "all"] as const,
		BY_ID: (id: string) => ["user", "id", id] as const,
	},
	AUTHORITY: {
		ALL: ["authority", "all"] as const,
		BY_ID: (id: number) => ["authority", "id", id] as const,
		STAFF: (officeId: number) => ["authority", "staff", officeId] as const,
	},
	REPORTS: {
		ALL: ["reports", "all"] as const,
		BY_ID: (id: string) => ["reports", "id", id] as const,
		BY_CATEGORY: (categoryId: number) => ["reports", "category", categoryId] as const,
	},
	CATEGORIES: {
		ALL: ["categories", "all"] as const,
		BY_ID: (id: number) => ["categories", "id", id] as const,
	},
} as const;
