# Comments

| Column | Type | Notes |
|--------|------|-------|
| id | VARCHAR(36) | UUID PK |
| post_id | VARCHAR(36) | FK → posts |
| user_id | VARCHAR(36) | FK → users |
| body | TEXT | Required |
| status | ENUM | visible / hidden / deleted |

## Rules

- Users can edit/delete only their own comments
- Admins can moderate any comment
- Soft deletion via status field

## Related

- `database/migrations/005_comments.sql`
- `06 - API/Comments.md`