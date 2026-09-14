# Redis Architecture

## Usage Patterns

| Key Pattern | Purpose | TTL |
|------------|---------|-----|
| `feed:home:{userId}:{page}` | Cached paginated feed | 60s |
| `post:{postId}` | Individual post cache | 120s |
| `search:{query}` | Search result cache | 300s |
| `rate:{ip}:{endpoint}` | Rate limiting | 60s |
| `notification:{eventId}` | Push notification deduplication | 3600s |
| `session:{id}` | Refresh token/session metadata | Controlled |

## Invalidation Rules

- `feed:home` keys invalidated on every post publish/update/delete
- `post:{id}` invalidated on update or delete
- `search` invalidated periodically (long TTL handles this)
- All keys have hard TTL; Redis can be flushed without data loss

## Safety Rule

> Redis must not become the only source of truth for permanent records. If Redis is cleared, the system should recover entirely from MySQL.

## Related

- `services/api/node_api/src/cache/`
- `04 - ARCHITECTURE/System Architecture.md`