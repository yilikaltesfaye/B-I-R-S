import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ReportStatusForm } from "@/components/forms/ReportStatusForm";
import type { Report } from "@/types";

export const ReportsPage: React.FC = () => {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [editingReport, setEditingReport] = useState<Report | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { data, isLoading, error } = useQuery({
		queryKey: ["reports", page, search],
		queryFn: () => reportsAPI.getReports(page, 10),
	});

	const canUpdateStatus = user?.role === "ADMIN" || user?.role === "AUTHORITY";

	const handleUpdateStatus = (report: Report) => {
		setEditingReport(report);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setEditingReport(null);
	};

	const getStatusBadgeVariant = (status: Report["status"]) => {
		switch (status) {
			case "PENDING":
				return "secondary";
			case "IN_PROGRESS":
				return "default";
			case "RESOLVED":
				return "secondary";
			case "REJECTED":
				return "destructive";
			default:
				return "secondary";
		}
	};

	const getStatusColor = (status: Report["status"]) => {
		switch (status) {
			case "PENDING":
				return "text-yellow-600 bg-yellow-50";
			case "IN_PROGRESS":
				return "text-blue-600 bg-blue-50";
			case "RESOLVED":
				return "text-green-600 bg-green-50";
			case "REJECTED":
				return "text-red-600 bg-red-50";
			default:
				return "text-gray-600 bg-gray-50";
		}
	};

	if (error) {
		return (
			<div className="text-center py-10">
				<p className="text-red-600">Error loading reports</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Reports Management</h1>
			</div>

			<Card>
				<CardHeader>
					<div className="flex justify-between items-center">
						<CardTitle>All Reports</CardTitle>
						<div className="flex items-center space-x-2">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
								<Input
									placeholder="Search reports..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className="pl-10 w-64"
								/>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex justify-center py-10">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
						</div>
					) : (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Title</TableHead>
										<TableHead>Category</TableHead>
										<TableHead>Reporter</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Created</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data?.data.data.map((report) => (
										<TableRow key={report.id}>
											<TableCell className="font-medium max-w-48 truncate">
												{report.title}
											</TableCell>
											<TableCell>{report.category.name}</TableCell>
											<TableCell>{report.user.name}</TableCell>
											<TableCell>
												<Badge className={getStatusColor(report.status)}>
													{report.status.replace("_", " ")}
												</Badge>
											</TableCell>
											<TableCell>
												{new Date(report.createdAt).toLocaleDateString()}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end space-x-2">
													<Button variant="outline" size="sm">
														<Eye className="h-4 w-4" />
													</Button>
													{canUpdateStatus && (
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleUpdateStatus(report)}
														>
															<Edit className="h-4 w-4" />
														</Button>
													)}
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							{data?.data.data.length === 0 && (
								<div className="text-center py-10">
									<p className="text-gray-500">No reports found</p>
								</div>
							)}

							{data && data.data.totalPages > 1 && (
								<div className="flex justify-center space-x-2 mt-6">
									<Button
										variant="outline"
										onClick={() => setPage(page - 1)}
										disabled={page === 1}
									>
										Previous
									</Button>
									<span className="py-2 px-4">
										Page {page} of {data.data.totalPages}
									</span>
									<Button
										variant="outline"
										onClick={() => setPage(page + 1)}
										disabled={page === data.data.totalPages}
									>
										Next
									</Button>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Update Report Status</DialogTitle>
					</DialogHeader>
					<ReportStatusForm
						report={editingReport}
						onSuccess={handleCloseDialog}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};
