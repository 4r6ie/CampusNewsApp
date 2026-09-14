# ERD

```
USERS 1───1 PROFILES
USERS 1───< POSTS            POSTS 1───< POST_MEDIA
USERS 1───< COMMENTS >─────── POSTS
USERS 1───< LIKES >────────── POSTS
USERS 1───< DEVICES
USERS 1───< NOTIFICATIONS
USERS 1───< REPORTS
USERS 1───< AUDIT_LOGS (actor)
POSTS ────< COMMENTS
NOTIFICATION_PREFERENCES → users
```

## Related

- `05 - DATABASE/Relationships.md`
- `database/schema/erd.md`