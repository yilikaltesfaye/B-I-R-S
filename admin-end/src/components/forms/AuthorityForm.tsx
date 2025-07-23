import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authoritiesAPI } from "@/lib/api";
import { authoritySchema, type AuthorityFormData } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Authority } from "@/types";

interface AuthorityFormProps {
	authority?: Authority | null;
	isCreateMode?: boolean;
	onSuccess: () => void;
}

export const AuthorityForm: React.FC<AuthorityFormProps> = ({
	authority,
	isCreateMode = false,
	onSuccess,
}) => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<AuthorityFormData>({
		resolver: zodResolver(authoritySchema),
		defaultValues: authority
			? {
					name: authority.name,
					description: authority.description,
					address: authority.address,
					phone: authority.phone,
					email: authority.email,
			  }
			: undefined,
	});

	const createMutation = useMutation({
		mutationFn: authoritiesAPI.createAuthority,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authorities"] });
			toast({
				title: "Success",
				description: "Authority created successfully",
			});
			onSuccess();
		},
		onError: () => {
			toast({
				title: "Error",
				description: "Failed to create authority",
			});
		},
	});

	const updateMutation = useMutation({
		mutationFn: (data: AuthorityFormData) =>
			authoritiesAPI.updateAuthority(authority!.id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authorities"] });
			toast({
				title: "Success",
				description: "Authority updated successfully",
			});
			onSuccess();
		},
		onError: () => {
			toast({
				title: "Error",
				description: "Failed to update authority",
			});
		},
	});

	const onSubmit = async (data: AuthorityFormData) => {
		if (isCreateMode) {
			createMutation.mutate(data);
		} else if (authority) {
			updateMutation.mutate(data);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label htmlFor="name">Name</Label>
					<Input
						id="name"
						{...register("name")}
						className={errors.name ? "border-red-500" : ""}
					/>
					{errors.name && (
						<p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
					)}
				</div>

				<div>
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						{...register("email")}
						className={errors.email ? "border-red-500" : ""}
					/>
					{errors.email && (
						<p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
					)}
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label htmlFor="phone">Phone</Label>
					<Input
						id="phone"
						{...register("phone")}
						className={errors.phone ? "border-red-500" : ""}
					/>
					{errors.phone && (
						<p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
					)}
				</div>

				<div>
					<Label htmlFor="address">Address</Label>
					<Input
						id="address"
						{...register("address")}
						className={errors.address ? "border-red-500" : ""}
					/>
					{errors.address && (
						<p className="text-sm text-red-500 mt-1">
							{errors.address.message}
						</p>
					)}
				</div>
			</div>

			<div>
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					{...register("description")}
					className={errors.description ? "border-red-500" : ""}
					rows={4}
				/>
				{errors.description && (
					<p className="text-sm text-red-500 mt-1">
						{errors.description.message}
					</p>
				)}
			</div>

			<div className="flex justify-end space-x-2">
				<Button type="button" variant="outline" onClick={onSuccess}>
					Cancel
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Saving..." : "Save"}
				</Button>
			</div>
		</form>
	);
};
