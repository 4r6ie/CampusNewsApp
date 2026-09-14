import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { redisClient } from '../config/redis';

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMITED', message: 'Too many requests, try again later' },
  },
});

export async function redisRateLimit(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const key = `rate:${req.ip}:${req.path}`;
    const value = await redisClient.get(key);
    const max = 100;

    if (value !== null && parseInt(value, 10) >= max) {
      return res.status(429).json({
        success: false,
        error: { code: 'RATE_LIMITED', message: 'Too many requests, try again later' },
      });
    }

    if (value === null) {
      await redisClient.set(key, '1', 'EX', 60);
    } else {
      await redisClient.incr(key);
    }
    next();
  } catch {
    next();
  }
}