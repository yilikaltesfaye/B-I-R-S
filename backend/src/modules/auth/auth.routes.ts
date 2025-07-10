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
// router.post("/login", login);
// router.post("/request-password-otp", requestPasswordOtp);

router.post("/signup", requestRateLimiter("Registration"), signup); // signup route
router.post("/login", requestRateLimiter("Login"), login); // login route
router.post("/logout", logout); // logout route
router.post("/forgot-password", forgotPassword); // forgot password route
router.post("/reset-password", resetPassword); // reset password route
router.post("/refresh-access-token", refreshAccessToken); // access token refresh route
router.post("/refresh-cookie-token", refreshCookieToken); // refresh token regenrate route
router.post(
	"/request-password-otp",
	requestRateLimiter("OTP"),
	requestPasswordOtp
); // request password otp route
router.post("/reset-password-otp", resetPasswordWithOtp); // reset password with otp route

router.get("/user", requireAuth, (req, res) => {
	res.json({
		status: "success",
		message: "protected route only for users",
		data: { user: (req as any).user },
	});
});

router.get("/users", requireAdmin, getAllUsers);

export default router;
