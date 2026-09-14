import { query, execute, RowDataPacket } from '../../database/client';
import { getPagination } from '../../utils/pagination';
import { AppError } from '../../middleware/error.middleware';
import { NotificationService } from '../../services/notification.service';
import type { Announcement } from './types';

interface AnnouncementRow extends RowDataPacket, Announcement {}

export class AnnouncementService {
  static async list(pageRaw: unknown, limitRaw: unknown) {
    const { limit, offset } = getPagination(pageRaw, limitRaw);
    const rows = await query<AnnouncementRow[]>(
      `SELECT id, title, body, priority, status, published_at AS publishedAt, expires_at AS expiresAt
       FROM announcements
       WHERE status = 'published' AND (expires_at IS NULL OR expires_at > NOW())
       ORDER BY
         FIELD(priority, 'urgent', 'high', 'medium', 'low'),
         published_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );
    return rows;
  }

  static async get(id: string): Promise<Announcement> {
    const rows = await query<AnnouncementRow[]>(
      `SELECT id, title, body, priority, status, published_at AS publishedAt, expires_at AS expiresAt
       FROM announcements WHERE id = ?`,
      [id],
    );
    const ann = rows[0];
    if (!ann) throw new AppError(404, 'ANNOUNCEMENT_NOT_FOUND', 'Announcement not found');
    return ann;
  }

  static async create(input: { title: string; body: string; priority: string; expiresAt?: string }) {
    const result = await execute(
      `INSERT INTO announcements (id, title, body, priority, status, published_at, expires_at, created_at, updated_at)
       VALUES (UUID(), ?, ?, ?, 'published', NOW(), ?, NOW(), NOW())`,
      [input.title, input.body, input.priority, input.expiresAt ?? null],
    );
    const ann = await this.get(result.insertId.toString());

    if (ann.priority === 'urgent') {
      await NotificationService.broadcast('Urgent Announcement', ann.title);
    }
    return ann;
  }

  static async update(id: string, input: Partial<{ title: string; body: string; priority: string; expiresAt: string }>) {
    const current = await this.get(id);
    await execute(
      `UPDATE announcements SET title = ?, body = ?, priority = ?, expires_at = ?, updated_at = NOW()
       WHERE id = ?`,
      [input.title ?? current.title, input.body ?? current.body, input.priority ?? current.priority, input.expiresAt ?? current.expiresAt, id],
    );
    return this.get(id);
  }

  static async remove(id: string) {
    const result = await execute(
      `UPDATE announcements SET status = 'deleted', updated_at = NOW() WHERE id = ?`,
      [id],
    );
    if (result.affectedRows === 0) throw new AppError(404, 'ANNOUNCEMENT_NOT_FOUND', 'Announcement not found');
  }
}