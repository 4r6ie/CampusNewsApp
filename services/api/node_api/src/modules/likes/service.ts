import { query, execute, RowDataPacket } from '../../database/client';
import { feedCache, postCache } from '../../cache/cache.service';

interface LikeRow extends RowDataPacket {
  postId: string;
  userId: string;
  count: string | number;
}

export class LikeService {
  static invalidatePostCaches(postId: string) {
    // Feed rows and per-user post detail caches both embed the like count.
    return Promise.all([
      feedCache.invalidatePattern('*:home:*'),
      postCache.invalidatePattern(`*:${postId}`),
    ]);
  }

  static async like(postId: string, userId: string) {
    const result = await execute(
      `INSERT IGNORE INTO likes (user_id, post_id, created_at) VALUES (?, ?, NOW())`,
      [userId, postId],
    );
    await this.invalidatePostCaches(postId);
    return result.affectedRows > 0;
  }

  static async unlike(postId: string, userId: string) {
    await execute(`DELETE FROM likes WHERE user_id = ? AND post_id = ?`, [userId, postId]);
    await this.invalidatePostCaches(postId);
  }

  static async count(postId: string): Promise<number> {
    const rows = await query<LikeRow[]>(
      `SELECT COUNT(*) AS count FROM likes WHERE post_id = ?`,
      [postId],
    );
    return Number(rows[0]?.count ?? 0);
  }
}