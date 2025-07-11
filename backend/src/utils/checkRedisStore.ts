import { redis } from "../clients/redisClient";

export const checkRedis = async (phone: string, guestToken: string) => {
	const storedOtp = await redis.get(`verified:${phone}`);

	if (!storedOtp || storedOtp !== guestToken) {
		throw new Error("Invalid or expired OTP");
	}
};
