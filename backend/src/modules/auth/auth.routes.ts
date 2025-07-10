import { Router } from "express";
import {
	signup,
	login,
	logout,
	forgotPassword, // tokken based forget password
	resetPassword, // token based reset password
	refreshAccessToken,
	refreshCookieToken,
	requestPasswordOtp, // opt based request password
	resetPasswordWithOtp, // opt based reset password
	getAllUsers,
} from "./auth.controller";
import { requireAdmin, requireAuth } from "./auth.middleware";
import { requestRateLimiter } from "../../utils/rateLimiter";

const router = Router();

// router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-access-token", refreshAccessToken);
router.post("/refresh-cookie-token", refreshCookieToken);
router.post("/request-password-otp", requestPasswordOtp);
router.post("/reset-password-otp", resetPasswordWithOtp);
router.post("/signup", requestRateLimiter("Registration"), signup);
// router.post("/login", requestRateLimiter("Login"), login);
// router.post("/forgot-password", requestRateLimiter("OTP"), forgotPassword);

router.get("/user", requireAuth, (req, res) => {
	res.json({
		status: "success",
		message: "protected route only for users",
		data: { user: (req as any).user },
	});
});
router.get("/users", requireAdmin, getAllUsers);

export default router;
