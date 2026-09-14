# Docker Setup

## Start Backend Stack

```bash
# Infra only (MySQL + Redis)
docker compose up -d mysql redis

# Full stack (with API)
docker compose up -d --build api
```

## Container Ports

| Service | Port |
|---------|------|
| API | 3000 |
| MySQL | 3306 |
| Redis | 6379 |

## Health Checks

All services have Docker healthchecks. API waits for MySQL and Redis before starting.

## Useful Commands

```bash
docker compose ps              # status
docker compose logs -f api     # API logs
docker compose down            # stop all
docker compose down -v         # stop + remove volumes
```

## Related

- `04 - ARCHITECTURE/Docker Architecture.md`
- `docker-compose.yml`