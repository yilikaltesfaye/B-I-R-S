import { useMutation } from "@tanstack/react-query";
import type { Role, User, UserUpdatePayload } from "../../types";
import { QUERY_KEYS } from "../constants";
import { queryClient } from "../client";
import { userApi } from "./api";

export const useUpdateUser = () =>
	useMutation({
		mutationFn: ({ id, data }: { id: string; data: UserUpdatePayload }) =>
			userApi.updateUser(id, data),

		// Optimistic Update Logic
		onMutate: async (variables) => {
			// Cancel any outgoing refetches to avoid overwrite
			await queryClient.cancelQueries({ queryKey: QUERY_KEYS.USER.FULL });
			await queryClient.cancelQueries({ queryKey: QUERY_KEYS.USER.CURRENT });
			await queryClient.cancelQueries({
				queryKey: QUERY_KEYS.USER.BY_ID(variables.id),
			});

			// Snapshot previous values
			const previousUserFull = queryClient.getQueryData<User>(
				QUERY_KEYS.USER.FULL
			);
			const previousUserCurrent = queryClient.getQueryData<{
				id: string;
				role: Role;
			}>(QUERY_KEYS.USER.CURRENT);

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
					...(variables.data.role && { role: variables.data.role }), // Only update role if changed
				});
			}

			return { previousUserFull, previousUserCurrent };
		},

		// On Success
		onSuccess: (updatedUser, variables) => {
			// Update caches with actual server response
			queryClient.setQueryData(QUERY_KEYS.USER.FULL, updatedUser);
			queryClient.setQueryData(QUERY_KEYS.USER.CURRENT, {
				id: updatedUser.data.id,
				role: updatedUser.data.role,
			});

			// If admin updated another user's profile
			if (variables.id !== updatedUser.data.id) {
				queryClient.invalidateQueries({
					queryKey: QUERY_KEYS.USER.BY_ID(variables.id),
				});
			}
		},

		// Error Handling
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
		},

		// Always refetch after error or success
		onSettled: (_data, _error, _variables) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.FULL });
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.CURRENT });
		},
	});
