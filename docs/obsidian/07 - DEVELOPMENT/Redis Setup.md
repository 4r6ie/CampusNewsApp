# Redis Setup

## Docker (Development)

```bash
docker compose up -d redis
# Runs on port 6379
# AOF persistence enabled
# 256MB memory limit
```

## Config

- `infrastructure/docker/redis/redis.conf`

## Key Patterns

See `04 - ARCHITECTURE/Redis Architecture.md`.

## Verify

```bash
docker exec -it campusnewsapp-redis-1 redis-cli ping
# PONG
```

## Related

- `services/api/node_api/src/cache/`