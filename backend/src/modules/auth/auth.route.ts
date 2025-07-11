import { Router } from "express";
import { requestRateLimiter } from "../../utils/rateLimiter";
import { requireAdmin, requireAuth } from "./auth.middleware";
import { getAllUsers } from "./auth.depricated";
import {
	loginController,
	logoutController,
	regenerateAccessTokenController,
	regenerateRefreshTokenController,
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

router.post("/regenerate-refresh-token", regenerateRefreshTokenController); // refresh token regenerate route

router.get("/users", requireAdmin, getAllUsers); //  get all users for admin

export default router;
