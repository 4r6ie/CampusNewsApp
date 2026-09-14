// Users seeder. Usage: npm --prefix services/api/node_api run db:seed
import { execute } from '../services/api/node_api/src/database/client';
import { hashPassword } from '../services/api/node_api/src/utils/password';

export async function seedUsers() {
  const passwordHash = await hashPassword('admin123');

  const adminId = '00000000-0000-0000-0000-000000000001';
  const studentId = '00000000-0000-0000-0000-000000000002';

  await execute(
    `INSERT IGNORE INTO users (id, email, password_hash, role, status, created_at, updated_at)
     VALUES (?, 'admin@campus.edu', ?, 'admin', 'active', NOW(), NOW())`,
    [adminId, passwordHash],
  );
  await execute(
    `INSERT IGNORE INTO profiles (user_id, full_name, created_at, updated_at)
     VALUES (?, 'System Admin', NOW(), NOW())`,
    [adminId],
  );

  await execute(
    `INSERT IGNORE INTO users (id, email, password_hash, role, status, created_at, updated_at)
     VALUES (?, 'student@campus.edu', ?, 'student', 'active', NOW(), NOW())`,
    [studentId, passwordHash],
  );
  await execute(
    `INSERT IGNORE INTO profiles (user_id, student_no, full_name, course, year_level, created_at, updated_at)
     VALUES (?, '2024-0001', 'Juan Dela Cruz', 'BS Computer Science', '3rd Year', NOW(), NOW())`,
    [studentId],
  );
}