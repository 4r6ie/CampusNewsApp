# Search

## Endpoint

### GET /search?q=<query>&page=1&limit=20

Returns both posts and announcements matching the query.

## Behavior

- Searches title and body fields
- Results cached in Redis: `search:{query}`
- TTL: 5 minutes
- Debounced on Flutter side (300ms)

## Related

- `services/api/node_api/src/modules/search/`
- `04 - ARCHITECTURE/Redis Architecture.md`