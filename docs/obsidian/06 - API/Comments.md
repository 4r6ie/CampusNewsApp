# Comments

## Endpoints

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | /posts/:postId/comments | List comments | Yes |
| POST | /posts/:postId/comments | Create comment | Yes |
| PATCH | /comments/:id | Edit comment | owner/admin |
| DELETE | /comments/:id | Delete comment | owner/admin |

## Rules

- Users can edit/delete only their own comments
- Admins can moderate any comment
- Deleted comments use `status = 'deleted'`

## Related

- `services/api/node_api/src/modules/comments/`
- `05 - DATABASE/Comments.md`