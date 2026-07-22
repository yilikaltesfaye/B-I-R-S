import prisma from "../../clients/prismaClient";
import { HttpError } from "../../middlewares/HttpError";
import { NextFunction, Request, Response } from "express";
import { ReportSchema } from "./report.schema";
import * as ReportService from "./report.service";
import { AuthedRequest } from "../../middlewares/auth.middleware";
import { Status } from "@prisma/client";

export const createReportController = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
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
  next: NextFunction,
) => {
  try {
    const reports = await ReportService.getAllReportsService();
    res.json({
      title: "success",
      message: "All reports for Admin Only",
      data: reports,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getAuthorityReportsController = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
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
      select: {
        id: true,
        description: true,
        status: true,
        submittedAt: true,
        address: true,
        updatedAt: true,
        category: {
          select: {
            name: true,
          },
        },
        authorityOffice: {
          select: {
            officeName: true,
            address: true,
            iconUrl: true,
          },
        },
        user: {
          select: {
            name: true,
            id: true,
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

export const getReportsByCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rawId = req.params.categoryId;
    const categoryId = Number(rawId);

    if (!rawId || isNaN(categoryId)) {
      throw new HttpError("Invalid or missing category ID", 400);
    }
    const reports = await ReportService.getReportsByCategoryService(categoryId);
    res.json({
      title: "success",
      message: "reports by category id",
      data: reports,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getReportByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reportId = String(req.params.id);
    const report = await ReportService.getReportByIdService(reportId);
    res.json({
      title: "success",
      message: "report by id",
      data: report,
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateReportStatusController = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reportId = String(req.params.id);
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
          400,
        );
      }

      const isAssigned = await prisma.authorityStaff.findFirst({
        where: {
          userId: req.userId,
          authorityOfficeId: authorityOfficeId,
        },
      });

      if (!isAssigned) {
        throw new HttpError(
          "You do not have permission to update this report",
          403,
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
  next: NextFunction,
) => {
  try {
    const { region, zone, woreda, city, subCity, kebele, skip, take, status } =
      req.query;

    const skipNumber = parseInt(skip as string) || 0;
    const takeNumber = Math.min(parseInt(take as string) || 50, 100);

    const addressFilters: Record<string, string> = {};
    if (region) addressFilters.region = region as string;
    if (zone) addressFilters.zone = zone as string;
    if (woreda) addressFilters.woreda = woreda as string;
    if (city) addressFilters.city = city as string;
    if (subCity) addressFilters.subCity = subCity as string;
    if (kebele) addressFilters.kebele = kebele as string;

    let statusFilter: Status | undefined = undefined;
    if (
      status &&
      typeof status === "string" &&
      Object.values(Status).includes(status as Status)
    ) {
      statusFilter = status as Status;
    }

    const addressConditions = Object.entries(addressFilters).map(
      ([key, value]) => ({
        address: {
          path: [key],
          equals: value,
        },
      }),
    );

    const whereCondition: any = {};

    if (addressConditions.length > 0) {
      whereCondition.OR = addressConditions;
    }

    if (statusFilter) {
      whereCondition.status = statusFilter;
    }

    const reports = await prisma.report.findMany({
      where: whereCondition,
      skip: skipNumber,
      take: takeNumber,
      select: {
        id: true,
        description: true,
        status: true,
        submittedAt: true,
        address: true,
        updatedAt: true,
        category: {
          select: {
            name: true,
          },
        },
        authorityOffice: {
          select: {
            officeName: true,
            address: true,
            iconUrl: true,
          },
        },
        user: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
    });
    res.json({
      title: "Success",
      message: "Reports fetched",
      data: reports,
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

export const getReportByUserIdController = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = String(req.params.userId);

    if (!userId) throw new HttpError("userId Required", 400);

    if (req.userId !== userId && req.userRole !== "ADMIN") {
      throw new HttpError(
        "you are not authorozied to reports made by this user",
        401,
      );
    }

    const reports = await prisma.report.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        description: true,
        status: true,
        submittedAt: true,
        address: true,
        updatedAt: true,
        category: {
          select: {
            name: true,
          },
        },
        authorityOffice: {
          select: {
            officeName: true,
            address: true,
            iconUrl: true,
          },
        },
        user: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    if (reports.length === 0) {
      return res.status(404).json({
        title: "fail",
        message: "There are no reports made by this user",
      });
    }
    res.json({
      title: "success",
      message: "these are the reports made by you",
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};
