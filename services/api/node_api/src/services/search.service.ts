// Cross-entity content search.
import { query, RowDataPacket } from '../database/client';
import { CacheKeys } from '../cache/cache.keys';
import { CacheTTL } from '../cache/cache.ttl';
import { searchCache } from '../cache/cache.service';

interface SearchRow extends RowDataPacket {
  id: string;
  title: string;
  body: string;
  category?: string;
  priority?: string;
  publishedAt: Date;
}

interface SearchCachePayload {
  posts: SearchRow[];
  announcements: SearchRow[];
}

export class SearchService {
  static async search(queryText: string, pagination: { offset: number; limit: number }): Promise<SearchCachePayload> {
    const key = CacheKeys.search(queryText);
    const cached = await searchCache.get<SearchCachePayload>(key);
    if (cached) return cached;

    const { offset, limit } = pagination;
    const like = `%${queryText}%`;

    const posts = await query<SearchRow[]>(
      `SELECT id, title, body, category, published_at AS publishedAt FROM posts
       WHERE status = 'published' AND (title LIKE ? OR body LIKE ?)
       ORDER BY published_at DESC LIMIT ? OFFSET ?`,
      [like, like, limit, offset],
    );

    const announcements = await query<SearchRow[]>(
      `SELECT id, title, body, priority, published_at AS publishedAt FROM announcements
       WHERE status = 'published' AND (title LIKE ? OR body LIKE ?)
       ORDER BY published_at DESC LIMIT ? OFFSET ?`,
      [like, like, limit, offset],
    );

    const result = { posts, announcements };
    await searchCache.set(key, result, CacheTTL.search);
    return result;
  }
}