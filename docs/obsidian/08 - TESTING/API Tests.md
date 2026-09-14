# API Tests

## Test File Location

`services/api/node_api/tests/integration/`

## Tools

Jest + supertest

## Critical API Tests

- Auth register → login → refresh → logout
- Feed pagination correctness
- Like idempotency
- Comment create/edit/delete ownership
- Announcement publish → notification created
- Search result relevance

## Running

```bash
cd services/api/node_api
npm run test:integration
```

## Related

- `08 - TESTING/Test Plan.md`