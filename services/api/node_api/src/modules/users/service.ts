import { query, execute, RowDataPacket } from '../../database/client';
import { AppError } from '../../middleware/error.middleware';
import type { UserProfile } from './types';

interface ProfileRow extends RowDataPacket, UserProfile {}

export class UserService {
  static async getProfile(userId: string): Promise<UserProfile | null> {
    const rows = await query<ProfileRow[]>(
      `SELECT u.id AS userId, p.full_name AS fullName, p.course, p.year_level AS yearLevel,
              p.avatar_url AS avatarUrl, p.bio
       FROM users u JOIN profiles p ON p.user_id = u.id
       WHERE u.id = ? AND u.status = 'active'`,
      [userId],
    );
    return rows[0] ?? null;
  }

  static async updateProfile(userId: string, data: Partial<UserProfile>) {
    const fields = Object.entries(data).filter(([, v]) => v !== undefined);
    if (fields.length === 0) return this.getProfile(userId);

    const updates = fields
      .map(([key]) => `${key} = ?`)
      .join(', ');
    const values = fields.map(([, v]) => v);

    const result = await execute(
      `UPDATE profiles SET ${updates}, updated_at = NOW() WHERE user_id = ?`,
      [...values, userId],
    );
    if (result.affectedRows === 0) {
      throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
    }
    return this.getProfile(userId);
  }
}