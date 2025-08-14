import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authorityApi } from "./api";
import { QUERY_KEYS } from "../constants";
import toast from "react-hot-toast";
import type { AuthorityOffice } from "../../types";

export const useCreateAuthorityOffice = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: Partial<AuthorityOffice>) =>
			authorityApi.createAuthorityOffice(data),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTHORITY.ALL });
			toast.success("Authority office created successfully");
		},

		onError: () => {
			toast.error("Failed to create authority office");
		},
	});
};

export const useUpdateAuthorityOffice = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: number;
			data: Partial<AuthorityOffice>;
		}) => authorityApi.updateAuthorityOffice(id, data),

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTHORITY.ALL });
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.AUTHORITY.BY_ID(variables.id),
			});
			toast.success("Authority office updated successfully");
		},

		onError: () => {
			toast.error("Failed to update authority office");
		},
	});
};

export const useDeleteAuthorityOffice = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => authorityApi.deleteAuthorityOffice(id),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTHORITY.ALL });
			toast.success("Authority office deleted successfully");
		},

		onError: () => {
			toast.error("Failed to delete authority office");
		},
	});
};

export const useAssignCategoriesToOffice = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, categoryIds }: { id: number; categoryIds: number[] }) =>
			authorityApi.assignCategoriesToOffice(id, categoryIds),

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTHORITY.ALL });
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.AUTHORITY.BY_ID(variables.id),
			});
			toast.success("Categories assigned successfully");
		},

		onError: () => {
			toast.error("Failed to assign categories");
		},
	});
};

export const useAddAuthorityStaff = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			officeId,
			data,
		}: {
			officeId: number;
			data: { userId: number; position: string };
		}) => authorityApi.addAuthorityStaff(officeId, data),

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTHORITY.ALL });
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.AUTHORITY.STAFF(variables.officeId),
			});
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.ALL });
			toast.success("Staff member added successfully");
		},

		onError: () => {
			toast.error("Failed to add staff member");
		},
	});
};

export const useRemoveAuthorityStaff = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userId: number) => authorityApi.removeAuthorityStaff(userId),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTHORITY.ALL });
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.ALL });
			toast.success("Staff member removed successfully");
		},

		onError: () => {
			toast.error("Failed to remove staff member");
		},
	});
};
