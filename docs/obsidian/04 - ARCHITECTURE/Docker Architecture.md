# Docker Architecture

## Services

| Service | Role | Port | Healthcheck |
|---------|------|------|-------------|
| `api` | Node.js REST API | 3000 | `GET /health` |
| `mysql` | MySQL 8 database | 3306 | `mysqladmin ping` |
| `redis` | Redis 7 cache | 6379 | `redis-cli ping` |

## Key Files

- `docker-compose.yml` — orchestrates all services
- `infrastructure/docker/api/Dockerfile` — multi-stage production build
- `infrastructure/docker/mysql/my.cnf` — MySQL config (charset, timezone, buffer pool)
- `infrastructure/docker/mysql/init.sql` — initial database creation
- `infrastructure/docker/redis/redis.conf` — AOF persistence, memory limit

## Development

```bash
docker compose up -d mysql redis   # infra only
docker compose up -d --build api   # full stack
```

## Production

Use production secrets (not committed). Managed MySQL/Redis preferred. Rolling or blue-green deploy.

## Related

- `07 - DEVELOPMENT/Docker Setup.md`
- `infrastructure/`