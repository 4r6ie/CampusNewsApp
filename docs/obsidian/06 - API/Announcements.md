# Announcements

## Endpoints

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | /announcements | List (sorted by priority) | Yes |
| POST | /announcements | Create | admin/publisher |
| GET | /announcements/:id | Details | Yes |
| PATCH | /announcements/:id | Update | admin/publisher |
| DELETE | /announcements/:id | Delete (soft) | admin |

## Priority Order

urgent > high > medium > low

## Notification

Creating an announcement with `priority: urgent` triggers `NotificationService.broadcast()`.

## Related

- `services/api/node_api/src/modules/announcements/`
- `05 - DATABASE/Announcements.md`