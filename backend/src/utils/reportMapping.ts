import prisma from "../clients/prismaClient";
import { Address } from "../modules/report/report.types";

export const routeReportToAuthority = async (
  categoryId: number,
  address: Address,
) => {
  // 1. Get all offices that handle this category
  const offices = await prisma.authorityOffice.findMany({
    where: {
      isActive: true,
      categories: {
        some: { id: categoryId },
      },
    },
    include: {
      parentOffice: true,
    },
  });

  // 2. Try direct matches by coverage
  for (const office of offices) {
    const coverage = office.address as Address;

    if (matchesCoverage(address, coverage)) {
      return office;
    }
  }

  // 3. If no direct match, try by hierarchy (walk up parent chain)
  for (const office of offices) {
    let current = office.parentOffice;

    while (current) {
      const coverage = current.address as Address;

      if (matchesCoverage(address, coverage)) {
        return current;
      }

      current = await prisma.authorityOffice.findUnique({
        where: { id: current.parentOfficeId ?? -1 },
        include: { parentOffice: true },
      });
    }
  }

  throw new Error("No authority office found to handle this report.");
};

function matchesCoverage(reportAddr: Address, coverage: Address): boolean {
  if (coverage.region !== reportAddr.region) return false;

  if (coverage.zone && coverage.zone !== reportAddr.zone) return false;

  if (coverage.subCity && coverage.subCity !== reportAddr.subCity) return false;

  return true;
}
