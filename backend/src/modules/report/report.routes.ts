import { Router } from "express";
import { getAllUsers, getUserData } from "../user/user.depricated";
import * as Report from "./report.controller";
import { requireAdmin, requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/report", requireAuth, Report.createReportController); // create report route

router.get("/reports", requireAdmin, Report.getAllReportsController); // get all reports

router.get("/report/:id", Report.getReportByIdController); // register route

router.put("/report/:id/status", Report.updateReportStatusController); // Update status to fixed

export default router;
