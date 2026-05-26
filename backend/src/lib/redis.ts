import Redis, { RedisOptions } from "ioredis";

function resolveRedisUrl(): string {
  let url = process.env.REDIS_URL ?? "redis://localhost:6379";
  // Upstash requires TLS — upgrade redis:// to rediss:// automatically
  if (url.includes("upstash.io") && url.startsWith("redis://")) {
    url = url.replace("redis://", "rediss://");
    console.warn(
      "[redis] Upstash detected: using rediss:// (TLS). Update REDIS_URL in .env to rediss:// for clarity."
    );
  }
  return url;
}

function buildRedisOptions(): RedisOptions {
  const url = resolveRedisUrl();
  const isTls =
    url.startsWith("rediss://") || url.includes("upstash.io");

  return {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: (times) => {
      if (times > 10) return null;
      return Math.min(times * 200, 3000);
    },
    reconnectOnError: (err) => {
      const msg = err.message;
      return msg.includes("READONLY") || msg.includes("ECONNRESET");
    },
    ...(isTls ? { tls: {} } : {}),
  };
}

const redisUrl = resolveRedisUrl();

export const redis = new Redis(redisUrl, buildRedisOptions());

let lastErrorLog = 0;
redis.on("connect", () => console.log("Redis connected"));
redis.on("ready", () => console.log("Redis ready"));
redis.on("error", (err) => {
  const now = Date.now();
  if (now - lastErrorLog > 5000) {
    console.error("Redis error:", err.message);
    lastErrorLog = now;
  }
});
