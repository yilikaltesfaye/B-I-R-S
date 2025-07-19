import { Router } from "express";
// import { getAllUsers, getUserData } from "../user/user.depricated";
import * as Report from "./report.controller";
import {
	AuthedRequest,
	requireAdmin,
	requireAuth,
	requireAuthority,
} from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, Report.createReportController); // create report route

router.get("/", requireAuth, requireAdmin, Report.getAllReportsController); // get all reports

router.get(
	"/authority",
	requireAuth,
	requireAuthority,
	Report.getAuthorityReportsController
); // get all reports

router.get("/filter", requireAuth, Report.getReportsByAddressController);

router.get("/:id", requireAuth, Report.getReportByIdController); // register route

router.put("/:id/status", requireAuth, (req, res, next) => {
	const typedReq = req as AuthedRequest;

	if (typedReq.userRole === "AUTHORITY" || typedReq.userRole === "ADMIN") {
		return Report.updateReportStatusController(typedReq, res, next);
	}
	res.status(403).json({ status: "fail", message: "Access denied" });
}); // Update status to fixed

export default router;
