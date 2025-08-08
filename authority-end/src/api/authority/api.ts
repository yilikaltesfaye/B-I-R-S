import type { AuthorityOffice } from "../../types";
import { apiClient } from "../client";

export const authorityApi = {
	getAuthorityOfficeById: (id: number) =>
		apiClient.get<AuthorityOffice>(`/authorities/${id}`),
};
