import { useQuery } from "@tanstack/react-query";
import { userApi } from "./api";
import type { Role, User } from "../../types";
import { QUERY_KEYS } from "../constants";

export const useMe = (enabled: boolean = true) =>
	useQuery<{ id: string; role: Role }>({
		queryKey: QUERY_KEYS.USER.CURRENT,
		queryFn: () => userApi.me().then((res) => res.data),
		retry: false,
		staleTime: 5 * 60 * 1000,
		enabled,
	});

export const useUserFull = (enabled: boolean = true) =>
	useQuery<User>({
		queryKey: QUERY_KEYS.USER.FULL,
		queryFn: async () => {
			const me = await userApi.me();
			const userRes = await userApi.getUserById(me.data.id);
			return userRes.data.data;
		},
		staleTime: 5 * 60 * 1000,
		enabled,
	});
