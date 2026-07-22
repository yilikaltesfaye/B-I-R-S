import { Status } from "@prisma/client";
import prisma from "../../clients/prismaClient";
import { HttpError } from "../../middlewares/HttpError";
import { routeReportToAuthority } from "../../utils/reportMapping";
import { ReportInterface } from "./report.types";

export const createReportService = async (
  data: ReportInterface,
  userId: string,
) => {
  const authority = await routeReportToAuthority(data.categoryId, data.address);
  const report = await prisma.report.create({
    data: {
      userId: userId,
      authorityOfficeId: authority.id,
      categoryId: data.categoryId,
      description: data.description,
      address: data.address,
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

  return report;
};

export const getAllReportsService = async () => {
  const reports = await prisma.report.findMany({
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

  if (reports.length === 0)
    throw new HttpError("No reports are in the db", 404);

  return reports;
};

export const getReportsByCategoryService = async (categoryId: number) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  if (!category) throw new HttpError("category not found", 404);
  const reports = await prisma.report.findMany({
    where: {
      categoryId: categoryId,
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

  if (!reports)
    throw new HttpError(
      `Report with category ${category?.name} not found`,
      404,
    );

  return reports;
};

export const getReportByIdService = async (reportId: string) => {
  const report = await prisma.report.findUnique({
    where: {
      id: reportId,
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

  if (!report) throw new HttpError(`Report with ID ${reportId} not found`, 404);

  return report;
};
export const updateReportStatusService = async (
  reportId: string,
  status: Status,
) => {
  const report = await prisma.report.findUnique({
    where: {
      id: reportId,
    },
  });
  if (!report) throw new HttpError(`Report with ID ${reportId} not found`, 404);

  const updatedReport = await prisma.report.update({
    where: {
      id: report.id,
    },
    data: {
      status: status,
    },
    include: {
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

  return updatedReport;
};
