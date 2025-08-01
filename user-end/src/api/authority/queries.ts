import { useQuery } from "@tanstack/react-query";
import { authorityApi } from "./api";

export function useAuthorityOffice(id: number) {
	return useQuery({
		queryKey: ["authorityOffice", id],
		queryFn: () =>
			authorityApi.getAuthorityOfficeById(id).then((res) => res.data),
		enabled: !!id,
	});
}
