# Authentication

## Endpoints

### POST /auth/register
```json
{ "email": "student@campus.edu", "password": "securepass123", "fullName": "Juan Dela Cruz", "role": "student" }
```
Returns 201 with user + tokens.

### POST /auth/login
```json
{ "email": "student@campus.edu", "password": "securepass123" }
```
Returns 200 with user + tokens.

### POST /auth/refresh
```json
{ "refreshToken": "..." }
```
Returns 200 with new token pair.

### POST /auth/logout
Returns 204. Client discards tokens.

## Security

- Passwords hashed with bcrypt (12 rounds)
- Rate limit: 20 requests per 15 minutes on register/login
- JWT secret rotated via environment variables

## Related

- `services/api/node_api/src/modules/auth/`
- `06 - API/API Overview.md`