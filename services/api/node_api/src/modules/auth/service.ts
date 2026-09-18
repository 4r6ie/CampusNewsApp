import { randomUUID } from 'crypto';
import { query, execute, RowDataPacket } from '../../database/client';
import { hashPassword, verifyPassword } from '../../utils/password';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  generateTokenId,
} from '../../utils/token';
import { sessionCache } from '../../cache/cache.service';
import { CacheKeys } from '../../cache/cache.keys';
import { CacheTTL } from '../../cache/cache.ttl';
import { AppError } from '../../middleware/error.middleware';
import type { AuthResult } from './types';

interface UserRow extends RowDataPacket {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  status: string;
  full_name: string | null;
}

export class AuthService {
  static async register(input: {
    email: string;
    password: string;
    fullName: string;
    studentNo?: string;
  }): Promise<AuthResult> {
    const existing = await query<UserRow[]>(
      'SELECT id FROM users WHERE email = ?',
      [input.email],
    );
    if (existing.length > 0) {
      throw new AppError(409, 'EMAIL_EXISTS', 'Email is already registered');
    }

    const passwordHash = await hashPassword(input.password);
    const userId = randomUUID();

    await execute(
      `INSERT INTO users (id, email, password_hash, role, status, created_at, updated_at)
       VALUES (?, ?, ?, 'student', 'active', NOW(), NOW())`,
      [userId, input.email, passwordHash],
    );

    await execute(
      `INSERT INTO profiles (user_id, student_no, full_name, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [userId, input.studentNo ?? null, input.fullName],
    );

    return this.issueSession(userId, input.email, 'student', input.fullName);
  }

  static async login(email: string, password: string): Promise<AuthResult> {
    const rows = await query<UserRow[]>(
      `SELECT u.*, p.full_name
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.email = ?`,
      [email],
    );
    const user = rows[0];

    if (!user || user.status !== 'active') {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    return this.issueSession(user.id, user.email, user.role, user.full_name ?? '');
  }

  static async refresh(userId: string, jti: string): Promise<AuthResult> {
    const sessionKey = CacheKeys.session(jti);
    const sessionExists = await sessionCache.get<string>(sessionKey);
    if (!sessionExists) {
      throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid or expired');
    }
    // Rotate: the presented refresh token is consumed and can no longer be reused.
    await sessionCache.del(sessionKey);

    const rows = await query<UserRow[]>(
      `SELECT u.*, p.full_name
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.id = ? AND u.status = 'active'`,
      [userId],
    );
    const user = rows[0];
    if (!user) {
      throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid or expired');
    }
    return this.issueSession(user.id, user.email, user.role, user.full_name ?? '');
  }

  static async revokeSession(refreshToken: string) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      await sessionCache.del(CacheKeys.session(payload.jti));
    } catch {
      // Best-effort revocation; ignore malformed or already-expired tokens.
    }
  }

  private static async issueSession(
    userId: string,
    email: string,
    role: string,
    fullName: string,
  ): Promise<AuthResult> {
    const jti = generateTokenId();
    await sessionCache.set(CacheKeys.session(jti), userId, CacheTTL.session);
    return {
      user: { id: userId, email, role, fullName },
      accessToken: signAccessToken(userId, role),
      refreshToken: signRefreshToken(userId, jti),
    };
  }
}