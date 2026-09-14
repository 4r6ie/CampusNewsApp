# Coding Standards

## TypeScript (Backend)

- Strict mode enabled
- Controllers: thin, delegate to services
- Services: business logic only
- Modules organized by domain (auth, posts, comments, etc.)
- Validate all inputs with Zod schemas
- Use `AppError` for typed errors (never expose stack traces)
- UTC timestamps in DB; local time in clients

## Dart (Flutter)

- Feature-first folder structure
- Riverpod for state management
- Map raw API responses into typed models
- Handle loading/error/empty states for every screen
- Use `flutter_secure_storage` for tokens (never shared preferences)

## Database

- MySQL is the source of truth
- Redis is optimization only
- Parameterized queries always (prevent SQL injection)
- UUID primary keys (no sequential IDs in API responses)
- Soft deletion via status columns

## Security

- Hash passwords with bcrypt (12 rounds)
- JWT expiration + refresh token rotation
- Rate limit auth/search/comment routes
- HTTPS in production only
- Secrets in environment variables; never in code

## Related

- `07 - DEVELOPMENT/Git Workflow.md`
- `09 - BUG TRACKING/Bug Tracker.md`