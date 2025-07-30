export const QUERY_KEYS = {
	USER: {
		CURRENT: ["user", "current"] as const, // Replaces ["userIdRole"]
		FULL: ["user", "full"] as const, // Replaces ["userFull"]
		BY_ID: (id: string) => ["user", "id", id] as const,
	},
} as const;
