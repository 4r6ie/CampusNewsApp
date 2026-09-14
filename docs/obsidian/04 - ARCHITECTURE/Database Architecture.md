# Database Architecture

## Source of Truth

MySQL is the authoritative store for all persistent data. Redis is an optimization layer only — if cleared, the system recovers from MySQL.

## Key Design Decisions

- UUID primary keys for all tables (avoids sequential ID exposure)
- UTC timestamps in storage; local conversion in client
- Soft deletion via `status` columns (preserves audit history)
- Prisma schema as documentation reference; raw SQL migrations as source of truth
- Foreign key cascades on all user-owned records

## Timestamps

All `DATETIME` columns store UTC. Clients display Philippine/local time.

## Related

- `05 - DATABASE/ERD.md`
- `database/migrations/`