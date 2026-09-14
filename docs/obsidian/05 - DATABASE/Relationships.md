# Relationships

## Foreign Key Rules

| Parent | Child | On Delete |
|--------|-------|-----------|
| users | profiles | CASCADE |
| users | posts | CASCADE |
| users | comments | CASCADE |
| users | devices | CASCADE |
| users | notifications | CASCADE |
| users | reports | CASCADE |
| posts | comments | CASCADE |
| posts | post_media | CASCADE |

## Unique Constraints

- `users.email`
- `profiles.student_no` (when present)
- `devices.token`
- `likes(user_id, post_id)` — PK composite

## Indexes

- posts: published_at, category, status
- comments: post_id
- likes: post_id
- devices: user_id
- notifications: user_id, read_at
- announcements: status, priority
- reports: status
- audit_logs: actor_id, action

## See Also

- `05 - DATABASE/ERD.md`
- `database/schema/relationships.md`