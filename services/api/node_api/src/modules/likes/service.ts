import { query, execute, RowDataPacket } from '../../database/client';
import { feedCache } from '../../cache/cache.service';
import { AppError } from '../../middleware/error.middleware';

interface LikeRow extends RowDataPacket {
  postId: string;
  userId: string;
  count: string | number;
}

export class LikeService {
  static async like(postId: string, userId: string) {
    const result = await execute(
      `INSERT IGNORE INTO likes (user_id, post_id, created_at) VALUES (?, ?, NOW())`,
      [userId, postId],
    );
    await feedCache.invalidatePattern('*:home:*');
    return result.affectedRows > 0;
  }

  static async unlike(postId: string, userId: string) {
    await execute(`DELETE FROM likes WHERE user_id = ? AND post_id = ?`, [userId, postId]);
    await feedCache.invalidatePattern('*:home:*');
  }

  static async count(postId: string): Promise<number> {
    const rows = await query<LikeRow[]>(
      `SELECT COUNT(*) AS count FROM likes WHERE post_id = ?`,
      [postId],
    );
    return Number(rows[0]?.count ?? 0);
  }
}