import { Router } from "express";
import { requestRateLimiter } from "../../middlewares/rateLimiter";
import { requireAdmin, requireAuth } from "./auth.middleware";
import { getAllUsers, getUserData } from "../user/user.depricated";
import {
	loginController,
	logoutController,
	regenerateAccessTokenController,
	registerController,
	requestOtpController,
	resetPasswordController,
	verifyOtpController,
} from "./auth.controller";

const router = Router();

router.post("/requestotp", requestRateLimiter("OTP"), requestOtpController); // request password otp route for both account creation and password recovery

router.post("/verifyotp", requestRateLimiter("OTP"), verifyOtpController); // request password otp route for both account creation and password recovery

router.post(
	"/register",
	requestRateLimiter("Registration"),
	registerController
); // register route

router.post("/login", requestRateLimiter("Login"), loginController); // login route

router.post("/logout", requireAuth, logoutController); // logout route

router.post("/resetpassword", resetPasswordController); // reset password route

router.post("/refresh-access-token", regenerateAccessTokenController); // access token regenerate route

router.get("/users", requireAuth, requireAdmin, getAllUsers); //  get all users for admin
router.get("/user", requireAuth, getUserData); //  get user

export default router;
