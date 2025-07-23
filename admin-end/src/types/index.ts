export enum Role {
	USER,
	ADMIN,
	AUTHORITY,
}
export interface User {
	id: string;
	name: string;
	phone: string;
	email: string;
	role: Role;
	createdAt: string;
	updatedAt: string;
}

export interface AuthorityOffice {
	id: string;
	name: string;
	description: string;
	address: string;
	phone: string;
	email: string;
	createdAt: string;
	updatedAt: string;
}

export interface AuthorityStaff {
	id: string;
	userId: string;
	officeId: string;
	user: User;
	authority: AuthorityOffice;
	createdAt: string;
}

export interface Category {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export interface Report {
	id: string;
	title: string;
	description: string;
	status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
	categoryId: string;
	userId: string;
	assignedAuthorityId?: string;
	category: Category;
	user: User;
	assignedAuthority?: AuthorityOffice;
	createdAt: string;
	updatedAt: string;
}

export interface Comment {
	id: string;
	content: string;
	reportId: string;
	userId: string;
	parentId?: string;
	user: User;
	replies?: Comment[];
	createdAt: string;
	updatedAt: string;
}

export interface PaginatedResponse<T> {
	data: T;
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface AuthContextType {
	user: User | null;
	login: (phone: string, password: string) => Promise<void>;
	logout: () => void;
	isLoading: boolean;
}
