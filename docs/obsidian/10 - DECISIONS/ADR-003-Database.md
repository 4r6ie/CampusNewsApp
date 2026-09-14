# ADR-003 — Database

**Status:** Accepted  
**Date:** September 14, 2026

## Context

Need durable relational storage with strong integrity for users, posts, comments, likes, and announcements.

## Decision

- **MySQL 8** as the source of truth
- UUID (VARCHAR 36) primary keys
- UTC `DATETIME` columns
- Raw SQL migrations (`database/migrations/*.sql`) as source of truth
- Prisma `schema.prisma` as tooling/type reference
- Soft deletion via `status` columns

## Consequences

- Referential integrity enforced by FK constraints with cascades
- UUIDs avoid enumeration attacks via sequential IDs
- Migrations order matters; apply via `scripts/migrate.sh`

## Related

- `05 - DATABASE/ERD.md`
- `04 - ARCHITECTURE/Database Architecture.md`