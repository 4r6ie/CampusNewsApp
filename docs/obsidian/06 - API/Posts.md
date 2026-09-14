# Posts

## Endpoints

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | /posts | List feed (paginated) | Yes |
| POST | /posts | Create post | admin/publisher |
| GET | /posts/:id | Post details | Yes |
| PATCH | /posts/:id | Update post | owner/admin |
| DELETE | /posts/:id | Delete post (soft) | owner/admin |

## Query Params

`page` (default 1), `limit` (default 20), `category`

## Cache

Feed cached in Redis: `feed:home:{userId}:{page}`  
Post cached: `post:{postId}`  
Both invalidated on mutation.

## Related

- `services/api/node_api/src/modules/posts/`
- `05 - DATABASE/Posts.md`