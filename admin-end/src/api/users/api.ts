import type { Role, User, UserUpdatePayload } from "../../types";
import { apiClient } from "../client";

export const userApi = {
	me: () => apiClient.get<{ id: string; role: Role }>("/users/me"),
	getUserById: (id: string) => apiClient.get<{ data: User }>(`/users/${id}`),
	updateUser: (id: string, payload: UserUpdatePayload) =>
		apiClient.put<User>(`/users/${id}`, payload),
	getAllUser: () => apiClient.get<User[]>("/users"), // not used
	deleteUser: (id: string) => apiClient.delete(`/users/${id}`), // not used
};
