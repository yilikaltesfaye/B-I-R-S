import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsAPI } from "@/lib/api";
import { reportStatusSchema, type ReportStatusFormData } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Report } from "@/types";

interface ReportStatusFormProps {
	report?: Report | null;
	onSuccess: () => void;
}

export const ReportStatusForm: React.FC<ReportStatusFormProps> = ({
	report,
	onSuccess,
}) => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const {
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<ReportStatusFormData>({
		resolver: zodResolver(reportStatusSchema),
		defaultValues: report
			? {
					status: report.status,
			  }
			: undefined,
	});

	const status = watch("status");

	const updateMutation = useMutation({
		mutationFn: (data: ReportStatusFormData) =>
			reportsAPI.updateReportStatus(report!.id, data.status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["reports"] });
			toast({
				title: "Success",
				description: "Report status updated successfully",
			});
			onSuccess();
		},
		onError: () => {
			toast({
				title: "Error",
				description: "Failed to update report status",
			});
		},
	});

	const onSubmit = async (data: ReportStatusFormData) => {
		if (report) {
			updateMutation.mutate(data);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			{report && (
				<div className="space-y-2">
					<h3 className="font-medium">{report.title}</h3>
					<p className="text-sm text-gray-600">{report.description}</p>
					<p className="text-sm text-gray-500">
						Reporter: {report.user.name} | Category: {report.category.name}
					</p>
				</div>
			)}

			<div>
				<Label htmlFor="status">Status</Label>
				<Select
					value={status}
					onValueChange={(value) =>
						setValue("status", value as Report["status"])
					}
				>
					<SelectTrigger className={errors.status ? "border-red-500" : ""}>
						<SelectValue placeholder="Select a status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="PENDING">Pending</SelectItem>
						<SelectItem value="IN_PROGRESS">In Progress</SelectItem>
						<SelectItem value="RESOLVED">Resolved</SelectItem>
						<SelectItem value="REJECTED">Rejected</SelectItem>
					</SelectContent>
				</Select>
				{errors.status && (
					<p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
				)}
			</div>

			<div className="flex justify-end space-x-2">
				<Button type="button" variant="outline" onClick={onSuccess}>
					Cancel
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Updating..." : "Update Status"}
				</Button>
			</div>
		</form>
	);
};
