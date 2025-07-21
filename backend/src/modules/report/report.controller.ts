import prisma from "../../clients/prismaClient";
import { HttpError } from "../../middlewares/HttpError";
import { NextFunction, Request, Response } from "express";
import { ReportSchema, UpdateReportStatusSchema } from "./report.schema";
import * as ReportService from "./report.service";
import { AuthedRequest } from "../../middlewares/auth.middleware";

export const createReportController = async (
	req: AuthedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const validated = ReportSchema.parse(req.body);
		const userId = req.userId;
		if (!userId) {
			throw new Error("no user id was provided");
		}

		await ReportService.createReportService(validated, userId);
		res.json({
			title: "success",
			message: "Report Successfully Submitted",
		});
	} catch (error: any) {
		next(error);
	}
};

export const getAllReportsController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const reports = await ReportService.getAllReportsService();
		res.json({
			title: "success",
			message: "All reports for Admin Only",
			data: { reports },
		});
	} catch (error: any) {
		next(error);
	}
};

export const getAuthorityReportsController = async (
	req: AuthedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId } = req;

		// Get the authority office ID the user belongs to
		const authorityStaff = await prisma.authorityStaff.findUnique({
			where: { userId },
			include: {
				authorityOffice: true,
			},
		});

		if (!authorityStaff) {
			throw new HttpError("Not part of any authority office", 403);
		}

		const authorityOfficeId = authorityStaff.authorityOfficeId;

		const reports = await prisma.report.findMany({
			where: {
				authorityOfficeId,
			},
			include: {
				category: true,
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						phone: true,
					},
				},
			},
		});

		res.json({
			title: "success",
			message: "Reports for your authority office",
			data: reports,
		});
	} catch (error) {
		next(error);
	}
};

export const getReportByIdController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const reportId = req.params.id;
		const report = await ReportService.getReportByIdService(reportId);
		res.json({
			title: "success",
			message: "report by id",
			data: { report },
		});
	} catch (error: any) {
		next(error);
	}
};

export const updateReportStatusController = async (
	req: AuthedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const reportId = req.params.id;
		const { status } = req.body;

		if (!reportId || !status) {
			throw new HttpError("Report ID and new status are required", 400);
		}

		const report = await prisma.report.findUnique({
			where: { id: reportId },
			select: {
				id: true,
				authorityOfficeId: true,
			},
		});

		if (!report) {
			throw new HttpError("Report not found", 404);
		}

		// Check access control
		if (req.userRole === "AUTHORITY") {
			const { authorityOfficeId } = report;

			if (!authorityOfficeId) {
				throw new HttpError(
					"Report is not assigned to any authority office",
					400
				);
			}

			const isAssigned = await prisma.authorityStaff.findFirst({
				where: {
					userId: req.userId,
					authorityOfficeId: authorityOfficeId, // Safe now
				},
			});

			if (!isAssigned) {
				throw new HttpError(
					"You do not have permission to update this report",
					403
				);
			}
		} else if (req.userRole !== "ADMIN") {
			throw new HttpError("Access denied", 403);
		}

		const updated = await prisma.report.update({
			where: { id: reportId },
			data: { status },
		});

		res.status(200).json({
			title: "success",
			message: "Report status updated",
			data: updated,
		});
	} catch (error) {
		next(error);
	}
};

export const getReportsByAddressController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Pull filters from query params (e.g., ?region=Addis&city=Bole)
		const { region, zone, woreda, city, subCity, kebele, skip, take } =
			req.query;

		// Default pagination values
		const skipNumber = parseInt(skip as string) || 0;
		const takeNumber = Math.min(parseInt(take as string) || 50, 100); // max 100 to protect DB

		// Build dynamic JSON filters
		const addressFilters: Record<string, string> = {};
		if (region) addressFilters.region = region as string;
		if (zone) addressFilters.zone = zone as string;
		if (woreda) addressFilters.woreda = woreda as string;
		if (city) addressFilters.city = city as string;
		if (subCity) addressFilters.subCity = subCity as string;
		if (kebele) addressFilters.kebele = kebele as string;

		// Compose Prisma where condition
		const whereCondition =
			Object.keys(addressFilters).length > 0
				? {
						AND: Object.entries(addressFilters).map(([key, value]) => ({
							address: {
								path: [key],
								equals: value,
							},
						})),
					}
				: {};

		// Fetch reports with pagination & sorting
		const reports = await prisma.report.findMany({
			where: whereCondition,
			skip: skipNumber,
			take: takeNumber,
			orderBy: {
				submittedAt: "desc",
			},
		});

		res.json({
			title: "success",
			message: "Reports fetched",
			data: { reports },
			pagination: {
				skip: skipNumber,
				take: takeNumber,
				count: reports.length,
			},
		});
	} catch (error) {
		next(error);
	}
};
