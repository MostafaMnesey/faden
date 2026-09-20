import { createClient } from "redis";
import { Queue } from "bullmq";
import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

console.log("REDIS_URL", REDIS_URL);

export const redis = createClient({
  url: REDIS_URL,
});

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("ready", () => console.log("🚀 Redis ready"));
redis.on("reconnecting", () => console.log("🔄 Redis reconnecting..."));
redis.on("error", (err: Error) => console.log("❌ Redis Client Error:", err.message));

export const redisConnection = async (): Promise<void> => {
  if (!redis.isOpen) {
    await redis.connect();
  }
};

export const connection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const notificationQueue = new Queue("notifications", { connection });
export const mailerQueue = new Queue("mailer", { connection });
