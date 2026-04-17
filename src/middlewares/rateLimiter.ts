import { Request, Response, NextFunction } from "express";
import { redisClient } from "../config/redis";

const WINDOW_SIZE = 60; // seconds
const MAX_REQUESTS = 10; // per minute

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ip = req.ip;

    const key = `rate:${ip}`;

    const requests = await redisClient.incr(key);

    // first request → set expiry
    if (requests === 1) {
      await redisClient.expire(key, WINDOW_SIZE);
    }

    if (requests > MAX_REQUESTS) {
      return res.status(429).json({
        message: "Too many requests, please try again later",
      });
    }

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    next(); // fail open (important)
  }
};
