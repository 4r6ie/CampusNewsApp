# ADR-005 — Authentication

**Status:** Accepted  
**Date:** September 14, 2026

## Context

Need secure stateless authentication for the API and mobile app.

## Decision

- **JWT access + refresh tokens**
  - Access token: 15 min TTL
  - Refresh token: 7 days TTL
- Passwords hashed with **bcrypt** (12 rounds)
- Tokens stored in `flutter_secure_storage` on mobile
- Refresh endpoint issues a new token pair; refresh tokens carry a `jti` and are rotated (consumed) via a Redis session store
- Logout discards tokens client-side and revokes the session + push devices server-side

## Consequences

- Stateless `Authorization: Bearer <token>` auth
- Refresh token grants long-lived sessions without re-login
- Rate limiting on `/auth/*` prevents brute force

## Related

- `06 - API/Authentication.md`
- `services/api/node_api/src/modules/auth/`