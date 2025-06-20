import { Request, Response, NextFunction } from "express";
import RedisClient from "../utils/redis";

export async function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip;
  const now = Date.now();
  const rateLimitKey = `rate_limit:${ip}`;
  const limit = 100; //requests per hour
  const window = 60*60*1000; //1 hour in milliseconds

  const redis = await RedisClient.getInstance();

  const timestamps = await redis.lrange(rateLimitKey, 0, -1);
  const recent = timestamps.filter((timestamp) => Number(timestamp) > now - window);

  if(recent.length >= limit) {
    res.status(429).json({
      error: "Too many requests. Please try again later."
    });
    return;
  }

  await redis.rpush(rateLimitKey, now.toString());
  await redis.expire(rateLimitKey, Math.ceil(window / 1000));

  next();
}