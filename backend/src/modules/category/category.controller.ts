import { Request, Response, NextFunction } from "express";
import prisma from "../../clients/prismaClient";
import { HttpError } from "../../middlewares/HttpError";

export const createCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description, IconUrl } = req.body;

    if (!name || !description) {
      throw new HttpError("Missing required fields", 400);
    }

    // Optional: check for duplicate category name
    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) {
      throw new HttpError("Category with this name already exists", 409);
    }

    const category = await prisma.category.create({
      data: { name, description, IconUrl },
      select: {
        id: true,
        name: true,
        description: true,
        IconUrl: true,
        authorityOffices: {
          select: {
            id: true,
            officeName: true,
          },
        },
      },
    });

    res.status(201).json({
      title: "success",
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategoriesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        IconUrl: true,
        authorityOffices: {
          select: {
            id: true,
            officeName: true,
          },
        },
      },
    });

    res.json({
      title: "success",
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categoryId = Number(req.params.id);

    if (isNaN(categoryId)) {
      throw new HttpError("Invalid category ID", 400);
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        description: true,
        IconUrl: true,
        authorityOffices: {
          select: {
            id: true,
            officeName: true,
          },
        },
      },
    });

    if (!category) {
      throw new HttpError("Category not found", 404);
    }

    res.json({
      title: "success",
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categoryId = Number(req.params.id);

    if (isNaN(categoryId)) {
      throw new HttpError("Invalid category ID", 400);
    }

    const updateData = req.body;

    // Optional: Remove ID from update if present
    if ("id" in updateData) {
      delete updateData.id;
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: updateData,
      select: {
        id: true,
        name: true,
        description: true,
        IconUrl: true,
        authorityOffices: {
          select: {
            id: true,
            officeName: true,
          },
        },
      },
    });

    res.json({
      title: "success",
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      // Prisma "record not found" error
      return next(new HttpError("Category not found", 404));
    }
    next(error);
  }
};

export const deleteCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categoryId = Number(req.params.id);

    if (isNaN(categoryId)) {
      throw new HttpError("Invalid category ID", 400);
    }

    // Optional: check if the category exists before deletion
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      throw new HttpError("Category not found", 404);
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    res.json({
      title: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
