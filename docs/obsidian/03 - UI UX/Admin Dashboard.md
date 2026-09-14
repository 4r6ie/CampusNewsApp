# Admin Dashboard

## Screen Purpose
Content and user management for administrators and publishers.

## Sections
- Dashboard overview (stats cards)
- User management (list, suspend/activate)
- Post management (create/edit/archive/delete)
- Announcement management (create/edit/publish/expire)
- Comment moderation (review, hide, delete)
- Reports (view, resolve/dismiss)
- Audit log viewer

## Access Control
Requires `admin` or `publisher` role. All actions logged via `AuditService`.

## Related

- `apps/admin/web_admin/`
- `06 - API/Admin.md`