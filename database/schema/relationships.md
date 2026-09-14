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
- `likes(user_id, post_id)` — primary key composite

## Indexes

- `posts.published_at`, `posts.category`, `posts.status`
- `comments.post_id`
- `likes.post_id`
- `devices.user_id`
- `notifications.user_id`, `notifications.read_at`
- `announcements.status`, `announcements.priority`
- `reports.status`
- `audit_logs.actor_id`, `audit_logs.action`

## Conventions

- All tables use `VARCHAR(36)` string UUIDs for primary keys.
- All timestamps stored in UTC (`DATETIME`); clients convert to local display time.
- Soft deletion via `status` columns: `users.status`, `posts.status`, `comments.status`, `announcements.status`.
- Cascading deletes remove dependent children; moderation actions use soft status changes instead to preserve history.