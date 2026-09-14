# MySQL Setup

## Docker (Development)

```bash
docker compose up -d mysql
# Runs on port 3306
# Database: campus_news
# User: campus_app / change_me
# Root password: change_me
```

## Migrations

```bash
./scripts/migrate.sh
```

Runs `database/migrations/001_users.sql` through `012_audit_logs.sql` in order.

## Config

- `infrastructure/docker/mysql/my.cnf` — charset, timezone, buffer pool
- UTC timestamps enforced via `default-time-zone=+00:00`

## Related

- `database/migrations/`
- `05 - DATABASE/ERD.md`