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
			status: "success",
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
			status: "success",
			message: "All reports for Admin Only",
			data: { reports },
		});
	} catch (error: any) {
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
			status: "success",
			message: "report by id",
			data: { report },
		});
	} catch (error: any) {
		next(error);
	}
};
export const updateReportStatusController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const reportId = req.params.id;
		const { status } = UpdateReportStatusSchema.parse(req.body);

		const report = await ReportService.updateReportStatusService(
			reportId,
			status
		);
		res.json({
			status: "success",
			message: "Updated the status for a particular report",
			data: { report },
		});
	} catch (error: any) {
		next(error);
	}
};
