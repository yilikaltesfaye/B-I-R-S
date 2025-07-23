import axios from "axios";
import type {
	User,
	AuthorityOffice,
	Category,
	Report,
	Comment,
	PaginatedResponse,
	AuthorityStaff,
} from "@/types";

const API_BASE_URL = "http://localhost:5001/";

export const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("accessToken");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Auth API
export const authAPI = {
	login: (phone: string, password: string) =>
		api.post<{ userData: User; accessToken: string }>("/auth/login", {
			phone,
			password,
			appContext: "admin",
		}),
	logout: async () => {
		return await api.post("/auth/logout");
	},
	me: () => api.get<User>("/users/me"),
	refreshAccessToken: () => {
		return api.post<{ accessToken: string }>("/auth/refresh-access-token");
	},
};

// Users API
export const usersAPI = {
	getUsers: (page = 1, limit = 10) =>
		api.get<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`),

	getUser: (id: string) =>
		api.get<{ status: string; message: string; data: User }>(`/users/${id}`),

	updateUser: (id: string, data: Partial<User>) =>
		api.put<User>(`/users/${id}`, data),

	deleteUser: (id: string) => api.delete(`/users/${id}`),
};

// Authorities API
export const authoritiesAPI = {
	createAuthority: (
		data: Omit<AuthorityOffice, "id" | "createdAt" | "updatedAt">
	) => api.post<AuthorityOffice>("/authorities", data),

	getAuthorities: (page = 1, limit = 10) =>
		api.get<PaginatedResponse<AuthorityOffice>>(
			`/authorities?page=${page}&limit=${limit}`
		),

	getAuthority: (id: string) => api.get<AuthorityOffice>(`/authorities/${id}`),

	updateAuthority: (id: string, data: Partial<AuthorityOffice>) =>
		api.put<AuthorityOffice>(`/authorities/${id}`, data),

	deleteAuthority: (id: string) => api.delete(`/authorities/${id}`),

	addStaff: (officeId: string, userId: string) =>
		api.post<AuthorityStaff>(`/authorities/${officeId}/staff`, { userId }),

	getStaff: (officeId: string) =>
		api.get<AuthorityStaff[]>(`/authorities/${officeId}/staff`),

	removeStaff: (userId: string) => api.delete(`/authorities/staff/${userId}`),
};

// Categories API
export const categoriesAPI = {
	createCategory: (data: Omit<Category, "id" | "createdAt" | "updatedAt">) =>
		api.post<Category>("/categories", data),

	getCategories: (page = 1, limit = 10) =>
		api.get<PaginatedResponse<Category>>(
			`/categories?page=${page}&limit=${limit}`
		),

	getCategory: (id: string) => api.get<Category>(`/categories/${id}`),

	updateCategory: (id: string, data: Partial<Category>) =>
		api.put<Category>(`/categories/${id}`, data),

	deleteCategory: (id: string) => api.delete(`/categories/${id}`),
};

// Reports API
export const reportsAPI = {
	getReports: (page = 1, limit = 10) =>
		api.get<PaginatedResponse<Report>>(`/reports?page=${page}&limit=${limit}`),

	getReport: (id: string) => api.get<Report>(`/reports/${id}`),

	updateReportStatus: (id: string, status: Report["status"]) =>
		api.put<Report>(`/reports/${id}/status`, { status }),
};

// Comments API
export const commentsAPI = {
	getReportComments: (reportId: string) =>
		api.get<Comment[]>(`/comments/report/${reportId}`),

	deleteComment: (id: string) => api.delete(`/comments/${id}`),
};
