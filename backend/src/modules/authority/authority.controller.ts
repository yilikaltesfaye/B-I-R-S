import { Request, Response, NextFunction } from "express";
import prisma from "../../clients/prismaClient";
import { AuthedRequest } from "../../middlewares/auth.middleware";
import { HttpError } from "../../middlewares/HttpError";

export const createAuthorityOfficeController = async (
	req: AuthedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const { officeName, email, phone, address, iconUrl, parentOfficeId } =
			req.body;

		if (!officeName || !email || !phone || !address || !iconUrl) {
			throw new HttpError("Missing required fields", 400);
		}

		// optional: validate parentOfficeId if provided
		if (parentOfficeId) {
			const parentExists = await prisma.authorityOffice.findUnique({
				where: { id: parentOfficeId },
			});

			if (!parentExists) {
				throw new HttpError("Invalid parentOfficeId", 400);
			}
		}

		const newOffice = await prisma.authorityOffice.create({
			data: {
				officeName,
				email,
				phone,
				address,
				iconUrl,
				parentOfficeId: parentOfficeId ?? null,
			},
			select: {
				id: true,
				officeName: true,
				email: true,
				phone: true,
				address: true,
				iconUrl: true,
				isActive: true,
				createdAt: true,
				updatedAt: true,
				parentOfficeId: true,
			},
		});

		res.status(201).json({
			status: "success",
			message: "Authority office created successfully",
			data: newOffice,
		});
	} catch (error) {
		next(error);
	}
};

export const getAllAuthorityOfficesController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const offices = await prisma.authorityOffice.findMany({
			select: {
				id: true,
				officeName: true,
				email: true,
				phone: true,
				address: true,
				iconUrl: true,
				isActive: true,
				createdAt: true,
				updatedAt: true,
				parentOfficeId: true,
				parentOffice: {
					select: {
						id: true,
						officeName: true,
					},
				},
				childOffices: {
					select: {
						id: true,
						officeName: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		res.json({
			status: "success",
			message: "Authority offices fetched successfully",
			data: offices,
		});
	} catch (error) {
		next(error);
	}
};

export const getAuthorityOfficeByIdController = async (
	req: AuthedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId, userRole } = req;
		const officeId = Number(req.params.id);

		if (!userId) {
			throw new HttpError("No user ID in session", 401);
		}

		// Fetch the office to confirm existence
		const office = await prisma.authorityOffice.findUnique({
			where: { id: officeId },
			include: {
				authorityStaff: {
					select: { userId: true },
				},
			},
		});

		if (!office) {
			throw new HttpError("Authority office not found", 404);
		}

		// Admins get instant access
		if (userRole === "ADMIN") {
			res.json({ status: "success", data: { office } });
			return;
		}

		// Check if user is staff of this office
		const isStaff = office.authorityStaff.some(
			(staff) => staff.userId === userId
		);

		if (!isStaff) {
			throw new HttpError("Access denied", 403);
		}

		// Return office details for authorized staff
		res.json({ status: "success", data: { office } });
	} catch (error) {
		next(error);
	}
};

export const updateAuthorityOfficeController = async (
	req: AuthedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const officeId = Number(req.params.id);
		const updateData = req.body;

		// Check if office exists
		const existingOffice = await prisma.authorityOffice.findUnique({
			where: { id: officeId },
		});

		if (!existingOffice) {
			throw new HttpError("Authority office not found", 404);
		}

		// Optional: sanitize or validate updateData here

		const updatedOffice = await prisma.authorityOffice.update({
			where: { id: officeId },
			data: updateData,
		});

		res.json({
			status: "success",
			message: "Authority office updated successfully",
			data: updatedOffice,
		});
	} catch (error) {
		next(error);
	}
};

export const deleteAuthorityOfficeController = async (
	req: AuthedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const officeId = Number(req.params.id);

		// Check if the office exists
		const existingOffice = await prisma.authorityOffice.findUnique({
			where: { id: officeId },
		});

		if (!existingOffice) {
			throw new HttpError("Authority office not found", 404);
		}

		// Delete the office
		await prisma.authorityOffice.delete({
			where: { id: officeId },
		});

		res.json({
			status: "success",
			message: "Authority office deleted successfully",
		});
	} catch (error) {
		next(error);
	}
};

export const assignCategoriesToOfficeController = async (
	req: AuthedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const officeId = Number(req.params.id);
		const { categoryIds } = req.body; // expecting array of category IDs

		if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
			throw new HttpError("categoryIds must be a non-empty array", 400);
		}

		// Check if office exists
		const office = await prisma.authorityOffice.findUnique({
			where: { id: officeId },
		});

		if (!office) {
			throw new HttpError("Authority office not found", 404);
		}

		// Update categories relation: set replaces all existing with given ones
		await prisma.authorityOffice.update({
			where: { id: officeId },
			data: {
				categories: {
					set: categoryIds.map((id: number) => ({ id })),
				},
			},
		});

		res.json({
			status: "success",
			message: "Categories assigned to authority office successfully",
		});
	} catch (error) {
		next(error);
	}
};

//// authority staff

export const addAuthorityStaffController = async (
	req: AuthedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const officeId = Number(req.params.officeId);
		const { userId, role, otherDetails } = req.body; // adjust fields as needed

		if (!userId || !role) {
			throw new HttpError("userId and role are required", 400);
		}

		// Verify authority office exists
		const office = await prisma.authorityOffice.findUnique({
			where: { id: officeId },
		});
		if (!office) {
			throw new HttpError("Authority office not found", 404);
		}

		// Optionally: check if user exists, or other validations

		// Create AuthorityStaff entry linking user and office
		const staff = await prisma.authorityStaff.create({
			data: {
				userId,
				role,
				authorityOfficeId: officeId,
				...otherDetails, // any other fields you want to store
			},
		});

		res.status(201).json({
			status: "success",
			message: "Authority staff added successfully",
			data: staff,
		});
	} catch (error) {
		next(error);
	}
};

export const getAuthorityStaffController = async (
	req: AuthedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const officeId = Number(req.params.officeId);

		// Check if authority office exists
		const office = await prisma.authorityOffice.findUnique({
			where: { id: officeId },
		});
		if (!office) {
			throw new HttpError("Authority office not found", 404);
		}

		// Fetch all staff linked to this office
		const staff = await prisma.authorityStaff.findMany({
			where: { authorityOfficeId: officeId },
			// optionally select fields you want to expose
			select: {
				userId: true,
				position: true,
				authorityOffice: {
					select: {
						officeName: true,
						id: true,
					},
				},
				// add any other relevant fields here
			},
		});

		res.json({
			status: "success",
			message: `Staff members for office ${officeId}`,
			data: staff,
		});
	} catch (error) {
		next(error);
	}
};

export const removeAuthorityStaffController = async (
	req: AuthedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.params.userId;

		// Check if staff exists
		const staff = await prisma.authorityStaff.findUnique({
			where: { userId: userId },
		});

		if (!staff) {
			throw new HttpError("Authority staff not found", 404);
		}

		// Delete the staff record
		await prisma.authorityStaff.delete({
			where: { userId: userId },
		});

		res.json({
			status: "success",
			message: `Authority staff with userId ${userId} removed successfully`,
		});
	} catch (error) {
		next(error);
	}
};
