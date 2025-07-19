import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import * as Comment from "./comment.controller";

const router = Router();

router.post("/", requireAuth, Comment.createCommentController);
router.get("/:reportId", requireAuth, Comment.getCommentsByReportController);
router.delete("/:id", requireAuth, Comment.deleteCommentController);

export default router;
