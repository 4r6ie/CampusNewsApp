// Database seeder. Run with: npm run db:seed
// Mirrors database/seeders/*.seed.ts intent but uses the raw SQL client.
import { execute, query } from './client';
import { hashPassword } from '../utils/password';

async function seed() {
  console.log('Seeding development data...');

  const existing = await query('SELECT id FROM users LIMIT 1');
  if (existing.length > 0) {
    console.log('Users already present; skipping seed.');
    return;
  }

  const adminPassword = await hashPassword('admin123');
  const adminId = '00000000-0000-0000-0000-000000000001';
  const studentId = '00000000-0000-0000-0000-000000000002';

  await execute(
    `INSERT INTO users (id, email, password_hash, role, status, created_at, updated_at)
     VALUES (?, 'admin@campus.edu', ?, 'admin', 'active', NOW(), NOW())`,
    [adminId, adminPassword],
  );
  await execute(
    `INSERT INTO profiles (user_id, full_name, created_at, updated_at)
     VALUES (?, 'System Admin', NOW(), NOW())`,
    [adminId],
  );

  await execute(
    `INSERT INTO users (id, email, password_hash, role, status, created_at, updated_at)
     VALUES (?::char(36), 'student@campus.edu', ?, 'student', 'active', NOW(), NOW())`,
    [studentId, adminPassword],
  );
  await execute(
    `INSERT INTO profiles (user_id, student_no, full_name, course, year_level, created_at, updated_at)
     VALUES (?, '2024-0001', 'Juan Dela Cruz', 'BS Computer Science', '3rd Year', NOW(), NOW())`,
    [studentId],
  );

  await execute(
    `INSERT INTO announcements (id, title, body, priority, status, published_at, created_at, updated_at)
     VALUES (?, 'Welcome to the New Semester', 'Welcome back students! Classes begin on Monday.', 'high', 'published', NOW(), NOW(), NOW())`,
    ['00000000-0000-0000-0000-000000000001'],
  );

  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});