import { query, execute, RowDataPacket } from '../../database/client';
import { getPagination, paginationMeta } from '../../utils/pagination';
import { feedCache, postCache } from '../../cache/cache.service';
import { CacheTTL } from '../../cache/cache.ttl';
import { AppError } from '../../middleware/error.middleware';

interface PostRow extends RowDataPacket {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  body: string;
  category: string;
  publishedAt: Date;
  likeCount: number;
  commentCount: number;
}

export class PostService {
  static async list(pageRaw: unknown, limitRaw: unknown) {
    const { page, limit, offset } = getPagination(pageRaw, limitRaw);
    const cached = await feedCache.get<{ posts: PostRow[]; total: number }>(`home:${page}`);
    if (cached) return { ...cached, meta: paginationMeta(page, limit, cached.total) };

    const [{ total }] = await query(
      `SELECT COUNT(*) AS total FROM posts WHERE status = 'published'`,
    );

    const rows = await query<PostRow[]>(
      `SELECT p.id, p.author_id AS authorId, pr.full_name AS authorName,
              p.title, p.body, p.category, p.published_at AS publishedAt,
              (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likeCount,
              (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id AND c.status = 'visible') AS commentCount
       FROM posts p
       JOIN users u ON u.id = p.author_id
       JOIN profiles pr ON pr.user_id = u.id
       WHERE p.status = 'published'
       ORDER BY p.published_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    const result = { posts: rows, total: Number(total) };
    await feedCache.set(`home:${page}`, result, CacheTTL.feedHome);
    return { ...result, meta: paginationMeta(page, limit, Number(total)) };
  }

  static async get(postId: string): Promise<PostRow> {
    const cached = await postCache.get<PostRow>(postId);
    if (cached) return cached;

    const rows = await query<PostRow[]>(
      `SELECT p.id, p.author_id AS authorId, pr.full_name AS authorName,
              p.title, p.body, p.category, p.published_at AS publishedAt,
              (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likeCount,
              (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id AND c.status = 'visible') AS commentCount
       FROM posts p
       JOIN users u ON u.id = p.author_id
       JOIN profiles pr ON pr.user_id = u.id
       WHERE p.id = ? AND p.status != 'deleted'`,
      [postId],
    );
    const post = rows[0];
    if (!post) throw new AppError(404, 'POST_NOT_FOUND', 'Post not found');
    await postCache.set(postId, post, CacheTTL.post);
    return post;
  }

  static async create(authorId: string, input: { title: string; body: string; category: string }) {
    const result = await execute(
      `INSERT INTO posts (id, author_id, title, body, category, status, published_at, created_at, updated_at)
       VALUES (UUID(), ?, ?, ?, ?, 'published', NOW(), NOW(), NOW())`,
      [authorId, input.title, input.body, input.category],
    );
    await feedCache.invalidatePattern('home:*');
    return this.get(result.insertId.toString());
  }

  static async update(postId: string, input: Partial<{ title: string; body: string; category: string }>) {
    const current = await this.get(postId);
    await execute(
      `UPDATE posts SET title = ?, body = ?, category = ?, updated_at = NOW()
       WHERE id = ?`,
      [input.title ?? current.title, input.body ?? current.body, input.category ?? current.category, postId],
    );
    await feedCache.invalidatePattern('home:*');
    await postCache.del(postId);
    return this.get(postId);
  }

  static async remove(postId: string) {
    const result = await execute(
      `UPDATE posts SET status = 'deleted', updated_at = NOW() WHERE id = ?`,
      [postId],
    );
    if (result.affectedRows === 0) throw new AppError(404, 'POST_NOT_FOUND', 'Post not found');
    await feedCache.invalidatePattern('home:*');
    await postCache.del(postId);
  }
}