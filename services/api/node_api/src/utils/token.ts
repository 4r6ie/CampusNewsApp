import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '7d';

export function signAccessToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, env.jwtAccessSecret, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ userId }, env.jwtRefreshSecret, {
    expiresIn: REFRESH_TOKEN_TTL,
  });
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.jwtRefreshSecret) as { userId: string };
}