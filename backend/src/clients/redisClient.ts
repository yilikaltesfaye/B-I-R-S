import Redis from "ioredis";

export const redis = new Redis({
	port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 7000,
	host: process.env.REDIS_HOST ?? "127.0.0.1",
});
