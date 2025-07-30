import { useQuery } from "@tanstack/react-query";
import { userApi } from "./api";
import type { User } from "../../types";

export const useMe = (enabled: boolean = true) =>
	useQuery<{ id: string; role: string }>({
		queryKey: ["userIdRole"],
		queryFn: () => userApi.me().then((res) => res.data),
		retry: false,
		staleTime: 5 * 60 * 1000,
		enabled,
	});

export const useUserFull = (enabled: boolean = true) =>
	useQuery<User>({
		queryKey: ["userFull"],
		queryFn: async () => {
			const me = await userApi.me();
			const userRes = await userApi.getUserById(me.data.id);
			return userRes.data.data;
		},
		staleTime: 5 * 60 * 1000,
		enabled,
	});
