import { execute, query, RowDataPacket } from '../../database/client';
import { getPagination } from '../../utils/pagination';
import { AppError } from '../../middleware/error.middleware';
import { AuditService } from '../../services/audit.service';
import type { AdminUserSummary } from './types';

interface AdminUserRow extends RowDataPacket, AdminUserSummary {}

export class AdminService {
  static async listUsers(pageRaw: unknown, limitRaw: unknown) {
    const { limit, offset } = getPagination(pageRaw, limitRaw);
    const rows = await query<AdminUserRow[]>(
      `SELECT id, email, role, status, created_at AS createdAt
       FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset],
    );
    return rows;
  }

  static async setUserStatus(userId: string, status: string, actorId?: string) {
    const result = await execute(
      'UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, userId],
    );
    if (result.affectedRows === 0) throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
    await AuditService.log('user.status.updated', { actorId, targetType: 'user', targetId: userId, metadata: { status } });
  }
}