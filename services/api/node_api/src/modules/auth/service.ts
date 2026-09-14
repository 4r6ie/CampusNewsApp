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
}

export class AuthService {
  static async register(input: {
    email: string;
    password: string;
    fullName: string;
    role: string;
  }): Promise<AuthResult> {
    const existing = await query<UserRow[]>(
      'SELECT id FROM users WHERE email = ?',
      [input.email],
    );
    if (existing.length > 0) {
      throw new AppError(409, 'EMAIL_EXISTS', 'Email is already registered');
    }

    const passwordHash = await hashPassword(input.password);

    const result = await execute(
      `INSERT INTO users (id, email, password_hash, role, status, created_at, updated_at)
       VALUES (UUID(), ?, ?, ?, 'active', NOW(), NOW())`,
      [input.email, passwordHash, input.role],
    );

    const userId = result.insertId.toString();

    await execute(
      `INSERT INTO profiles (user_id, full_name, created_at, updated_at)
       VALUES (?, ?, NOW(), NOW())`,
      [userId, input.fullName],
    );

    return {
      user: { id: userId, email: input.email, role: input.role },
      accessToken: signAccessToken(userId, input.role),
      refreshToken: signRefreshToken(userId),
    };
  }

  static async login(email: string, password: string): Promise<AuthResult> {
    const rows = await query<UserRow[]>(
      'SELECT * FROM users WHERE email = ?',
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
      user: { id: user.id, email: user.email, role: user.role },
      accessToken: signAccessToken(user.id, user.role),
      refreshToken: signRefreshToken(user.id),
    };
  }
}