# API Overview

Base path: `/api/v1`

## Standard Response

**Success:**
```json
{ "success": true, "data": { ... }, "meta": { "page": 1, "limit": 20, "total": 50 } }
```

**Error:**
```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Invalid request" } }
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No content |
| 400 | Bad request |
| 401 | Unauthenticated |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict (e.g. duplicate email) |
| 422 | Validation error |
| 429 | Rate limit exceeded |
| 500 | Server error |

## Authentication

Bearer token in `Authorization` header: `Bearer <access_token>`

Access token TTL: 15 minutes.  
Refresh token TTL: 7 days.

## Modules

- [[06 - API/Authentication|Auth]]
- [[06 - API/Users|Users]]
- [[06 - API/Posts|Posts]]
- [[06 - API/Comments|Comments]]
- [[06 - API/Likes|Likes]]
- [[06 - API/Announcements|Announcements]]
- [[06 - API/Search|Search]]
- [[06 - API/Notifications|Notifications]]
- [[06 - API/Admin|Admin]]

## See Also

- `04 - ARCHITECTURE/Backend Architecture.md`