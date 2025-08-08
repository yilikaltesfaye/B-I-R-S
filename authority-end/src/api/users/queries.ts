import { useQuery } from "@tanstack/react-query";
import { userApi } from "./api";

export const useMe = (enabled: boolean) => {
	return useQuery({
		queryKey: ["user", "me"],
		queryFn: () => userApi.me().then(res => res.data),
		enabled,
	});
};

export const useUserFull = (enabled: boolean) => {
	return useQuery({
		queryKey: ["user", "full"],
		queryFn: () => userApi.getUserFull().then(res => res.data),
		enabled,
	});
};
