import type { User, UserUpdatePayload } from "@/types";
import { apiClient } from "../client";

export const userApi = {
	me: () => apiClient.get<{ id: string; role: string }>("/users/me"),
	getUserById: (id: string) => apiClient.get<{ data: User }>(`/users/${id}`),
	updateUser: (id: string, payload: UserUpdatePayload) =>
		apiClient.put<User>(`/users/${id}`, payload),
};
