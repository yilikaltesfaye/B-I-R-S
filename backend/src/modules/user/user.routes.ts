import { Router, Response } from "express";

import {
  requireAuth,
  requireAdmin,
  AuthedRequest,
} from "../../middlewares/auth.middleware";
import * as User from "./user.controller";

const router = Router();

router.get("/", requireAuth, requireAdmin, User.getAllUsersController);
router.get("/me", requireAuth, (req: AuthedRequest, res: Response) => {
  const { userId, userRole } = req;
  res.json({ id: userId, role: userRole });
});
router.get("/:id", requireAuth, User.getUserByIdController);
router.put("/:id", requireAuth, User.updateUserController);
router.delete("/:id", requireAuth, requireAdmin, User.deleteUserController);

export default router;
