# Security Tests

## Focus Areas

| Area | What to test |
|------|--------------|
| Authentication bypass | Missing/invalid token on protected routes |
| Authorization | Student accessing admin endpoints |
| SQL injection | Special characters in search, email, body fields |
| Rate limiting | Burst requests to auth/search routes |
| XSS | Script injection in post body, comment body |
| Token security | Expired access token, reused refresh token |

## Related

- `tests/security/`
- `07 - DEVELOPMENT/Coding Standards.md`