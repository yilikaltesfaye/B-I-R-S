import { Router } from "express";
import { requireAuth, requireAdmin } from "../../middlewares/auth.middleware";
import * as Authority from "./authority.controller";

const router = Router();

router.post(
	"/",
	requireAuth,
	requireAdmin,
	Authority.createAuthorityOfficeController
);
router.get(
	"/",
	requireAuth,
	requireAdmin,
	Authority.getAllAuthorityOfficesController
);
router.get("/:id", requireAuth, Authority.getAuthorityOfficeByIdController);
router.put(
	"/:id",
	requireAuth,
	requireAdmin,
	Authority.updateAuthorityOfficeController
);
router.delete(
	"/:id",
	requireAuth,
	requireAdmin,
	Authority.deleteAuthorityOfficeController
);
router.post(
	"/:id/categories",
	requireAuth,
	requireAdmin,
	Authority.assignCategoriesToOfficeController
);

router.post(
	"/:officeId/staff",
	requireAuth,
	requireAdmin,
	Authority.addAuthorityStaffController
);
router.get(
	"/:officeId/staff",
	requireAuth,
	requireAdmin,
	Authority.getAuthorityStaffController
);
router.delete(
	"/staff/:userId",
	requireAuth,
	requireAdmin,
	Authority.removeAuthorityStaffController
);

export default router;
