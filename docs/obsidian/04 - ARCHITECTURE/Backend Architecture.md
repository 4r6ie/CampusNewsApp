# Backend Architecture

## Module Structure

```
services/api/node_api/src/
├── config/       — env, database, redis, firebase, logger
├── middleware/    — auth, role, validation, error, rate-limit, upload
├── modules/      — auth, users, posts, comments, likes, announcements, notifications, devices, search, reports, admin
├── database/     — prisma schema, seed, client
├── cache/        — cache service, keys, TTL
├── services/     — notification, upload, audit, search
├── utils/        — password, token, response, pagination
└── routes/       — router index
```

## Request Flow

1. Express receives request
2. Helmet / CORS / JSON parsing
3. Rate limiting
4. JWT authentication middleware (if protected route)
5. Role authorization middleware (if role-restricted)
6. Zod validation middleware (if body schema)
7. Controller → Service → Database/Redis
8. Response via `utils/response.ts` helpers

## Error Handling

Centralized `error.middleware.ts` handles `AppError`, `ZodError`, and uncaught errors.

## See Also

- `services/api/node_api/src/`
- `06 - API/API Overview.md`