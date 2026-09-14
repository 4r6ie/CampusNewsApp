# Likes

| Column | Type | Notes |
|--------|------|-------|
| user_id | VARCHAR(36) | PK part, FK → users |
| post_id | VARCHAR(36) | PK part, FK → posts |
| created_at | DATETIME | UTC |

## Constraints

- `PRIMARY KEY (user_id, post_id)` — one like per user per post
- `INSERT IGNORE` for idempotent like behavior

## Related

- `database/migrations/006_likes.sql`
- `06 - API/Likes.md`