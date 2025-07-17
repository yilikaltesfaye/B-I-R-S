import { Router } from "express";
import { requestRateLimiter } from "../../middlewares/rateLimiter";
import { requireAdmin, requireAuth } from "./auth.middleware";
import { getAllUsers, getUserData } from "../user/user.depricated";
import * as Auth from "./auth.controller";

const router = Router();

router.post(
	"/requestotp",
	requestRateLimiter("OTP"),
	Auth.requestOtpController
); // request password otp route for both account creation and password recovery

router.post("/verifyotp", requestRateLimiter("OTP"), Auth.verifyOtpController); // request password otp route for both account creation and password recovery

router.post(
	"/register",
	requestRateLimiter("Registration"),
	Auth.registerController
); // register route

router.post("/login", requestRateLimiter("Login"), Auth.loginController); // login route

router.post("/logout", requireAuth, Auth.logoutController); // logout route

router.post("/resetpassword", Auth.resetPasswordController); // reset password route

router.post("/refresh-access-token", Auth.regenerateAccessTokenController); // access token regenerate route

router.get("/users", requireAuth, requireAdmin, getAllUsers); //  get all users for admin
router.get("/user", requireAuth, getUserData); //  get user

export default router;
