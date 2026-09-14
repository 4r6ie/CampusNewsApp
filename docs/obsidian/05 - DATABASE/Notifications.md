# Notifications

| Column | Type | Notes |
|--------|------|-------|
| id | VARCHAR(36) | UUID PK |
| user_id | VARCHAR(36) | FK → users |
| type | VARCHAR(50) | e.g. urgent_announcement, comment_reply |
| title | VARCHAR(255) | Push/display title |
| body | TEXT | Display body |
| data_json | JSON | Additional payload |
| read_at | DATETIME | Nullable — null = unread |

## Related

- `database/migrations/009_notifications.sql`
- `06 - API/Notifications.md`