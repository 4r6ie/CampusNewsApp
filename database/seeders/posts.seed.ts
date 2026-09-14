// Posts seeder.
import { execute } from '../services/api/node_api/src/database/client';

export async function seedPosts() {
  const authorId = '00000000-0000-0000-0000-000000000002';

  await execute(
    `INSERT IGNORE INTO posts (id, author_id, title, body, category, status, published_at, created_at, updated_at)
     VALUES
      ('00000000-0000-0000-0000-000000000011', ?, 'Welcome Message', 'Welcome to the campus news feed.', 'general', 'published', NOW(), NOW(), NOW()),
      ('00000000-0000-0000-0000-000000000012', ?, 'Intramurals 2026', 'Annual intramural games are back. Sign up now.', 'event', 'published', NOW(), NOW(), NOW())`,
    [authorId, authorId],
  );
}