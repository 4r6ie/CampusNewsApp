import { query, execute, RowDataPacket } from '../../database/client';
import { getPagination } from '../../utils/pagination';
import { AppError } from '../../middleware/error.middleware';
import type { AppNotification } from './types';

interface NotificationRow extends RowDataPacket, AppNotification {}

export class NotificationModule {
  static async list(userId: string, pageRaw: unknown, limitRaw: unknown) {
    const { limit, offset } = getPagination(pageRaw, limitRaw);
    const rows = await query<NotificationRow[]>(
      `SELECT id, type, title, body, read_at AS readAt, created_at AS createdAt
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset],
    );
    return rows;
  }

  static async markRead(userId: string, id: string, read: boolean) {
    const result = await execute(
      `UPDATE notifications SET read_at = ? WHERE id = ? AND user_id = ?`,
      [read ? new Date() : null, id, userId],
    );
    if (result.affectedRows === 0) throw new AppError(404, 'NOTIFICATION_NOT_FOUND', 'Notification not found');
  }
}