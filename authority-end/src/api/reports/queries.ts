import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "./api";

export const useReportsByCategoryId = (categoryId: number) => {
	return useQuery({
		queryKey: ["reports", "category", categoryId],
		queryFn: () =>
			reportsApi.getReportsByCategoryId(categoryId).then((res) => res.data),
		enabled: !!categoryId,
	});
};

export const useReportById = (id: string) => {
	return useQuery({
		queryKey: ["report", id],
		queryFn: () => reportsApi.getReportById(id).then((res) => res.data),
		enabled: !!id,
	});
};

export const useAuthorityReports = () => {
	return useQuery({
		queryKey: ["authority", "reports"],
		queryFn: async () => {
			try {
				return await reportsApi.getAuthorityReportsByUserId().then((res) => res.data);
			} catch (error) {
				// Return mock data for demo purposes
				return {
					title: "success",
					message: "Mock reports for demo",
					data: [
						{
							id: "report-1",
							description: "Broken water pipe on Main Street causing flooding",
							status: "PENDING",
							submittedAt: new Date("2024-01-15"),
							updatedAt: new Date("2024-01-15"),
							address: { region: "Addis Ababa", city: "Addis Ababa", zone: "Zone 1" },
							category: { name: "Water Infrastructure" },
							authorityOffice: {
								officeName: "Water and Sewerage Authority",
								address: { region: "Addis Ababa", city: "Addis Ababa" },
								iconUrl: "https://via.placeholder.com/50",
							},
							user: { name: "John Doe", id: "user-1" },
						},
						{
							id: "report-2",
							description: "Potholes on Ring Road need urgent repair",
							status: "IN_PROGRESS",
							submittedAt: new Date("2024-01-14"),
							updatedAt: new Date("2024-01-16"),
							address: { region: "Addis Ababa", city: "Addis Ababa", zone: "Zone 2" },
							category: { name: "Road Infrastructure" },
							authorityOffice: {
								officeName: "Road Authority",
								address: { region: "Addis Ababa", city: "Addis Ababa" },
								iconUrl: "https://via.placeholder.com/50",
							},
							user: { name: "Jane Smith", id: "user-2" },
						},
						{
							id: "report-3",
							description: "Street lights not working in residential area",
							status: "FIXED",
							submittedAt: new Date("2024-01-10"),
							updatedAt: new Date("2024-01-18"),
							address: { region: "Addis Ababa", city: "Addis Ababa", zone: "Zone 3" },
							category: { name: "Electrical Infrastructure" },
							authorityOffice: {
								officeName: "Electrical Services Authority",
								address: { region: "Addis Ababa", city: "Addis Ababa" },
								iconUrl: "https://via.placeholder.com/50",
							},
							user: { name: "Mike Johnson", id: "user-3" },
						},
						{
							id: "report-4",
							description: "Damaged bridge needs structural inspection",
							status: "IN_PROGRESS",
							submittedAt: new Date("2024-01-12"),
							updatedAt: new Date("2024-01-17"),
							address: { region: "Addis Ababa", city: "Addis Ababa", zone: "Zone 4" },
							category: { name: "Bridge Infrastructure" },
							authorityOffice: {
								officeName: "Bridge Maintenance Authority",
								address: { region: "Addis Ababa", city: "Addis Ababa" },
								iconUrl: "https://via.placeholder.com/50",
							},
							user: { name: "Sarah Wilson", id: "user-4" },
						},
						{
							id: "report-5",
							description: "Sewage overflow in downtown area",
							status: "REJECTED",
							submittedAt: new Date("2024-01-08"),
							updatedAt: new Date("2024-01-19"),
							address: { region: "Addis Ababa", city: "Addis Ababa", zone: "Zone 5" },
							category: { name: "Sewerage Infrastructure" },
							authorityOffice: {
								officeName: "Sewerage Management Authority",
								address: { region: "Addis Ababa", city: "Addis Ababa" },
								iconUrl: "https://via.placeholder.com/50",
							},
							user: { name: "David Brown", id: "user-5" },
						},
					],
				};
			}
		},
	});
};
