import Redis from "ioredis";

export const redis = new Redis({
	port: process.env.REDIS_PORT
		? parseInt(process.env.REDIS_PORT, 10)
		: undefined,
	host: process.env.REDIS_HOST,
});
