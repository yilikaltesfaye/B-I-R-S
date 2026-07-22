import { redis } from "../clients/redisClient";
import { HttpError } from "../middlewares/HttpError";

export const checkRedis = async (phone: string, guestToken: string) => {
  const storedOtp = await redis.get(`verified:${phone}`);

  if (!storedOtp || storedOtp !== guestToken) {
    throw new HttpError("Invalid or expired OTP", 401);
  }
};
