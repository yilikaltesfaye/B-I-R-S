import { Router } from "express";
import { requireAuth, requireAdmin } from "../../middlewares/auth.middleware";
import * as Category from "./category.controller";

const router = Router();

router.post("/", requireAuth, requireAdmin, Category.createCategoryController);
router.get("/", requireAuth, Category.getAllCategoriesController);
router.get("/:id", requireAuth, Category.getCategoryByIdController);
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  Category.updateCategoryController,
);
router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  Category.deleteCategoryController,
);

export default router;
