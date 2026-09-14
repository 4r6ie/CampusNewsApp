# Test Plan

## Strategy

| Level | Examples | Target |
|-------|----------|--------|
| Unit | Services, validators, repositories, Dart logic | High coverage of business rules |
| Integration | API + MySQL + Redis | Critical endpoints |
| Widget | Feed card, login, comments, profile | Important UI components |
| E2E | Login → feed → like → comment → notification | Critical user journeys |
| Security | Auth bypass, injection, rate limits | No critical findings |
| Performance | Feed/search concurrent requests | Stable under expected load |

## Tools

- Backend: Jest + supertest (API integration), unit tests for services
- Flutter: `flutter_test` (widget), `integration_test`
- Admin: Vitest + React Testing Library

## Critical Test Cases

1. User registers with valid information
2. Duplicate email registration is rejected
3. Wrong password is rejected without leaking details
4. Protected endpoint rejects missing/invalid token
5. Student cannot use admin-only endpoint
6. Post pagination does not duplicate/skip records
7. User cannot create duplicate likes for same post
8. User cannot edit another user's comment
9. Deleted/hidden posts handled correctly
10. Urgent announcement triggers configured notification
11. Invalid push token deactivated
12. Search returns relevant, paginated results

## Related

- `08 - TESTING/Test Cases.md`
- `08 - TESTING/API Tests.md`