import { Router } from "express";
// import { getAllUsers, getUserData } from "../user/user.depricated";
import * as Report from "./report.controller";
import {
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
  Report.getAuthorityReportsController,
); // get all reports
router.get(
  "/category/:categoryId",
  requireAuth,
  Report.getReportsByCategoryController,
); // get all reports

router.get("/filter", requireAuth, Report.getReportsByAddressController); // too complicated for me pause on this for now

router.get("/:id", requireAuth, Report.getReportByIdController); // get report by its id route

router.get("/user/:userId", requireAuth, Report.getReportByUserIdController); // get reports by userid route

router.put("/:id/status", requireAuth, Report.updateReportStatusController); // Update status to fixed

export default router;
