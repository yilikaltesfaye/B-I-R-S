import { apiClient } from "../client";
import type { User } from "@/types";

export const userApi = {
	me: () =>
		apiClient.get<{ title: string; message: string; data: User }>("/users/me"),

	getUserFull: () =>
		apiClient.get<{ title: string; message: string; data: User }>("/users/full"),
};
