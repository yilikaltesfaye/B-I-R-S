import { Router } from "express";
import { requestRateLimiter } from "../../middlewares/rateLimiter";
import { requireAuth } from "../../middlewares/auth.middleware";
import * as Auth from "./auth.controller";

const router = Router();

router.post(
	"/requestotp",
	// requestRateLimiter("OTP"),
	Auth.requestOtpController
); // request password otp route for both account creation and password recovery

router.post("/verifyotp", requestRateLimiter("OTP"), Auth.verifyOtpController); // request password otp route for both account creation and password recovery

router.post(
	"/register",
	requestRateLimiter("Registration"),
	Auth.registerController
); // register route

router.post("/login", Auth.loginController); // login route

router.post("/logout", requireAuth, Auth.logoutController); // logout route

router.post("/resetpassword", Auth.resetPasswordController); // reset password route

router.post("/refresh-access-token", Auth.regenerateAccessTokenController); // access token regenerate route

export default router;
