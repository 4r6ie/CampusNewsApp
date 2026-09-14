# Posts

| Column | Type | Notes |
|--------|------|-------|
| id | VARCHAR(36) | UUID PK |
| author_id | VARCHAR(36) | FK → users |
| title | VARCHAR(255) | Required |
| body | TEXT | Required |
| category | ENUM | news / event / academic / general |
| status | ENUM | draft / published / archived / deleted |
| published_at | DATETIME | Nullable |

## Indexes

- `idx_posts_published` (published_at)
- `idx_posts_category` (category)
- `idx_posts_status` (status)

## Related

- `database/migrations/003_posts.sql`
- `06 - API/Posts.md`