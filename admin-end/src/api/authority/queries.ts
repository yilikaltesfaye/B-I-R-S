import { useQuery } from "@tanstack/react-query";
import { authorityApi } from "./api";
import type { AuthorityOffice } from "../../types";
import { QUERY_KEYS } from "../constants";

export const useAllAuthorityOffices = () =>
	useQuery<AuthorityOffice[]>({
		queryKey: QUERY_KEYS.AUTHORITY.ALL,
		queryFn: () =>
			authorityApi.getAllAuthorityOffices().then((res) => res.data.data),
		staleTime: 5 * 60 * 1000,
	});

export const useAuthorityOfficeById = (id: number) =>
	useQuery<AuthorityOffice>({
		queryKey: QUERY_KEYS.AUTHORITY.BY_ID(id),
		queryFn: () =>
			authorityApi.getAuthorityOfficeById(id).then((res) => res.data.data),
		staleTime: 5 * 60 * 1000,
		enabled: !!id,
	});

export const useAuthorityStaff = (officeId: number) =>
	useQuery({
		queryKey: QUERY_KEYS.AUTHORITY.STAFF(officeId),
		queryFn: () =>
			authorityApi.getAuthorityStaff(officeId).then((res) => res.data),
		staleTime: 5 * 60 * 1000,
		enabled: !!officeId,
	});
