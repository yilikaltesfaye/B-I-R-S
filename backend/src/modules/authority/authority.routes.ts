import { Router } from "express";
import { requireAuth, requireAdmin } from "../../middlewares/auth.middleware";
import * as Authority from "./authority.controller";

const router = Router();
// Authority Office routes
router.post(
	"/",
	requireAuth,
	requireAdmin,
	Authority.createAuthorityOfficeController
); // create an authority
router.get(
	"/",
	requireAuth,
	requireAdmin,
	Authority.getAllAuthorityOfficesController
); // get all authorities in db
router.get("/:id", requireAuth, Authority.getAuthorityOfficeByIdController); // get authority by id
router.put(
	"/:id",
	requireAuth,
	requireAdmin,
	Authority.updateAuthorityOfficeController // update authority
);
router.delete(
	"/:id",
	requireAuth,
	requireAdmin,
	Authority.deleteAuthorityOfficeController // delete authority
);
router.post(
	"/:id/categories",
	requireAuth,
	requireAdmin,
	Authority.assignCategoriesToOfficeController // assign catagories with authority office
);

// Authority Staff Routes

router.post(
	"/:officeId/staff",
	requireAuth,
	requireAdmin,
	Authority.addAuthorityStaffController // assign users with authority office in authority staff model
);
router.get(
	"/:officeId/staff",
	requireAuth,
	requireAdmin,
	Authority.getAuthorityStaffController // get all authority staff in an office
);
router.delete(
	"/staff/:userId",
	requireAuth,
	requireAdmin,
	Authority.removeAuthorityStaffController // remove authority staff in an office
);

export default router;
