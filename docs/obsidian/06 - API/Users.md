# Users

## Endpoints

### GET /users/me
Returns current user profile.

### PATCH /users/me
Update profile fields. Body: `{ "fullName": "...", "course": "...", "bio": "..." }`

### GET /users/:id
Public profile view of another user.

## Profile Fields

studentNo, fullName, course, yearLevel, avatarUrl, bio

## Related

- `services/api/node_api/src/modules/users/`
- `05 - DATABASE/Profiles.md`