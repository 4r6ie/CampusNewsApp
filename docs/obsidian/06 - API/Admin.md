# Admin

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | /admin/users | List all users |
| PATCH | /admin/users/:id/status | Suspend/activate/delete user |
| (Planned) | /admin/posts | Post moderation |
| (Planned) | /admin/announcements | Announcement management |
| (Planned) | /admin/reports | Report review |

## Access Control

All `/admin/*` routes require `admin` role via `authorize('admin')` middleware.

All admin actions are logged via `AuditService` to the `audit_logs` table.

## Related

- `services/api/node_api/src/modules/admin/`
- `03 - UI UX/Admin Dashboard.md`