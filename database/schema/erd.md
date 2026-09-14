# ERD — Campus News & Announcement System

## Entities

```
USERS
├── 1—1 PROFILES
├── 1—many POSTS
├── 1—many COMMENTS
├── 1—many DEVICES
├── 1—many NOTIFICATIONS
├── 1—many REPORTS (as reporter)
└── many—many POSTS through LIKES

POSTS
├── 1—many COMMENTS
└── 1—many POST_MEDIA

ANNOUNCEMENTS (standalone entity)
NOTIFICATION_PREFERENCES → users (1—1)
AUDIT_LOGS (actor_id references users)
```

## Visual Diagram

```
USERS 1───1 PROFILES
USERS 1───< POSTS            POSTS 1───< POST_MEDIA
USERS 1───< COMMENTS >─────── POSTS
USERS 1───< LIKES >────────── POSTS     (unique pair user_id + post_id)
USERS 1───< DEVICES
USERS 1───< NOTIFICATIONS
USERS 1───< NOTIFICATION_PREFERENCES
USERS 1───< REPORTS
USERS 1───< AUDIT_LOGS (actor)
```

## Cardinality Summary

| Relation | Type | Join Table |
|----------|------|-----------|
| users → profiles | 1:1 | profiles.user_id |
| users → posts | 1:N | posts.author_id |
| users → comments | 1:N | comments.user_id |
| users ↔ posts | M:N | likes (user_id, post_id) |
| posts → comments | 1:N | comments.post_id |
| posts → post_media | 1:N | post_media.post_id |
| users → devices | 1:N | devices.user_id |
| users → notifications | 1:N | notifications.user_id |
| users → reports | 1:N | reports.reporter_id |
| users → audit_logs | 1:N | audit_logs.actor_id |