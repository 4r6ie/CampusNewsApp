// Announcements seeder.
import { execute } from '../services/api/node_api/src/database/client';

export async function seedAnnouncements() {
  await execute(
    `INSERT IGNORE INTO announcements (id, title, body, priority, status, published_at, expires_at, created_at, updated_at)
     VALUES
      ('00000000-0000-0000-0000-000000000021', 'Welcome to the New Semester', 'Welcome back students! Classes begin on Monday.', 'high', 'published', NOW(), NULL, NOW(), NOW()),
      ('00000000-0000-0000-0000-000000000022', 'Midterm Schedule', 'The official midterm exam schedule is now available.', 'urgent', 'published', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY), NOW(), NOW())`,
  );
}