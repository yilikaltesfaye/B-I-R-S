import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersAPI } from "@/lib/api";
import { userSchema, type UserFormData } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types";

interface UserFormProps {
	user?: User | null;
	onSuccess: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ user, onSuccess }) => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<UserFormData>({
		resolver: zodResolver(userSchema),
		defaultValues: user
			? {
					name: user.name,
					phone: user.phone,
					role: user.role,
			  }
			: undefined,
	});

	const role = watch("role");

	const updateMutation = useMutation({
		mutationFn: (data: UserFormData) => usersAPI.updateUser(user!.id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			toast({
				title: "Success",
				description: "User updated successfully",
			});
			onSuccess();
		},
		onError: () => {
			toast({
				title: "Error",
				description: "Failed to update user",
			});
		},
	});

	const onSubmit = async (data: UserFormData) => {
		if (user) {
			updateMutation.mutate(data);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
				<Label htmlFor="phone">Phone</Label>
				<Input
					id="phone"
					type="tel"
					{...register("phone")}
					className={errors.phone ? "border-red-500" : ""}
				/>
				{errors.phone && (
					<p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
				)}
			</div>

			<div>
				<Label htmlFor="role">Role</Label>
				<Select
					value={role}
					onValueChange={(value) => setValue("role", value as User["role"])}
				>
					<SelectTrigger className={errors.role ? "border-red-500" : ""}>
						<SelectValue placeholder="Select a role" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="USER">User</SelectItem>
						<SelectItem value="AUTHORITY">Authority</SelectItem>
						<SelectItem value="ADMIN">Admin</SelectItem>
					</SelectContent>
				</Select>
				{errors.role && (
					<p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
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
