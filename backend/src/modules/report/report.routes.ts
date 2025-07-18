import { Router } from "express";
// import { getAllUsers, getUserData } from "../user/user.depricated";
import * as Report from "./report.controller";
import { requireAdmin, requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, Report.createReportController); // create report route

router.get("/all", requireAdmin, Report.getAllReportsController); // get all reports

router.get("/:id", Report.getReportByIdController); // register route

router.put("/:id/status", Report.updateReportStatusController); // Update status to fixed

export default router;
