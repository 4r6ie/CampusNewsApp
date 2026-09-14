import { randomUUID } from 'crypto';
import { query, execute, RowDataPacket } from '../../database/client';
import { AppError } from '../../middleware/error.middleware';

interface CommentRow extends RowDataPacket {
  id: string;
  postId: string;
  userId: string;
  fullName: string;
  body: string;
  createdAt: Date;
}

export class CommentService {
  static async list(postId: string, offset: number, limit: number) {
    const rows = await query<CommentRow[]>(
      `SELECT c.id, c.post_id AS postId, c.user_id AS userId, pr.full_name AS fullName,
              c.body, c.created_at AS createdAt
       FROM comments c
       JOIN profiles pr ON pr.user_id = c.user_id
       WHERE c.post_id = ? AND c.status = 'visible'
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      [postId, limit, offset],
    );
    return rows;
  }

  static async create(postId: string, userId: string, body: string): Promise<CommentRow> {
    const id = randomUUID();
    await execute(
      `INSERT INTO comments (id, post_id, user_id, body, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'visible', NOW(), NOW())`,
      [id, postId, userId, body],
    );
    const rows = await query<CommentRow[]>(
      `SELECT c.id, c.post_id AS postId, c.user_id AS userId, pr.full_name AS fullName,
              c.body, c.created_at AS createdAt
       FROM comments c JOIN profiles pr ON pr.user_id = c.user_id
       WHERE c.id = ?`,
      [id],
    );
    return rows[0];
  }

  static async update(commentId: string, userId: string, role: string, body: string) {
    const existing = await query<CommentRow[]>(
      'SELECT * FROM comments WHERE id = ?', [commentId]);
    if (existing.length === 0) throw new AppError(404, 'COMMENT_NOT_FOUND', 'Comment not found');
    if (existing[0].user_id !== userId && role !== 'admin') {
      throw new AppError(403, 'FORBIDDEN', 'Cannot edit another user\'s comment');
    }
    await execute('UPDATE comments SET body = ?, updated_at = NOW() WHERE id = ?', [body, commentId]);
    return this.list(existing[0].post_id, 0, 1);
  }

  static async remove(commentId: string, userId: string, role: string) {
    const existing = await query('SELECT * FROM comments WHERE id = ?', [commentId]);
    if (existing.length === 0) throw new AppError(404, 'COMMENT_NOT_FOUND', 'Comment not found');
    if ((existing[0] as { user_id: string }).user_id !== userId && role !== 'admin') {
      throw new AppError(403, 'FORBIDDEN', 'Cannot delete another user\'s comment');
    }
    await execute('UPDATE comments SET status = ? WHERE id = ?', ['deleted', commentId]);
  }
}