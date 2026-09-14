# Users

| Column | Type | Notes |
|--------|------|-------|
| id | VARCHAR(36) | UUID primary key |
| email | VARCHAR(255) | Unique |
| password_hash | VARCHAR(255) | bcrypt |
| role | ENUM | student / faculty / staff / admin / publisher |
| status | ENUM | active / suspended / deleted |
| created_at | DATETIME | UTC |
| updated_at | DATETIME | UTC |

## Related

- `database/migrations/001_users.sql`
- `06 - API/Authentication.md`