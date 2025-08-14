import { userApi } from "./api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Role, User, UserUpdatePayload } from "../../types";
import { QUERY_KEYS } from "../constants";
import toast from "react-hot-toast";

export const useUpdateUser = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UserUpdatePayload }) =>
			userApi.updateUser(id, data),

		onMutate: async (variables) => {
			await queryClient.cancelQueries({ queryKey: QUERY_KEYS.USER.FULL });
			await queryClient.cancelQueries({ queryKey: QUERY_KEYS.USER.CURRENT });
			await queryClient.cancelQueries({ queryKey: QUERY_KEYS.USER.ALL });
			await queryClient.cancelQueries({
				queryKey: QUERY_KEYS.USER.BY_ID(variables.id),
			});

			const previousUserFull = queryClient.getQueryData<User>(
				QUERY_KEYS.USER.FULL
			);
			const previousUserCurrent = queryClient.getQueryData<{
				id: string;
				role: Role;
			}>(QUERY_KEYS.USER.CURRENT);
			const previousAllUsers = queryClient.getQueryData<User[]>(
				QUERY_KEYS.USER.ALL
			);

			// Optimistically update cache
			if (previousUserFull && variables.id === previousUserFull.id) {
				queryClient.setQueryData(QUERY_KEYS.USER.FULL, {
					...previousUserFull,
					...variables.data,
				});
			}

			if (previousUserCurrent && variables.id === previousUserCurrent.id) {
				queryClient.setQueryData(QUERY_KEYS.USER.CURRENT, {
					...previousUserCurrent,
					...(variables.data.role && { role: variables.data.role }),
				});
			}

			if (previousAllUsers) {
				queryClient.setQueryData(QUERY_KEYS.USER.ALL, 
					previousAllUsers.map(user => 
						user.id === variables.id ? { ...user, ...variables.data } : user
					)
				);
			}

			return { previousUserFull, previousUserCurrent, previousAllUsers };
		},

		onSuccess: (updatedUser, variables) => {
			queryClient.setQueryData(QUERY_KEYS.USER.FULL, updatedUser.data.data);
			queryClient.setQueryData(QUERY_KEYS.USER.CURRENT, {
				id: updatedUser.data.data.id,
				role: updatedUser.data.data.role,
			});

			// Invalidate and refetch queries
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.ALL });
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.USER.BY_ID(variables.id),
			});
			
			toast.success("User updated successfully");
		},

		onError: (_error, _variables, context) => {
			// Rollback optimistic updates
			if (context?.previousUserFull) {
				queryClient.setQueryData(
					QUERY_KEYS.USER.FULL,
					context.previousUserFull
				);
			}
			if (context?.previousUserCurrent) {
				queryClient.setQueryData(
					QUERY_KEYS.USER.CURRENT,
					context.previousUserCurrent
				);
			}
			if (context?.previousAllUsers) {
				queryClient.setQueryData(
					QUERY_KEYS.USER.ALL,
					context.previousAllUsers
				);
			}
			
			toast.error("Failed to update user");
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.FULL });
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.CURRENT });
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.ALL });
		},
	});
};

export const useDeleteUser = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (id: string) => userApi.deleteUser(id),
		
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.ALL });
			toast.success("User deleted successfully");
		},
		
		onError: () => {
			toast.error("Failed to delete user");
		},
	});
};
