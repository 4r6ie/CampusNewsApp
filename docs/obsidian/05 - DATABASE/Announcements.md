# Announcements

| Column | Type | Notes |
|--------|------|-------|
| id | VARCHAR(36) | UUID PK |
| title | VARCHAR(255) | Required |
| body | TEXT | Required |
| priority | ENUM | low / medium / high / urgent |
| status | ENUM | draft / published / expired / deleted |
| published_at | DATETIME | When published |
| expires_at | DATETIME | Nullable — auto-expiry |

## Urgent Announcement Flow

Create with priority `urgent` → `NotificationService.broadcast()` triggers FCM push to all registered devices.

## Related

- `database/migrations/007_announcements.sql`
- `06 - API/Announcements.md`