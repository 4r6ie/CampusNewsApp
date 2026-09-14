import { randomUUID } from 'crypto';
import { query, execute, RowDataPacket } from '../../database/client';
import { hashPassword, verifyPassword } from '../../utils/password';
import { signAccessToken, signRefreshToken } from '../../utils/token';
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

    return {
      user: {
        id: userId,
        email: input.email,
        role: 'student',
        fullName: input.fullName,
      },
      accessToken: signAccessToken(userId, 'student'),
      refreshToken: signRefreshToken(userId),
    };
  }

  static async refresh(userId: string): Promise<AuthResult> {
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
    return {
      user: { id: user.id, email: user.email, role: user.role, fullName: user.full_name },
      accessToken: signAccessToken(user.id, user.role),
      refreshToken: signRefreshToken(user.id),
    };
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

    return {
      user: { id: user.id, email: user.email, role: user.role, fullName: user.full_name },
      accessToken: signAccessToken(user.id, user.role),
      refreshToken: signRefreshToken(user.id),
    };
  }
}