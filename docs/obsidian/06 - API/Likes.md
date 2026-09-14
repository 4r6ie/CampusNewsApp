# Likes

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | /posts/:postId/likes | Like a post |
| DELETE | /posts/:postId/likes | Unlike a post |
| GET | /posts/:postId/likes | Get like count |

## Behavior

Idempotent: `INSERT IGNORE` prevents duplicate likes. Unlike always returns success.

## Related

- `services/api/node_api/src/modules/likes/`
- `05 - DATABASE/Likes.md`