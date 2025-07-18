import { Router } from "express";
import { requireAuth, requireAdmin } from "../../middlewares/auth.middleware";
import * as User from "./user.controller";

const router = Router();

router.get("/", requireAuth, requireAdmin, User.getAllUsersController);
router.get("/:id", requireAuth, User.getUserByIdController);
router.put("/:id", requireAuth, User.updateUserController);
router.delete("/:id", requireAuth, requireAdmin, User.deleteUserController);

export default router;
