import type { AuthorityOffice } from "../../types";
import { apiClient } from "../client";

export const authorityApi = {
	// Office Management
	createAuthorityOffice: (payload: Partial<AuthorityOffice>) =>
		apiClient.post<{ title: string; message: string; data: AuthorityOffice }>(
			"/authorities",
			payload
		),

	getAllAuthorityOffices: () =>
		apiClient.get<{ title: string; message: string; data: AuthorityOffice[] }>(
			"/authorities"
		),

	getAuthorityOfficeById: (id: number) =>
		apiClient.get<{ title: string; message: string; data: AuthorityOffice }>(
			`/authorities/${id}`
		),

	updateAuthorityOffice: (id: number, data: Partial<AuthorityOffice>) =>
		apiClient.put<{ title: string; message: string; data: AuthorityOffice }>(
			`/authorities/${id}`,
			data
		),

	deleteAuthorityOffice: (id: number) => apiClient.delete(`/authorities/${id}`),

	//Category Assignment
	assignCategoriesToOffice: (id: number, categoryIds: number[]) =>
		apiClient.post(`/authorities/${id}/categories`, { categoryIds }),

	// Staff Management
	addAuthorityStaff: (
		officeId: number,
		data: { userId: number; position: string }
	) => apiClient.post(`/authorities/${officeId}/staff`, data),

	getAuthorityStaff: (officeId: number) =>
		apiClient.get(`/authorities/${officeId}/staff`),

	removeAuthorityStaff: (userId: number) =>
		apiClient.delete(`/authorities/staff/${userId}`),
};
